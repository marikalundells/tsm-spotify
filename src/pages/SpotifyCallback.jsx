import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../utils/getAccessToken';

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const runCallback = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get('code');
        const codeVerifier = localStorage.getItem('code_verifier');

        if (!code || !codeVerifier) {
          console.warn('Missing code or code_verifier');
          navigate('/login', { replace: true });
          return;
        }

        const tokenData = await getAccessToken(code);

        if (!tokenData?.access_token) {
          console.error('Ingen access token kom tillbaka från Spotify');
          navigate('/login', { replace: true });
          return;
        }

        // Desktop använder sessionStorage
        sessionStorage.setItem('accessToken', tokenData.access_token);

        // Mobile refresh-flödet använder localStorage
        localStorage.setItem('access_token', tokenData.access_token);
        localStorage.setItem('refresh_token', tokenData.refresh_token ?? '');
        localStorage.setItem('token_expiry', Date.now() + (tokenData.expires_in ?? 3600) * 1000);

        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Error handling Spotify callback:', error);
        sessionStorage.removeItem('accessToken');
        navigate('/login', { replace: true });
      }
    };

    runCallback();
  }, [navigate]);

  return <p style={{ color: 'white', padding: '24px' }}>Logging you in...</p>;
};

export default SpotifyCallback;