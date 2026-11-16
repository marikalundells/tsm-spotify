const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

const getToken = () => sessionStorage.getItem('accessToken') || '';

const buildHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

const handleSpotifyError = async (response, fallbackMessage) => {
  const data = await parseJsonSafe(response);
  const message =
    data?.error?.message ||
    data?.message ||
    fallbackMessage ||
    'Spotify request failed';

  const error = new Error(message);
  error.status = response.status;
  error.payload = data;
  throw error;
};

export const getAvailableDevices = async () => {
  const token = getToken();

  if (!token) {
    throw new Error('Ingen access token hittades.');
  }

  const response = await fetch(`${SPOTIFY_API_BASE}/me/player/devices`, {
    method: 'GET',
    headers: buildHeaders()
  });

  if (!response.ok) {
    await handleSpotifyError(response, 'Kunde inte hämta tillgängliga devices.');
  }

  const data = await parseJsonSafe(response);
  return data.devices || [];
};

export const getPlaybackState = async () => {
  const token = getToken();

  if (!token) {
    throw new Error('Ingen access token hittades.');
  }

  const response = await fetch(`${SPOTIFY_API_BASE}/me/player`, {
    method: 'GET',
    headers: buildHeaders()
  });

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    await handleSpotifyError(response, 'Kunde inte hämta playback state.');
  }

  return await parseJsonSafe(response);
};

export const transferPlayback = async (deviceId, shouldPlay = false) => {
  const token = getToken();

  if (!token) {
    throw new Error('Ingen access token hittades.');
  }

  if (!deviceId) {
    throw new Error('Ingen deviceId skickades med.');
  }

  const response = await fetch(`${SPOTIFY_API_BASE}/me/player`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify({
      device_ids: [deviceId],
      play: shouldPlay
    })
  });

  if (!response.ok && response.status !== 204) {
    await handleSpotifyError(response, 'Kunde inte flytta playback till vald device.');
  }

  return true;
};

export const getNormalizedDevices = async () => {
  const [devices, playbackState] = await Promise.all([
    getAvailableDevices(),
    getPlaybackState().catch(() => null)
  ]);

  const activeDeviceId = playbackState?.device?.id || null;

  return devices.map((device) => ({
    id: device.id,
    name: device.name || 'Okänd device',
    type: device.type || 'Unknown',
    isActive: Boolean(device.is_active),
    isRestricted: Boolean(device.is_restricted),
    volumePercent:
      typeof device.volume_percent === 'number' ? device.volume_percent : null,
    supportsVolume:
      typeof device.volume_percent === 'number' && !device.is_restricted,
    isCurrentPlaybackDevice: device.id === activeDeviceId
  }));
};