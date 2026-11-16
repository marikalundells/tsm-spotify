import { Box, Button, Typography } from '@mui/material';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DeviceModal from '../components/DeviceModal';

const DeviceLab = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#121212',
        color: 'white',
        px: 3,
        py: 4
      }}
    >
      <Button
        onClick={() => navigate('/dashboard')}
        startIcon={<ArrowBackRoundedIcon />}
        sx={{
          color: '#b3b3b3',
          textTransform: 'none',
          mb: 4
        }}
      >
        Tillbaka till dashboard
      </Button>

      <Box
        sx={{
          maxWidth: '720px',
          backgroundColor: '#181818',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          p: 3
        }}
      >
        <Typography
          sx={{
            fontSize: '34px',
            fontWeight: 900,
            mb: 1
          }}
        >
          Device Lab
        </Typography>

        <Typography
          sx={{
            color: '#b3b3b3',
            fontSize: '15px',
            lineHeight: 1.6,
            mb: 3
          }}
        >
          Det här är en separat testsida för Spotify Connect. Den påverkar inte din
          desktop-layout. Här testar vi bara att läsa devices och flytta playback
          säkert.
        </Typography>

        <Button
          variant="contained"
          startIcon={<DevicesRoundedIcon />}
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: '#1db954',
            color: '#111',
            fontWeight: 800,
            textTransform: 'none',
            borderRadius: '999px',
            px: 2.4,
            py: 1.1,
            '&:hover': {
              backgroundColor: '#1ed760'
            }
          }}
        >
          Öppna device-modal
        </Button>
      </Box>

      <DeviceModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default DeviceLab;