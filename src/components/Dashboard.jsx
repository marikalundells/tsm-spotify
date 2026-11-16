import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import SideNav from './SideNav';
import Player from './Player';


const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [deviceId, setDeviceId] = useState('');
  const [isPaused, setIsPaused] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState('');
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [previousVolume, setPreviousVolume] = useState(0.5);
  const [isShuffled, setIsShuffled] = useState(false);

  const sdkPlayerRef = useRef(null);
  const sdkLoadedRef = useRef(false);
  const progressIntervalRef = useRef(null);
  const pendingPlaybackRef = useRef(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const transferPlaybackToWebPlayer = useCallback(async (token, currentDeviceId) => {
    if (!token || !currentDeviceId) return false;

    const response = await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        device_ids: [currentDeviceId],
        play: false
      })
    });

    if (!response.ok && response.status !== 204) {
      return false;
    }

    return true;
  }, []);

  const playTrackInternal = useCallback(
    async (track, contextUri = null) => {
      const token = sessionStorage.getItem('accessToken');
      const sdkPlayer = sdkPlayerRef.current;

      if (!token) {
        setPlayerError('Ingen access token hittades.');
        return false;
      }

      if (!sdkPlayer || !deviceId || !playerReady) {
        pendingPlaybackRef.current = { track, contextUri };
        setPlayerError('Spotify-spelaren startar. Klicket är sparat.');
        return false;
      }

      try {
        setPlayerError('');

        await sdkPlayer.activateElement();

        const transferred = await transferPlaybackToWebPlayer(token, deviceId);
        if (!transferred) {
          setPlayerError('Kunde inte flytta playback till webbläsaren.');
          return false;
        }

        const body = contextUri
          ? {
              context_uri: contextUri,
              offset: { uri: track.uri },
              position_ms: 0
            }
          : {
              uris: [track.uri],
              position_ms: 0
            };

        const response = await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
          }
        );

        if (!response.ok && response.status !== 204) {
          const data = await response.json().catch(() => ({}));
          console.error('Start playback failed:', data);
          setPlayerError('Spotify kunde inte starta uppspelningen.');
          return false;
        }

        setCurrentTrack(track);
        setIsPaused(false);
        setPositionMs(0);
        setDurationMs(track.duration_ms || 0);
        pendingPlaybackRef.current = null;
        return true;
      } catch (error) {
        console.error('playTrack error:', error);
        setPlayerError('Något gick fel när uppspelningen skulle starta.');
        return false;
      }
    },
    [deviceId, playerReady, transferPlaybackToWebPlayer]
  );

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;
    if (sdkLoadedRef.current) return;

    sdkLoadedRef.current = true;

    const setupPlayer = () => {
      if (!window.Spotify) return;

      const player = new window.Spotify.Player({
        name: 'Spotify Clone Web Player',
        getOAuthToken: (cb) => {
          const freshToken = sessionStorage.getItem('accessToken');
          cb(freshToken || '');
        },
        volume: 0.5
      });

      player.addListener('initialization_error', ({ message }) => {
        setPlayerError(message || 'Kunde inte starta Spotify SDK.');
      });

      player.addListener('authentication_error', ({ message }) => {
        setPlayerError(message || 'Spotify kunde inte autentisera spelaren.');
      });

      player.addListener('account_error', ({ message }) => {
        setPlayerError(message || 'Spotify-kontot kan inte spela upp här.');
      });

      player.addListener('playback_error', ({ message }) => {
        setPlayerError(message || 'Ett uppspelningsfel uppstod.');
      });

      player.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        setPlayerReady(true);
        setPlayerError('');
      });

      player.addListener('not_ready', () => {
        setPlayerReady(false);
      });

      player.addListener('autoplay_failed', () => {
        setPlayerError('Webbläsaren blockerade autoplay. Klicka på låten igen.');
      });

      player.addListener('player_state_changed', (state) => {
        if (!state) return;

        setCurrentTrack(state.track_window.current_track || null);
        setIsPaused(state.paused);
        setPositionMs(state.position || 0);
        setDurationMs(state.duration || 0);
        setIsShuffled(Boolean(state.shuffle));
      });

      player.connect().then((success) => {
        if (!success) {
          setPlayerError('Spotify SDK kunde inte ansluta.');
        }
      });

      sdkPlayerRef.current = player;
    };

    window.onSpotifyWebPlaybackSDKReady = () => {
      setupPlayer();
    };

    if (window.Spotify) {
      setupPlayer();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://sdk.scdn.co/spotify-player.js"]'
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      if (sdkPlayerRef.current) {
        sdkPlayerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (playerReady && deviceId && pendingPlaybackRef.current) {
      const { track, contextUri } = pendingPlaybackRef.current;
      playTrackInternal(track, contextUri);
    }
  }, [playerReady, deviceId, playTrackInternal]);

  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    if (!isPaused && currentTrack && durationMs > 0) {
      progressIntervalRef.current = setInterval(() => {
        setPositionMs((prev) => {
          const next = prev + 1000;
          return next >= durationMs ? durationMs : next;
        });
      }, 1000);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPaused, currentTrack, durationMs]);

  const playTrack = async (track, contextUri = null) => {
    await playTrackInternal(track, contextUri);
  };

  const togglePlayback = async () => {
    const sdkPlayer = sdkPlayerRef.current;
    if (!sdkPlayer || !playerReady) return;

    try {
      await sdkPlayer.togglePlay();
    } catch {
      setPlayerError('Kunde inte pausa eller spela upp.');
    }
  };

  const playNext = async () => {
    const sdkPlayer = sdkPlayerRef.current;
    if (!sdkPlayer || !playerReady) return;

    try {
      await sdkPlayer.nextTrack();
    } catch {
      setPlayerError('Kunde inte hoppa till nästa låt.');
    }
  };

  const playPrevious = async () => {
    const sdkPlayer = sdkPlayerRef.current;
    if (!sdkPlayer || !playerReady) return;

    try {
      await sdkPlayer.previousTrack();
    } catch {
      setPlayerError('Kunde inte gå till föregående låt.');
    }
  };

  const toggleShuffle = async () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token || !deviceId || !playerReady) return;

    try {
      setPlayerError('');

      const response = await fetch(
        `https://api.spotify.com/v1/me/player/shuffle?state=${!isShuffled}&device_id=${deviceId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok && response.status !== 204) {
        const data = await response.json().catch(() => ({}));
        console.error('Shuffle error:', data);
        setPlayerError('Kunde inte ändra shuffle.');
        return;
      }

      setIsShuffled((prev) => !prev);
    } catch (error) {
      console.error('toggleShuffle error:', error);
      setPlayerError('Något gick fel med shuffle.');
    }
  };

  const changeVolume = async (newVolume) => {
    const sdkPlayer = sdkPlayerRef.current;
    if (!sdkPlayer || !playerReady) return;

    const safeVolume = Math.max(0, Math.min(1, newVolume));

    try {
      await sdkPlayer.setVolume(safeVolume);
      setVolume(safeVolume);

      if (safeVolume > 0) {
        setPreviousVolume(safeVolume);
      }
    } catch {
      setPlayerError('Kunde inte ändra volym.');
    }
  };

  const toggleMute = async () => {
    if (volume === 0) {
      await changeVolume(previousVolume || 0.5);
    } else {
      setPreviousVolume(volume);
      await changeVolume(0);
    }
  };

  const seekToPosition = async (newPositionMs) => {
    const sdkPlayer = sdkPlayerRef.current;
    if (!sdkPlayer || !currentTrack || !durationMs || !playerReady) return;

    const safePosition = Math.max(0, Math.min(durationMs, newPositionMs));

    try {
      await sdkPlayer.seek(safePosition);
      setPositionMs(safePosition);
    } catch {
      setPlayerError('Kunde inte hoppa i låten.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#000',
        overflow: 'hidden'
      }}
    >
      <SideNav />

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#121212',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            background:
              'linear-gradient(to bottom, #2a2a2a 0%, #181818 18%, #121212 40%, #121212 100%)'
          }}
        >
          <Outlet
            context={{
              setCurrentTrack,
              currentTrack,
              playTrack,
              playerReady,
              playerError
            }}
          />
        </Box>

        {!isLoading && (
          <Player
            track={currentTrack}
            isPaused={isPaused}
            onTogglePlay={togglePlayback}
            onNext={playNext}
            onPrevious={playPrevious}
            onToggleShuffle={toggleShuffle}
            isShuffled={isShuffled}
            playerReady={playerReady}
            playerError={playerError}
            positionMs={positionMs}
            durationMs={durationMs}
            volume={volume}
            onVolumeChange={changeVolume}
            onToggleMute={toggleMute}
            onSeek={seekToPosition}
          />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;