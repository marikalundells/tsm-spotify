import { Box, Typography } from '@mui/material';
import SongRow from './SongRow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const SongTable = ({
  tracks = [],
  setCurrentTrack,
  currentTrack,
  playTrack,
  playlistUri = null
}) => {
  if (!tracks.length) return null;

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '44px minmax(240px, 1.8fr) minmax(180px, 1.2fr) 56px',
          alignItems: 'center',
          gap: 2,
          px: 2,
          pb: 1.2,
          borderBottom: '1px solid rgba(255,255,255,0.10)',
          color: '#b3b3b3',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          background:
            'linear-gradient(to bottom, rgba(18,18,18,0.96), rgba(18,18,18,0.96))'
        }}
      >
        <Typography sx={{ fontSize: '12px' }}>#</Typography>
        <Typography sx={{ fontSize: '12px' }}>TITLE</Typography>
        <Typography sx={{ fontSize: '12px', textAlign: 'right' }}>ALBUM</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AccessTimeIcon sx={{ fontSize: 16, color: '#b3b3b3' }} />
        </Box>
      </Box>

      <Box sx={{ pt: 1 }}>
        {tracks.map((trackItem, index) => (
          <SongRow
            key={(trackItem?.track || trackItem)?.id || index}
            trackItem={trackItem}
            index={index}
            currentTrack={currentTrack}
            setCurrentTrack={setCurrentTrack}
            playTrack={playTrack}
            playlistUri={playlistUri}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SongTable;