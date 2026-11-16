import { Box, Button } from '@mui/material';
import {
  authEndpoint,
  clientId,
  redirectURL,
  scopes
} from '../config/config';
import {
  generateCodeVerifier,
  generateCodeChallenge
} from '../utils/pkce';

async function redirectToSpotifyAuth() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem('code_verifier', codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scopes.join(' '),
    redirect_uri: redirectURL,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    show_dialog: 'true'
  });

  window.location.href = `${authEndpoint}?${params.toString()}`;
}

const Login = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'black'
      }}
    >
      <img
        src="/Spotify_Logo.png"
        alt="Spotify"
        style={{ marginBottom: '40px', width: '300px' }}
      />

      <Button
        onClick={redirectToSpotifyAuth}
        color="primary"
        variant="contained"
        size="large"
      >
        Login to Spotify
      </Button>
    </Box>
  );
};

export default Login;