const getAccessTokenFromStorage = () => {
  return sessionStorage.getItem('accessToken');
};

export default getAccessTokenFromStorage;