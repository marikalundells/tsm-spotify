import { Box, Typography } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LibraryMusicRoundedIcon from '@mui/icons-material/LibraryMusicRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useLocation, useNavigate } from 'react-router-dom';

function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      label: 'Hem',
      icon: <HomeRoundedIcon sx={{ fontSize: 29 }} />,
      path: '/mobile/home'
    },
    {
      label: 'Sök',
      icon: <SearchRoundedIcon sx={{ fontSize: 29 }} />,
      path: '/mobile/search'
    },
    {
      label: 'Bibliotek',
      icon: <LibraryMusicRoundedIcon sx={{ fontSize: 29 }} />,
      path: '/mobile/library?tab=playlists'
    },
    {
      label: 'Skapa',
      icon: <AddRoundedIcon sx={{ fontSize: 29 }} />,
      path: '/mobile/create'
    }
  ];

  const isActive = (path) => {
    if (path.startsWith('/mobile/library')) {
      return (
        location.pathname.startsWith('/mobile/library') ||
        location.pathname.startsWith('/mobile/playlist')
      );
    }

    if (path === '/mobile/home') return location.pathname === '/mobile/home';
    if (path === '/mobile/search') return location.pathname.startsWith('/mobile/search');
    if (path === '/mobile/create') return location.pathname.startsWith('/mobile/create');

    return false;
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: '30px',
        background:
          'linear-gradient(180deg, rgba(16,16,18,0.82) 0%, rgba(7,7,9,0.96) 100%)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.035)',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.24)',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        alignItems: 'center',
        px: 1.2
      }}
    >
      {items.map((item) => {
        const active = isActive(item.path);

        return (
          <Box
            key={item.label}
            onClick={() => navigate(item.path)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              cursor: 'pointer',
              color: active ? '#ffffff' : 'rgba(255,255,255,0.82)'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1
              }}
            >
              {item.icon}
            </Box>

            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: active ? 800 : 600,
                lineHeight: 1
              }}
            >
              {item.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export default MobileBottomNav;