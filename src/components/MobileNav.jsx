import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LibraryMusicRoundedIcon from '@mui/icons-material/LibraryMusicRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useLocation, useNavigate } from 'react-router-dom';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentValue = () => {
    const pathname = location.pathname;

    if (pathname === '/dashboard' || pathname === '/dashboard/') return 'home';
    if (pathname.startsWith('/dashboard/search')) return 'search';
    if (pathname.startsWith('/dashboard/library')) return 'library';
    if (pathname.startsWith('/dashboard/create-playlist')) return 'create';

    if (
      pathname.startsWith('/dashboard/playlist/') ||
      pathname.startsWith('/dashboard/liked-songs') ||
      pathname.startsWith('/dashboard/episodes') ||
      pathname.startsWith('/dashboard/artist/') ||
      pathname.startsWith('/dashboard/album/') ||
      pathname.startsWith('/dashboard/show/')
    ) {
      return 'library';
    }

    return 'home';
  };

  const value = getCurrentValue();

  const handleChange = (_, newValue) => {
    if (newValue === 'home') navigate('/dashboard');
    if (newValue === 'search') navigate('/dashboard/search');
    if (newValue === 'library') navigate('/dashboard/library');
    if (newValue === 'create') navigate('/dashboard/create-playlist');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1400,
        backgroundColor: 'rgba(10,10,10,0.96)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        pb: 'env(safe-area-inset-bottom)'
      }}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          height: 72,
          backgroundColor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            color: '#b3b3b3',
            fontSize: '12px',
            fontWeight: 500,
            transition: '0.18s ease'
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '12px',
            mt: 0.4
          },
          '& .Mui-selected': {
            color: 'white'
          }
        }}
      >
        <BottomNavigationAction
          label="Hem"
          value="home"
          icon={<HomeRoundedIcon sx={{ fontSize: 28 }} />}
        />

        <BottomNavigationAction
          label="Sök"
          value="search"
          icon={<SearchRoundedIcon sx={{ fontSize: 28 }} />}
        />

        <BottomNavigationAction
          label="Ditt bibliotek"
          value="library"
          icon={<LibraryMusicRoundedIcon sx={{ fontSize: 28 }} />}
        />

        <BottomNavigationAction
          label="Skapa"
          value="create"
          icon={<AddRoundedIcon sx={{ fontSize: 28 }} />}
        />
      </BottomNavigation>
    </Box>
  );
};

export default MobileNav;