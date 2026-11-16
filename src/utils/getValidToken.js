import refreshAccessToken from './refreshAccessToken';

const getValidToken = async () => {
  const token = localStorage.getItem('access_token');
  const expiry = parseInt(localStorage.getItem('token_expiry') || '0', 10);

  if (!token || Date.now() > expiry - 60_000) {
    return await refreshAccessToken();
  }

  return token;
};

export default getValidToken;