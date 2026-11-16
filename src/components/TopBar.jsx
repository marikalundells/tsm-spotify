import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultTabs = ['Playlists', 'Podcasts', 'Artists', 'Albums'];

const TopBar = ({
  activeTab,
  onTabChange,
  userName = 'user',
  tabs = defaultTabs,
  background = `
    linear-gradient(
      to bottom,
      rgba(40,40,40,0.88) 0%,
      rgba(32,32,32,0.62) 58%,
      rgba(24,24,24,0.18) 88%,
      rgba(24,24,24,0) 100%
    )
  `,
  overlay = false
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleCloseMenu();
    window.open('https://open.spotify.com/', '_blank', 'noopener,noreferrer');
  };

  const handleAccountClick = () => {
    handleCloseMenu();
    window.open('https://www.spotify.com/account/', '_blank', 'noopener,noreferrer');
  };

  const handleLogout = () => {
    handleCloseMenu();
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('tokenType');
    sessionStorage.removeItem('expiresIn');
    sessionStorage.removeItem('scope');
    sessionStorage.removeItem('refreshToken');
    localStorage.removeItem('code_verifier');
    navigate('/login');
  };

  return (
    <Box
      sx={{
        position: overlay ? 'absolute' : 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        px: 4,
        py: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background,
        backdropFilter: overlay ? 'blur(6px)' : 'blur(10px)',
        WebkitBackdropFilter: overlay ? 'blur(6px)' : 'blur(10px)',
        borderBottom: 'none',
        boxShadow: 'none'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            width: 44,
            height: 44,
            backgroundColor: 'rgba(0,0,0,0.52)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.72)'
            }
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: 32 }} />
        </IconButton>

        <IconButton
          onClick={handleForward}
          sx={{
            width: 44,
            height: 44,
            backgroundColor: 'rgba(0,0,0,0.52)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.72)'
            }
          }}
        >
          <ChevronRightIcon sx={{ fontSize: 32 }} />
        </IconButton>

        {tabs.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, ml: 1 }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <Box
                  key={tab}
                  onClick={() => onTabChange?.(tab)}
                  sx={{
                    px: 3.2,
                    py: 1.4,
                    borderRadius: '12px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '18px',
                    cursor: 'pointer',
                    transition: '0.2s',
                    '&:hover': {
                      backgroundColor: isActive
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(255,255,255,0.04)'
                    }
                  }}
                >
                  {tab}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      <>
        <Box
          onClick={handleOpenMenu}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.3,
            backgroundColor: 'rgba(0,0,0,0.78)',
            borderRadius: '999px',
            px: 1.1,
            py: 0.7,
            cursor: 'pointer',
            transition: '0.2s',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.9)'
            }
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: '#efefef',
              color: '#111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '22px',
              textTransform: 'lowercase'
            }}
          >
            {userName?.[0] || 'u'}
          </Box>

          <Typography
            sx={{
              color: 'white',
              fontWeight: 800,
              fontSize: '18px'
            }}
          >
            {userName}
          </Typography>

          <KeyboardArrowDownIcon sx={{ color: 'white', mr: 0.6 }} />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleCloseMenu}
          PaperProps={{
            sx: {
              mt: 1.2,
              minWidth: 220,
              backgroundColor: '#282828',
              color: 'white',
              borderRadius: '10px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
              '& .MuiMenuItem-root': {
                fontSize: '14px',
                fontWeight: 600,
                py: 1.2
              },
              '& .MuiMenuItem-root:hover': {
                backgroundColor: '#3a3a3a'
              }
            }
          }}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleAccountClick}>Account</MenuItem>
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
      </>
    </Box>
  );
};

export default TopBar;