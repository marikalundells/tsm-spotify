let spotifySdkPromise = null;

const loadSpotifySdk = () => {
  if (window.Spotify) {
    return Promise.resolve(window.Spotify);
  }

  if (spotifySdkPromise) {
    return spotifySdkPromise;
  }

  spotifySdkPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://sdk.scdn.co/spotify-player.js"]'
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    const timeoutId = window.setTimeout(() => {
      reject(new Error('Spotify SDK load timeout'));
    }, 15000);

    window.onSpotifyWebPlaybackSDKReady = () => {
      window.clearTimeout(timeoutId);
      resolve(window.Spotify);
    };

    if (window.Spotify) {
      window.clearTimeout(timeoutId);
      resolve(window.Spotify);
    }
  });

  return spotifySdkPromise;
};

export default loadSpotifySdk;