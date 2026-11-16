import { clientId, redirectURL } from '../config/config';

const getAccessToken = async (code) => {
  const codeVerifier = localStorage.getItem('code_verifier');

  if (!clientId || !code || !codeVerifier) {
    throw new Error('Missing clientId, code, or code_verifier');
  }

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectURL,
    code_verifier: codeVerifier
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Spotify token exchange failed: ${errorText}`);
  }

  const tokenResponse = await response.json();

  return tokenResponse; // { access_token, refresh_token, expires_in }
};

export { getAccessToken };