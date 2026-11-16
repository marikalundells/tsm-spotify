const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  const clientId = localStorage.getItem('client_id'); // eller hårdkoda din client_id

  if (!refreshToken || !clientId) {
    throw new Error('Saknar refresh_token eller client_id');
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    throw new Error('Token refresh misslyckades — logga in igen');
  }

  const data = await response.json();

  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('token_expiry', Date.now() + data.expires_in * 1000);

  // Spotify roterar ibland refresh_token — spara ny om den skickas
  if (data.refresh_token) {
    localStorage.setItem('refresh_token', data.refresh_token);
  }

  return data.access_token;
};

export default refreshAccessToken;