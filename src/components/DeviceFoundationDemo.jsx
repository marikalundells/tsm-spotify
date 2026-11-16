import { Box, Button, Typography } from '@mui/material';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import { useState } from 'react';
import DeviceModal from './DeviceModal';

const DeviceFoundationDemo = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: '#121212',
        color: 'white',
        borderRadius: '18px',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <Typography
        sx={{
          fontSize: '22px',
          fontWeight: 800,
          mb: 1
        }}
      >
        Safe device foundation
      </Typography>

      <Typography
        sx={{
          color: '#b3b3b3',
          fontSize: '14px',
          lineHeight: 1.5,
          mb: 2
        }}
      >
        Den här komponenten är inte kopplad till desktop ännu. Den används bara för att
        testa Spotify devices säkert utan att röra din Dashboard eller Player.
      </Typography>

      <Button
        variant="contained"
        startIcon={<DevicesRoundedIcon />}
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: '#1db954',
          color: '#111',
          fontWeight: 700,
          textTransform: 'none',
          borderRadius: '999px',
          px: 2.2,
          '&:hover': {
            backgroundColor: '#1ed760'
          }
        }}
      >
        Öppna device-modal
      </Button>

      <DeviceModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default DeviceFoundationDemo;