import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import MobileMiniPlayer from './MobileMiniPlayer';
import MobileBottomNav from './MobileBottomNav';

function MobileShell() {
  const location = useLocation();

  const PHONE_WIDTH = 412;
  const PHONE_HEIGHT = 844;

  const SIDE_PADDING = 10;
  const BOTTOM_PADDING = 8;
  const TOP_SAFE = 10;

  const NAV_HEIGHT = 84;
  const MINI_PLAYER_HEIGHT = 62;
  const MINI_PLAYER_GAP = 6;

  const isNowPlayingPage = location.pathname === '/mobile/now-playing';
  const showMiniPlayer = !isNowPlayingPage;

  const dockHeight = showMiniPlayer
    ? NAV_HEIGHT + MINI_PLAYER_HEIGHT + MINI_PLAYER_GAP + 22
    : NAV_HEIGHT + 18;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 4,
        background:
          'radial-gradient(circle at center, #3a3c42 0%, #27292f 22%, #17191d 48%, #0b0c0f 76%, #050506 100%)'
      }}
    >
      <Box
        sx={{
          width: `${PHONE_WIDTH}px`,
          height: `${PHONE_HEIGHT}px`,
          borderRadius: '42px',
          backgroundColor: '#000',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.04),
            0 0 0 3px rgba(255,255,255,0.015),
            0 24px 70px rgba(0,0,0,0.62),
            0 0 90px rgba(255,255,255,0.045)
          `
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            overflowX: 'hidden',
            overflowY: 'auto',
            pt: isNowPlayingPage ? 0 : `${TOP_SAFE}px`,
            pb: `${dockHeight}px`,
            backgroundColor: '#000',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none'
          }}
        >
          <Outlet />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: `${dockHeight + 10}px`,
            zIndex: 12,
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.28) 24%, rgba(0,0,0,0.62) 56%, rgba(0,0,0,0.9) 82%, rgba(0,0,0,1) 100%)'
          }}
        />

        {showMiniPlayer && (
          <Box
            sx={{
              position: 'absolute',
              left: SIDE_PADDING,
              right: SIDE_PADDING,
              bottom: `${NAV_HEIGHT + MINI_PLAYER_GAP + 2}px`,
              height: `${MINI_PLAYER_HEIGHT}px`,
              zIndex: 20
            }}
          >
            <MobileMiniPlayer />
          </Box>
        )}

        <Box
          sx={{
            position: 'absolute',
            left: SIDE_PADDING,
            right: SIDE_PADDING,
            bottom: `${BOTTOM_PADDING}px`,
            height: `${NAV_HEIGHT}px`,
            zIndex: 30
          }}
        >
          <MobileBottomNav />
        </Box>
      </Box>
    </Box>
  );
}

export default MobileShell;