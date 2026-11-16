export const authEndpoint = 'https://accounts.spotify.com/authorize';

export const clientId = import.meta.env.VITE_CLIENT_ID;

export const redirectURL = 'http://127.0.0.1:5173/callback';

export const scopes = [
  'user-read-email',
  'user-read-private',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-playback-state',
  'user-modify-playback-state',
  'streaming',
  'user-library-read'
];