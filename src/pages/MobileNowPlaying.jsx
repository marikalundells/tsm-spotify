import { Box, Typography } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import RepeatRoundedIcon from '@mui/icons-material/RepeatRounded';
import SpeakerRoundedIcon from '@mui/icons-material/SpeakerRounded';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import QueueMusicRoundedIcon from '@mui/icons-material/QueueMusicRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import LyricsRoundedIcon from '@mui/icons-material/LyricsRounded';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMobileNowPlaying } from '../utils/mobileNowPlaying';

const formatTime = (ms = 0) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

function MobileNowPlaying() {
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(true);
  const [isShuffled, setIsShuffled] = useState(true);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [progressMs, setProgressMs] = useState(0);

  const track = getMobileNowPlaying();
  const totalMs = track?.duration_ms || 196000;

  useEffect(() => {
    if (!track) return;
    setProgressMs(0);
  }, [track]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgressMs((prev) => {
        const next = prev + 1000;
        if (next >= totalMs) return totalMs;
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, totalMs]);

  const progressPercent = useMemo(() => {
    if (!totalMs) return 0;
    return Math.max(0, Math.min(100, (progressMs / totalMs) * 100));
  }, [progressMs, totalMs]);

  if (!track) {
    return (
      <Box
        sx={{
          minHeight: '100%',
          color: 'white',
          px: 4,
          pt: 5,
          background:
            'linear-gradient(180deg, #7a4319 0%, #5f3216 24%, #2a1813 60%, #090909 100%)'
        }}
      >
        <Typography sx={{ color: '#d1d1d1', fontSize: '16px' }}>
          Ingen låt spelas just nu.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100%',
        color: 'white',
        px: 3.5,
        pt: 3.2,
        pb: 12,
        position: 'relative',
        background:
          'linear-gradient(180deg, #8a4b1d 0%, #6f3b18 20%, #442414 48%, #221512 74%, #090909 100%)'
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '36px 1fr 36px',
          alignItems: 'center',
          mb: 3.2
        }}
      >
        <Box
          onClick={() => navigate(-1)}
          sx={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <KeyboardArrowDownRoundedIcon sx={{ fontSize: 34, color: '#fff' }} />
        </Box>

        <Box sx={{ textAlign: 'center', minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.78)',
              mb: 0.15
            }}
          >
            Spelas från spellista
          </Typography>

          <Typography
            sx={{
              fontSize: '15px',
              fontWeight: 800,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {track.playlistName || 'Spelas nu'}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MoreHorizRoundedIcon sx={{ fontSize: 28, color: '#fff' }} />
        </Box>
      </Box>

      <Box
        component="img"
        src={track.image || '/Spotify_Logo.png'}
        alt={track.name}
        onError={(e) => {
          e.currentTarget.src = '/Spotify_Logo.png';
        }}
        sx={{
          width: '100%',
          maxWidth: 330,
          aspectRatio: '1 / 1',
          objectFit: 'cover',
          borderRadius: '14px',
          boxShadow: '0 22px 48px rgba(0,0,0,0.30)',
          mx: 'auto',
          display: 'block',
          mb: 4
        }}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          gap: 1.4,
          mb: 2.3
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '30px',
              fontWeight: 900,
              lineHeight: 1.04,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              mb: 0.4
            }}
          >
            {track.name}
          </Typography>

          <Typography
            sx={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.78)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {track.artist}
          </Typography>
        </Box>

        <Box
          onClick={() => setIsLiked((prev) => !prev)}
          sx={{
            width: 42,
            height: 42,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          {isLiked ? (
            <FavoriteRoundedIcon sx={{ fontSize: 33, color: '#1ed760' }} />
          ) : (
            <FavoriteBorderRoundedIcon sx={{ fontSize: 33, color: '#fff' }} />
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 0.7 }}>
        <Box
          sx={{
            height: 4,
            borderRadius: '999px',
            backgroundColor: 'rgba(255,255,255,0.24)',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: '#fff',
              borderRadius: '999px'
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 3.1
        }}
      >
        <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.78)' }}>
          {formatTime(progressMs)}
        </Typography>

        <Typography sx={{ fontSize: '12px', color: 'rgba(255,255,255,0.78)' }}>
          -{formatTime(Math.max(totalMs - progressMs, 0))}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          alignItems: 'center',
          mb: 3.1
        }}
      >
        <Box
          onClick={() => setIsShuffled((prev) => !prev)}
          sx={{
            justifySelf: 'start',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <ShuffleRoundedIcon sx={{ fontSize: 29, color: isShuffled ? '#1ed760' : '#fff' }} />
        </Box>

        <Box sx={{ justifySelf: 'center', display: 'flex', alignItems: 'center' }}>
          <SkipPreviousRoundedIcon sx={{ fontSize: 48, color: '#fff' }} />
        </Box>

        <Box
          onClick={() => setIsPlaying((prev) => !prev)}
          sx={{
            width: 82,
            height: 82,
            borderRadius: '50%',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            justifySelf: 'center',
            cursor: 'pointer'
          }}
        >
          {isPlaying ? (
            <PauseRoundedIcon sx={{ color: '#111', fontSize: 46 }} />
          ) : (
            <PlayArrowRoundedIcon sx={{ color: '#111', fontSize: 48, ml: 0.25 }} />
          )}
        </Box>

        <Box sx={{ justifySelf: 'center', display: 'flex', alignItems: 'center' }}>
          <SkipNextRoundedIcon sx={{ fontSize: 48, color: '#fff' }} />
        </Box>

        <Box
          onClick={() => setIsRepeatOn((prev) => !prev)}
          sx={{
            justifySelf: 'end',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <RepeatRoundedIcon sx={{ fontSize: 29, color: isRepeatOn ? '#1ed760' : '#fff' }} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2.2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <DevicesRoundedIcon sx={{ fontSize: 22, color: '#1ed760' }} />
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#1ed760' }}>
            Device vald
          </Typography>
        </Box>

        <SpeakerRoundedIcon sx={{ fontSize: 22, color: '#f2f2f2' }} />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LyricsRoundedIcon sx={{ fontSize: 25, color: '#f2f2f2' }} />
          <IosShareRoundedIcon sx={{ fontSize: 25, color: '#f2f2f2' }} />
        </Box>

        <QueueMusicRoundedIcon sx={{ fontSize: 27, color: '#f2f2f2', mr: 2 }} />
        <DevicesRoundedIcon sx={{ fontSize: 27, color: '#f2f2f2' }} />
      </Box>
    </Box>
  );
}

export default MobileNowPlaying;