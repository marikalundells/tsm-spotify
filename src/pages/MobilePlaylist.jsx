import { Box, Typography } from '@mui/material';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMobileNowPlaying } from '../utils/mobileNowPlaying';

const MobileMiniPlayer = () => {
  const navigate = useNavigate();
  const [track, setTrack] = useState(getMobileNowPlaying());
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const syncTrack = () => {
      setTrack(getMobileNowPlaying());
    };

    window.addEventListener('mobile-now-playing-updated', syncTrack);
    window.addEventListener('storage', syncTrack);

    return () => {
      window.removeEventListener('mobile-now-playing-updated', syncTrack);
      window.removeEventListener('storage', syncTrack);
    };
  }, []);

  if (!track) return null;

  return (
    <Box
      onClick={() => navigate('/mobile/now-playing')}
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: '18px',
        background:
          'linear-gradient(180deg, rgba(126,79,31,0.98) 0%, rgba(98,58,22,0.98) 100%)',
        display: 'grid',
        gridTemplateColumns: '48px minmax(0,1fr) auto auto',
        alignItems: 'center',
        gap: 1,
        px: 1.15,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 10px 22px rgba(0,0,0,0.34)'
      }}
    >
      <Box
        component="img"
        src={track.image || '/Spotify_Logo.png'}
        alt={track.name}
        onError={(e) => {
          e.currentTarget.src = '/Spotify_Logo.png';
        }}
        sx={{
          width: 48,
          height: 48,
          borderRadius: '8px',
          objectFit: 'cover',
          backgroundColor: '#2a2a2a',
          flexShrink: 0
        }}
      />

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mb: 0.15
          }}
        >
          {track.name}
        </Typography>

        <Typography
          sx={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.82)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {track.artist}
        </Typography>
      </Box>

      <DevicesRoundedIcon sx={{ fontSize: 21, color: '#1ed760', flexShrink: 0 }} />

      <Box
        onClick={(event) => {
          event.stopPropagation();
          setIsPlaying((prev) => !prev);
        }}
        sx={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {isPlaying ? (
          <PauseRoundedIcon sx={{ color: '#fff', fontSize: 27 }} />
        ) : (
          <PlayArrowRoundedIcon sx={{ color: '#fff', fontSize: 27 }} />
        )}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: 8,
          right: 8,
          bottom: 3,
          height: 2,
          borderRadius: '999px',
          backgroundColor: 'rgba(255,255,255,0.16)',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            width: '22%',
            height: '100%',
            backgroundColor: '#fff'
          }}
        />
      </Box>
    </Box>
  );
};

export default MobileMiniPlayer;