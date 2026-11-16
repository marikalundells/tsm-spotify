import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const PlaylistItem = ({ playlist }) => {
  const imageUrl = playlist?.images?.[0]?.url || '/Spotify_Logo.png';
  const playlistName = playlist?.name || 'Okänd spellista';

  return (
    <Box
      component={Link}
      to={`/dashboard/playlist/${playlist.id}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        border: '1px solid #333',
        borderRadius: 2,
        backgroundColor: '#111',
        textDecoration: 'none',
        color: 'white'
      }}
    >
      <img
        src={imageUrl}
        alt={playlistName}
        style={{
          width: '64px',
          height: '64px',
          objectFit: 'cover',
          borderRadius: '8px'
        }}
      />

      <Box>
        <Typography variant="h6">
          {playlistName}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Öppna spellista
        </Typography>
      </Box>
    </Box>
  );
};

export default PlaylistItem;