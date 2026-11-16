import loadSpotifySdk from './loadSpotifySdk';
import getAccessTokenFromStorage from './getAccessTokenFromStorage';
import { setMobileNowPlaying } from './mobileNowPlaying';

const STORAGE_KEYS = {
  deviceId: 'mobile_playback_device_id',
  isReady: 'mobile_playback_ready',
  state: 'mobile_playback_state',
  selectedDeviceId: 'mobile_selected_device_id'
};

let playerInstance = null;
let initPromise = null;
let currentState = null;

const emit = (name, detail = {}) => {
  window.dispatchEvent(new CustomEvent(name, { detail }));
};

const saveJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`saveJson failed for ${key}`, error);
  }
};

const loadJson = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`loadJson failed for ${key}`, error);
    return fallback;
  }
};

const spotifyApi = async (path, options = {}) => {
  const token = getAccessTokenFromStorage();

  if (!token) {
    throw new Error('No Spotify access token found');
  }

  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    let message = `Spotify API error ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.error?.message) {
        message = errorData.error.message;
      }
    } catch {
      // ignore json parse errors
    }
    throw new Error(message);
  }

  return response;
};

export const getMobilePlaybackDeviceId = () => {
  return loadJson(STORAGE_KEYS.deviceId, null);
};

export const getMobilePlaybackReady = () => {
  return loadJson(STORAGE_KEYS.isReady, false);
};

export const getMobilePlaybackState = () => {
  return loadJson(STORAGE_KEYS.state, null);
};

export const getMobilePlaybackPlayer = () => {
  return playerInstance;
};

export const saveMobileSelectedDeviceId = (deviceId) => {
  saveJson(STORAGE_KEYS.selectedDeviceId, deviceId);
};

export const getMobileSelectedDeviceId = () => {
  return loadJson(STORAGE_KEYS.selectedDeviceId, null);
};

export const clearMobileSelectedDeviceId = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.selectedDeviceId);
  } catch (error) {
    console.error('clearMobileSelectedDeviceId failed', error);
  }
};

const normalizeSdkState = (state) => {
  if (!state?.track_window?.current_track) return null;

  const track = state.track_window.current_track;

  return {
    paused: state.paused,
    position: state.position,
    duration: state.duration,
    repeat_mode: state.repeat_mode,
    shuffle: state.shuffle,
    current_track: {
      id: track.id,
      name: track.name,
      duration_ms: track.duration_ms,
      uri: track.uri,
      artists: track.artists?.map((artist) => ({ name: artist.name })) || [],
      album: {
        name: track.album?.name,
        images: track.album?.images || []
      }
    }
  };
};

const syncNowPlayingFromState = (normalizedState) => {
  if (!normalizedState?.current_track) return;

  const track = normalizedState.current_track;

  setMobileNowPlaying({
    id: track.id,
    name: track.name,
    artist: track.artists?.map((artist) => artist.name).join(', ') || 'Spotify',
    image: track.album?.images?.[0]?.url || '/Spotify_Logo.png',
    duration_ms: track.duration_ms || 0,
    playlistName: 'Spelas nu'
  });
};

export const initializeMobilePlayback = async () => {
  if (playerInstance) {
    return playerInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const token = getAccessTokenFromStorage();

    if (!token) {
      throw new Error('No Spotify access token found');
    }

    const Spotify = await loadSpotifySdk();

    playerInstance = new Spotify.Player({
      name: 'TSM Mobile Player',
      getOAuthToken: (callback) => {
        const freshToken = getAccessTokenFromStorage();
        callback(freshToken || '');
      },
      volume: 0.8
    });

    playerInstance.addListener('initialization_error', ({ message }) => {
      console.error('Spotify initialization_error:', message);
      emit('mobile-playback-error', { type: 'initialization_error', message });
    });

    playerInstance.addListener('authentication_error', ({ message }) => {
      console.error('Spotify authentication_error:', message);
      emit('mobile-playback-error', { type: 'authentication_error', message });
    });

    playerInstance.addListener('account_error', ({ message }) => {
      console.error('Spotify account_error:', message);
      emit('mobile-playback-error', { type: 'account_error', message });
    });

    playerInstance.addListener('playback_error', ({ message }) => {
      console.error('Spotify playback_error:', message);
      emit('mobile-playback-error', { type: 'playback_error', message });
    });

    playerInstance.addListener('autoplay_failed', () => {
      console.warn('Spotify autoplay_failed');
      emit('mobile-playback-autoplay-failed');
    });

    playerInstance.addListener('ready', ({ device_id }) => {
      saveJson(STORAGE_KEYS.deviceId, device_id);
      saveJson(STORAGE_KEYS.isReady, true);

      if (!getMobileSelectedDeviceId()) {
        saveMobileSelectedDeviceId(device_id);
      }

      emit('mobile-playback-ready', { deviceId: device_id });
    });

    playerInstance.addListener('not_ready', ({ device_id }) => {
      saveJson(STORAGE_KEYS.isReady, false);
      emit('mobile-playback-not-ready', { deviceId: device_id });
    });

    playerInstance.addListener('player_state_changed', (state) => {
      currentState = state;
      const normalizedState = normalizeSdkState(state);

      saveJson(STORAGE_KEYS.state, normalizedState);
      syncNowPlayingFromState(normalizedState);
      emit('mobile-playback-state-changed', { state: normalizedState });
    });

    const connected = await playerInstance.connect();

    if (!connected) {
      throw new Error('Spotify player failed to connect');
    }

    return playerInstance;
  })();

  return initPromise;
};

export const ensureMobilePlaybackReady = async () => {
  await initializeMobilePlayback();

  const deviceId = getMobilePlaybackDeviceId();

  if (!deviceId) {
    throw new Error('Spotify player initialized but no device id yet');
  }

  return deviceId;
};

export const activateMobilePlaybackElement = async () => {
  const player = await initializeMobilePlayback();

  if (player?.activateElement) {
    try {
      await player.activateElement();
    } catch (error) {
      console.warn('activateElement failed:', error);
    }
  }

  return player;
};

export const transferPlaybackToMobileDevice = async (play = false) => {
  const deviceId = getMobileSelectedDeviceId() || getMobilePlaybackDeviceId();

  if (!deviceId) {
    throw new Error('Missing mobile playback device id');
  }

  await spotifyApi('/me/player', {
    method: 'PUT',
    body: JSON.stringify({
      device_ids: [deviceId],
      play
    })
  });

  return true;
};

export const playContextOnMobileDevice = async (contextUri, offsetUri = null) => {
  const deviceId = await ensureMobilePlaybackReady();

  await activateMobilePlaybackElement();
  await transferPlaybackToMobileDevice(false);

  const body = {
    context_uri: contextUri
  };

  if (offsetUri) {
    body.offset = { uri: offsetUri };
  }

  await spotifyApi(`/me/player/play?device_id=${encodeURIComponent(deviceId)}`, {
    method: 'PUT',
    body: JSON.stringify(body)
  });

  return true;
};

export const playTracksOnMobileDevice = async (uris = [], startIndex = 0) => {
  const deviceId = await ensureMobilePlaybackReady();

  if (!Array.isArray(uris) || uris.length === 0) {
    throw new Error('No track uris provided');
  }

  await activateMobilePlaybackElement();
  await transferPlaybackToMobileDevice(false);

  await spotifyApi(`/me/player/play?device_id=${encodeURIComponent(deviceId)}`, {
    method: 'PUT',
    body: JSON.stringify({
      uris,
      offset: {
        position: startIndex
      }
    })
  });

  return true;
};

export const pauseMobilePlayback = async () => {
  const deviceId = getMobileSelectedDeviceId() || getMobilePlaybackDeviceId();

  if (!deviceId) {
    throw new Error('Missing mobile playback device id');
  }

  await spotifyApi(`/me/player/pause?device_id=${encodeURIComponent(deviceId)}`, {
    method: 'PUT'
  });
};

export const resumeMobilePlayback = async () => {
  const deviceId = getMobileSelectedDeviceId() || getMobilePlaybackDeviceId();

  if (!deviceId) {
    throw new Error('Missing mobile playback device id');
  }

  await activateMobilePlaybackElement();

  await spotifyApi(`/me/player/play?device_id=${encodeURIComponent(deviceId)}`, {
    method: 'PUT'
  });
};

export const nextMobileTrack = async () => {
  const deviceId = getMobileSelectedDeviceId() || getMobilePlaybackDeviceId();

  if (!deviceId) {
    throw new Error('Missing mobile playback device id');
  }

  await spotifyApi(`/me/player/next?device_id=${encodeURIComponent(deviceId)}`, {
    method: 'POST'
  });
};

export const previousMobileTrack = async () => {
  const deviceId = getMobileSelectedDeviceId() || getMobilePlaybackDeviceId();

  if (!deviceId) {
    throw new Error('Missing mobile playback device id');
  }

  await spotifyApi(`/me/player/previous?device_id=${encodeURIComponent(deviceId)}`, {
    method: 'POST'
  });
};

export const getCurrentMobilePlaybackState = async () => {
  if (playerInstance) {
    return playerInstance.getCurrentState();
  }

  return currentState;
};