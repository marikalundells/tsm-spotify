import { Box, IconButton, Slider, Tooltip, Typography } from '@mui/material';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import DevicesIcon from '@mui/icons-material/Devices';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';

const formatTime = (ms = 0) => {
  if (!ms || ms < 0) return '0:00';

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const Player = ({
  track,
  isPaused,
  onTogglePlay,
  onNext,
  onPrevious,
  onToggleShuffle,
  isShuffled,
  playerReady,
  playerError,
  positionMs,
  durationMs,
  volume,
  onVolumeChange,
  onToggleMute,
  onSeek
}) => {
  const hasTrack = Boolean(track);
  const safeDuration = durationMs || track?.duration_ms || 0;
  const safePosition = Math.min(positionMs || 0, safeDuration);
  const isMuted = volume === 0;

  const handleSeekChange = (_, value) => {
    if (!hasTrack) return;
    onSeek?.(value);
  };

  const handleVolumeChange = (_, value) => {
    onVolumeChange?.(value);
  };

  return (
    <Box
      sx={{
        height: '92px',
        borderTop: '1px solid #282828',
        backgroundColor: '#181818',
        px: 2,
        display: 'grid',
        gridTemplateColumns: 'minmax(220px, 1fr) minmax(320px, 520px) minmax(220px, 1fr)',
        alignItems: 'center',
        gap: 2,
        flexShrink: 0
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          gap: 1.6
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#2a2a2a',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {track?.album?.images?.[0]?.url ? (
            <Box
              component="img"
              src={track.album.images[0].url}
              alt={track.name || 'Track cover'}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <MusicNoteRoundedIcon
              sx={{
                fontSize: 24,
                color: '#d0d0d0'
              }}
            />
          )}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: 'white',
              fontSize: '14px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {track?.name || 'Ingen låt vald'}
          </Typography>

          <Typography
            sx={{
              color: '#b3b3b3',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {track?.artists?.map((artist) => artist.name).join(', ') || 'Artist'}
          </Typography>
        </Box>

        <Tooltip title="Inte byggd ännu">
          <span>
            <IconButton
              disabled
              sx={{
                color: '#b3b3b3',
                opacity: 0.45,
                cursor: 'not-allowed'
              }}
            >
              <FavoriteBorderIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 0
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.4,
            mb: 0.6
          }}
        >
          <Tooltip
            title={
              !hasTrack
                ? 'Ingen låt vald'
                : !playerReady
                ? 'Spotify-spelaren är inte redo ännu'
                : isShuffled
                ? 'Stäng av shuffle'
                : 'Sätt på shuffle'
            }
          >
            <span>
              <IconButton
                onClick={onToggleShuffle}
                disabled={!hasTrack || !playerReady}
                sx={{
                  color: isShuffled ? '#1db954' : '#b3b3b3',
                  '&:hover': {
                    color: isShuffled ? '#1ed760' : 'white'
                  }
                }}
              >
                <ShuffleIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={hasTrack && playerReady ? 'Föregående' : 'Ingen aktiv låt'}>
            <span>
              <IconButton
                onClick={onPrevious}
                disabled={!hasTrack || !playerReady}
                sx={{
                  color: '#b3b3b3',
                  '&:hover': {
                    color: 'white'
                  }
                }}
              >
                <SkipPreviousIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip
            title={
              !hasTrack
                ? 'Ingen låt vald'
                : !playerReady
                ? 'Spotify-spelaren är inte redo ännu'
                : isPaused
                ? 'Spela'
                : 'Pausa'
            }
          >
            <span>
              <IconButton
                onClick={onTogglePlay}
                disabled={!hasTrack || !playerReady}
                sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: 'white',
                  color: 'black',
                  '&:hover': {
                    backgroundColor: '#f2f2f2',
                    transform: 'scale(1.03)'
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#6d6d6d',
                    color: '#d0d0d0'
                  }
                }}
              >
                {isPaused ? (
                  <PlayArrowIcon sx={{ fontSize: 30 }} />
                ) : (
                  <PauseIcon sx={{ fontSize: 28 }} />
                )}
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={hasTrack && playerReady ? 'Nästa' : 'Ingen aktiv låt'}>
            <span>
              <IconButton
                onClick={onNext}
                disabled={!hasTrack || !playerReady}
                sx={{
                  color: '#b3b3b3',
                  '&:hover': {
                    color: 'white'
                  }
                }}
              >
                <SkipNextIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '40px 1fr 40px',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography
            sx={{
              color: '#b3b3b3',
              fontSize: '12px',
              textAlign: 'right'
            }}
          >
            {formatTime(safePosition)}
          </Typography>

          <Slider
            min={0}
            max={safeDuration || 100}
            value={safePosition}
            onChange={handleSeekChange}
            disabled={!hasTrack || !playerReady}
            sx={{
              color: 'white',
              height: 4,
              p: 0,
              '& .MuiSlider-rail': {
                opacity: 1,
                backgroundColor: '#5a5a5a'
              },
              '& .MuiSlider-track': {
                border: 'none'
              },
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                backgroundColor: 'white',
                boxShadow: 'none',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 6px rgba(255,255,255,0.12)'
                }
              }
            }}
          />

          <Typography
            sx={{
              color: '#b3b3b3',
              fontSize: '12px'
            }}
          >
            {formatTime(safeDuration)}
          </Typography>
        </Box>

        {playerError && (
          <Typography
            sx={{
              color: '#ff6b6b',
              fontSize: '12px',
              mt: 0.6
            }}
          >
            {playerError}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 0.4,
          minWidth: 0
        }}
      >
        <Tooltip title="Inte byggd ännu">
          <span>
            <IconButton
              disabled
              sx={{
                color: '#b3b3b3',
                opacity: 0.45,
                cursor: 'not-allowed'
              }}
            >
              <QueueMusicIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Inte byggd ännu">
          <span>
            <IconButton
              disabled
              sx={{
                color: '#b3b3b3',
                opacity: 0.45,
                cursor: 'not-allowed'
              }}
            >
              <DevicesIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={isMuted ? 'Slå på ljud' : 'Stäng av ljud'}>
          <span>
            <IconButton
              onClick={onToggleMute}
              disabled={!playerReady}
              sx={{
                color: '#b3b3b3',
                '&:hover': {
                  color: 'white'
                }
              }}
            >
              {isMuted ? <VolumeOffIcon sx={{ fontSize: 22 }} /> : <VolumeUpIcon sx={{ fontSize: 22 }} />}
            </IconButton>
          </span>
        </Tooltip>

        <Slider
          min={0}
          max={1}
          step={0.01}
          value={typeof volume === 'number' ? volume : 0.5}
          onChange={handleVolumeChange}
          disabled={!playerReady}
          sx={{
            width: 110,
            color: 'white',
            height: 4,
            mx: 0.5,
            '& .MuiSlider-rail': {
              opacity: 1,
              backgroundColor: '#5a5a5a'
            },
            '& .MuiSlider-track': {
              border: 'none'
            },
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              backgroundColor: 'white',
              boxShadow: 'none',
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 6px rgba(255,255,255,0.12)'
              }
            }
          }}
        />

        <Tooltip title="Inte byggd ännu">
          <span>
            <IconButton
              disabled
              sx={{
                color: '#b3b3b3',
                opacity: 0.45,
                cursor: 'not-allowed'
              }}
            >
              <OpenInFullIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Player;