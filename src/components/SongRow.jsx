import { Box, IconButton, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import formatDuration from '../utils/formatDuration';
import { useState } from 'react';

const SongRow = ({
  trackItem,
  index,
  currentTrack,
  setCurrentTrack,
  playTrack,
  playlistUri
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const spotifyTrack = trackItem?.track || trackItem;
  if (!spotifyTrack) return null;

  const isActive = currentTrack?.uri === spotifyTrack?.uri;

  const albumImage = spotifyTrack.album?.images?.[0]?.url || '/Spotify_Logo.png';
  const trackName = spotifyTrack.name || 'Okänd låt';
  const artistNames =
    spotifyTrack.artists?.map((artist) => artist.name).join(', ') || 'Okänd artist';
  const albumName = spotifyTrack.album?.name || '-';
  const duration = formatDuration(spotifyTrack.duration_ms || 0);

  const handlePlay = (event) => {
    event.stopPropagation();
    setCurrentTrack?.(spotifyTrack);
    playTrack?.(spotifyTrack, playlistUri || null);
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlay}
      sx={{
        display: 'grid',
        gridTemplateColumns: '44px minmax(240px, 1.8fr) minmax(180px, 1.2fr) 56px',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1.1,
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'background-color 0.18s ease',
        backgroundColor: isHovered || isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.08)'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isActive ? '#1db954' : '#b3b3b3',
          fontSize: '16px',
          fontWeight: 500
        }}
      >
        {isHovered ? (
          <IconButton
            onClick={handlePlay}
            sx={{
              color: isActive ? '#1db954' : 'white',
              p: 0.25
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 24 }} />
          </IconButton>
        ) : isActive ? (
          <VolumeUpIcon sx={{ fontSize: 20 }} />
        ) : (
          <Typography sx={{ fontSize: '16px', color: '#b3b3b3' }}>
            {index + 1}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          gap: 1.5
        }}
      >
        <Box
          component="img"
          src={albumImage}
          alt={trackName}
          sx={{
            width: 40,
            height: 40,
            objectFit: 'cover',
            borderRadius: '4px',
            flexShrink: 0
          }}
        />

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 700,
              color: isActive ? '#1db954' : 'white',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {trackName}
          </Typography>

          <Typography
            sx={{
              fontSize: '13px',
              color: '#b3b3b3',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {artistNames}
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: '13px',
          color: '#b3b3b3',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'right'
        }}
      >
        {albumName}
      </Typography>

      <Typography
        sx={{
          fontSize: '13px',
          color: '#b3b3b3',
          textAlign: 'right'
        }}
      >
        {duration}
      </Typography>
    </Box>
  );
};

export default SongRow;