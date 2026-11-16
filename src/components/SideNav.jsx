import { Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';

import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import BedtimeRoundedIcon from '@mui/icons-material/BedtimeRounded';
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded';
import AudiotrackRoundedIcon from '@mui/icons-material/AudiotrackRounded';
import LibraryMusicRoundedIcon from '@mui/icons-material/LibraryMusicRounded';

const SideNav = () => {
  const [playlists, setPlaylists] = useState([]);
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  const [collapsedSections, setCollapsedSections] = useState({
    'MY PLAYLISTS': false,
    GYM: false,
    CHILL: false,
    HOUSE: false,
    OTHER: false
  });

  const fetchPlaylists = useCallback(async () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;

    try {
      const [playlistResponse, meResponse] = await Promise.all([
        fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const playlistData = await playlistResponse.json().catch(() => ({}));
      const meData = await meResponse.json().catch(() => ({}));

      if (playlistResponse.ok) {
        setPlaylists(playlistData.items || []);
      }

      if (meResponse.ok) {
        setProfile(meData);
      }
    } catch (error) {
      console.error('Fel vid hämtning av playlists i SideNav:', error);
    }
  }, []);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  useEffect(() => {
    const handlePlaylistCreated = () => {
      fetchPlaylists();
    };

    window.addEventListener('playlist-created', handlePlaylistCreated);

    return () => {
      window.removeEventListener('playlist-created', handlePlaylistCreated);
    };
  }, [fetchPlaylists]);

  const toggleSection = (sectionTitle) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  const mainLinkStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1.8,
    color: active ? 'white' : '#b3b3b3',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 700,
    marginBottom: '18px',
    transition: '0.2s',
    '&:hover': {
      color: 'white'
    }
  });

  const specialLinkStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    color: active ? 'white' : '#b3b3b3',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 700,
    marginBottom: '16px',
    transition: '0.2s',
    '&:hover': {
      color: 'white'
    }
  });

  const groupedPlaylists = useMemo(() => {
    const groups = {
      Mine: [],
      Gym: [],
      Chill: [],
      House: [],
      Other: []
    };

    const currentUserId = profile?.id;

    playlists.forEach((playlist) => {
      const name = (playlist.name || '').toLowerCase();
      const isMine = playlist.owner?.id === currentUserId;

      if (isMine) {
        groups.Mine.push(playlist);
        return;
      }

      if (
        name.includes('gym') ||
        name.includes('workout') ||
        name.includes('bass') ||
        name.includes('motivation')
      ) {
        groups.Gym.push(playlist);
        return;
      }

      if (
        name.includes('chill') ||
        name.includes('calm') ||
        name.includes('study') ||
        name.includes('coffee') ||
        name.includes('piano') ||
        name.includes('meditation') ||
        name.includes('lofi')
      ) {
        groups.Chill.push(playlist);
        return;
      }

      if (
        name.includes('house') ||
        name.includes('phonk') ||
        name.includes('dj') ||
        name.includes('mix') ||
        name.includes('techno') ||
        name.includes('club') ||
        name.includes('deep')
      ) {
        groups.House.push(playlist);
        return;
      }

      groups.Other.push(playlist);
    });

    return groups;
  }, [playlists, profile]);

  const sections = [
    {
      title: 'MY PLAYLISTS',
      icon: FolderRoundedIcon,
      items: groupedPlaylists.Mine
    },
    {
      title: 'GYM',
      icon: FitnessCenterRoundedIcon,
      items: groupedPlaylists.Gym
    },
    {
      title: 'CHILL',
      icon: BedtimeRoundedIcon,
      items: groupedPlaylists.Chill
    },
    {
      title: 'HOUSE',
      icon: GraphicEqRoundedIcon,
      items: groupedPlaylists.House
    },
    {
      title: 'OTHER',
      icon: AudiotrackRoundedIcon,
      items: groupedPlaylists.Other
    }
  ].filter((section) => section.items.length > 0);

  return (
    <Box
      sx={{
        width: '280px',
        height: '100vh',
        backgroundColor: '#000',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ px: 2.8, pt: 2.6, pb: 2, flexShrink: 0 }}>
        <Box
          component="img"
          src="/Spotify_Logo.png"
          alt="Spotify"
          sx={{
            height: 34,
            width: 'auto',
            display: 'block',
            mb: 4.5
          }}
        />

        <Box
          component={Link}
          to="/dashboard"
          sx={mainLinkStyle(location.pathname === '/dashboard')}
        >
          <HomeIcon sx={{ fontSize: 24 }} />
          <span>Home</span>
        </Box>

        <Box
          component={Link}
          to="/dashboard/search"
          sx={mainLinkStyle(location.pathname === '/dashboard/search')}
        >
          <SearchIcon sx={{ fontSize: 24 }} />
          <span>Search</span>
        </Box>

        <Box
          component={Link}
          to="/dashboard/library"
          sx={mainLinkStyle(location.pathname === '/dashboard/library')}
        >
          <LibraryMusicIcon sx={{ fontSize: 24 }} />
          <span>Your Library</span>
        </Box>
      </Box>

      <Box sx={{ px: 2.8, pb: 1, flexShrink: 0 }}>
        <Box
          component={Link}
          to="/dashboard/create-playlist"
          sx={specialLinkStyle(location.pathname === '/dashboard/create-playlist')}
        >
          <AddBoxIcon sx={{ fontSize: 22 }} />
          <span>Create Playlist</span>
        </Box>

        <Box
          component={Link}
          to="/dashboard/liked-songs"
          sx={specialLinkStyle(location.pathname === '/dashboard/liked-songs')}
        >
          <FavoriteIcon sx={{ fontSize: 20 }} />
          <span>Liked Songs</span>
        </Box>

        <Box
          component={Link}
          to="/dashboard/episodes"
          sx={specialLinkStyle(location.pathname === '/dashboard/episodes')}
        >
          <DownloadDoneIcon sx={{ fontSize: 20 }} />
          <span>Your Episodes</span>
        </Box>
      </Box>

      <Box
        sx={{
          borderTop: '1px solid #282828',
          mx: 2.8,
          mb: 1.8,
          flexShrink: 0
        }}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: 2.8,
          pb: 2,
          pr: 1.6
        }}
      >
        {sections.map((section) => {
          const isCollapsed = collapsedSections[section.title];
          const SectionIcon = section.icon;

          return (
            <Box key={section.title} sx={{ mb: 3.5 }}>
              <Box
                onClick={() => toggleSection(section.title)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1.4,
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <SectionIcon
                    sx={{
                      fontSize: 17,
                      color: '#b3b3b3'
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: '11px',
                      letterSpacing: '0.22em',
                      fontWeight: 800,
                      color: '#b3b3b3'
                    }}
                  >
                    {section.title}
                  </Typography>
                </Box>

                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: 18,
                    color: '#6f6f6f',
                    transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                    transition: '0.2s'
                  }}
                />
              </Box>

              <Box
                sx={{
                  borderTop: '1px solid #1c1c1c',
                  pt: isCollapsed ? 0 : 1.2,
                  maxHeight: isCollapsed ? 0 : '2000px',
                  overflow: 'hidden',
                  opacity: isCollapsed ? 0 : 1,
                  transition: 'all 0.25s ease'
                }}
              >
                {!isCollapsed &&
                  section.items.map((playlist) => {
                    const isActive =
                      location.pathname === `/dashboard/playlist/${playlist.id}`;

                    const image = playlist.images?.[0]?.url || null;
                    const trackCount = playlist.tracks?.total ?? 0;

                    return (
                      <Box
                        key={playlist.id}
                        component={Link}
                        to={`/dashboard/playlist/${playlist.id}`}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.4,
                          textDecoration: 'none',
                          py: '7px',
                          px: '6px',
                          borderRadius: '8px',
                          transition: '0.2s',
                          backgroundColor: isActive ? '#1a1a1a' : 'transparent',
                          '&:hover': {
                            backgroundColor: '#1a1a1a'
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: '8px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: image
                              ? '#2a2a2a'
                              : 'linear-gradient(135deg, #2f2f2f 0%, #1b1b1b 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: image ? 'none' : '1px solid rgba(255,255,255,0.06)'
                          }}
                        >
                          {image ? (
                            <Box
                              component="img"
                              src={image}
                              alt={playlist.name}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <LibraryMusicRoundedIcon
                              sx={{
                                fontSize: 20,
                                color: '#d0d0d0'
                              }}
                            />
                          )}
                        </Box>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: '13px',
                              fontWeight: isActive ? 700 : 500,
                              color: isActive ? 'white' : '#e7e7e7',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              mb: 0.2
                            }}
                          >
                            {playlist.name || 'Untitled playlist'}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: '11px',
                              color: '#8f8f8f'
                            }}
                          >
                            {trackCount} låtar
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          px: 2.8,
          py: 1.8,
          borderTop: '1px solid #282828',
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          color: '#b3b3b3',
          fontSize: '13px',
          fontWeight: 700,
          flexShrink: 0
        }}
      >
        <InstallDesktopIcon sx={{ fontSize: 20 }} />
        <span>Install App</span>
      </Box>
    </Box>
  );
};

export default SideNav;