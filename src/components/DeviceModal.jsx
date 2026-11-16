import {
  Box,
  Button,
  Dialog,
  IconButton,
  Typography
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LaptopMacRoundedIcon from '@mui/icons-material/LaptopMacRounded';
import PhoneIphoneRoundedIcon from '@mui/icons-material/PhoneIphoneRounded';
import SpeakerRoundedIcon from '@mui/icons-material/SpeakerRounded';
import TvRoundedIcon from '@mui/icons-material/TvRounded';
import HeadphonesRoundedIcon from '@mui/icons-material/HeadphonesRounded';
import DevicesOtherRoundedIcon from '@mui/icons-material/DevicesOtherRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getNormalizedDevices,
  transferPlayback
} from '../utils/spotifyDevices';
import { saveMobileSelectedDeviceId } from '../utils/mobilePlayback';

const getDeviceIcon = (type) => {
  const normalizedType = (type || '').toLowerCase();

  if (normalizedType.includes('computer')) return LaptopMacRoundedIcon;
  if (normalizedType.includes('smartphone')) return PhoneIphoneRoundedIcon;
  if (normalizedType.includes('speaker')) return SpeakerRoundedIcon;
  if (normalizedType.includes('tv')) return TvRoundedIcon;
  if (normalizedType.includes('avr')) return SpeakerRoundedIcon;
  if (normalizedType.includes('cast')) return TvRoundedIcon;
  if (normalizedType.includes('audio dongle')) return HeadphonesRoundedIcon;

  return DevicesOtherRoundedIcon;
};

const DeviceRow = ({
  device,
  onSelect,
  isSubmitting
}) => {
  const DeviceIcon = getDeviceIcon(device.type);

  return (
    <Box
      onClick={() => {
        if (!device.isRestricted && !isSubmitting) {
          onSelect(device.id);
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1.75,
        borderRadius: '14px',
        backgroundColor: device.isActive
          ? 'rgba(29,185,84,0.10)'
          : 'rgba(255,255,255,0.03)',
        border: device.isActive
          ? '1px solid rgba(29,185,84,0.32)'
          : '1px solid rgba(255,255,255,0.06)',
        cursor: device.isRestricted ? 'not-allowed' : 'pointer',
        opacity: device.isRestricted ? 0.55 : 1,
        transition:
          'background-color 0.18s ease, border-color 0.18s ease, transform 0.18s ease',
        '&:hover': device.isRestricted
          ? {}
          : {
              backgroundColor: device.isActive
                ? 'rgba(29,185,84,0.12)'
                : 'rgba(255,255,255,0.05)',
              transform: 'translateY(-1px)'
            }
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: device.isActive
            ? 'rgba(29,185,84,0.14)'
            : 'rgba(255,255,255,0.04)',
          flexShrink: 0
        }}
      >
        <DeviceIcon
          sx={{
            color: device.isActive ? '#1db954' : 'white',
            fontSize: 24
          }}
        />
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            color: device.isActive ? '#1db954' : 'white',
            fontSize: '18px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {device.name}
        </Typography>

        <Typography
          sx={{
            color: '#b3b3b3',
            fontSize: '13px',
            mt: 0.35
          }}
        >
          {device.type}
          {device.isRestricted ? ' • Begränsad device' : ''}
          {device.isCurrentPlaybackDevice ? ' • Aktiv playback' : ''}
        </Typography>
      </Box>

      {device.isActive && (
        <CheckCircleRoundedIcon
          sx={{
            color: '#1db954',
            fontSize: 24,
            flexShrink: 0
          }}
        />
      )}
    </Box>
  );
};

const DeviceModal = ({
  open,
  onClose,
  onDeviceSelected
}) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittingId, setSubmittingId] = useState('');
  const [error, setError] = useState('');

  const loadDevices = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const normalizedDevices = await getNormalizedDevices();
      setDevices(normalizedDevices);
    } catch (err) {
      console.error('DeviceModal loadDevices error:', err);
      setError(err.message || 'Kunde inte läsa devices från Spotify.');
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadDevices();
    }
  }, [open, loadDevices]);

  const activeDevice = useMemo(
    () => devices.find((device) => device.isActive) || null,
    [devices]
  );

  const handleTransferPlayback = async (deviceId) => {
    try {
      setSubmittingId(deviceId);
      setError('');

      await transferPlayback(deviceId, false);
      saveMobileSelectedDeviceId(deviceId);

      if (onDeviceSelected) {
        onDeviceSelected(deviceId);
      }

      await loadDevices();
      onClose?.();
    } catch (err) {
      console.error('handleTransferPlayback error:', err);
      setError(err.message || 'Kunde inte flytta playback till vald device.');
    } finally {
      setSubmittingId('');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: '#121212',
          color: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)'
        }
      }}
    >
      <Box sx={{ px: 3, py: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2
          }}
        >
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 800,
              color: 'white'
            }}
          >
            Connect
          </Typography>

          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        {activeDevice && (
          <Box
            sx={{
              mb: 2,
              px: 2,
              py: 1.6,
              borderRadius: '16px',
              backgroundColor: 'rgba(29,185,84,0.08)',
              border: '1px solid rgba(29,185,84,0.22)'
            }}
          >
            <Typography
              sx={{
                color: '#1db954',
                fontSize: '14px',
                fontWeight: 700,
                mb: 0.4
              }}
            >
              Aktiv device
            </Typography>

            <Typography
              sx={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              {activeDevice.name}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            onClick={loadDevices}
            startIcon={<RefreshRoundedIcon />}
            sx={{
              color: '#b3b3b3',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Uppdatera
          </Button>
        </Box>

        {loading ? (
          <Typography sx={{ color: '#b3b3b3', py: 3 }}>
            Läser devices...
          </Typography>
        ) : devices.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.3
            }}
          >
            {devices.map((device) => (
              <DeviceRow
                key={device.id}
                device={device}
                onSelect={handleTransferPlayback}
                isSubmitting={submittingId === device.id}
              />
            ))}
          </Box>
        ) : (
          <Typography sx={{ color: '#b3b3b3', py: 3 }}>
            Inga Spotify Connect-devices hittades just nu.
          </Typography>
        )}

        {error && (
          <Box
            sx={{
              mt: 2,
              px: 2,
              py: 1.4,
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Typography
              sx={{
                color: '#ff6b6b',
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              Device-fel
            </Typography>

            <Typography
              sx={{
                color: '#b3b3b3',
                fontSize: '13px',
                mt: 0.4,
                lineHeight: 1.45
              }}
            >
              {error}
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default DeviceModal;