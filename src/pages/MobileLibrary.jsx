import { Box, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import getAccessTokenFromStorage from '../utils/getAccessTokenFromStorage';

const tabs = [
  { label: 'Spellistor', value: 'playlists' },
  { label: 'Poddar', value: 'podcasts' },
  { label: 'Album', value: 'albums' },
  { label: 'Artister', value: 'artists' }
];

const MobileLibrary = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [playlists, setPlaylists] = useState([]);
  const [shows, setShows] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const activeTab = searchParams.get('tab') || 'playlists';

  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'playlists' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchLibrary = async () => {
      const token = getAccessTokenFromStorage();

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        setLoading(true);

        const [meResponse, playlistsResponse, showsResponse, albumsResponse, artistsResponse] =
          await Promise.all([
            fetch('https://api.spotify.com/v1/me', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            fetch('https://api.spotify.com/v1/me/playlists?limit=30', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            fetch('https://api.spotify.com/v1/me/shows?limit=20', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            fetch('https://api.spotify.com/v1/me/albums?limit=20', {
              headers: { Authorization: `Bearer ${token}` }
            }),
            fetch('https://api.spotify.com/v1/me/top/artists?limit=20', {
              headers: { Authorization: `Bearer ${token}` }
            })
          ]);

        const responses = [
          meResponse,
          playlistsResponse,
          showsResponse,
          albumsResponse,
          artistsResponse
        ];

        if (responses.some((response) => response.status === 401)) {
          sessionStorage.removeItem('accessToken');
          navigate('/login', { replace: true });
          return;
        }

        const meData = meResponse.ok ? await meResponse.json() : null;
        const playlistsData = playlistsResponse.ok ? await playlistsResponse.json() : { items: [] };
        const showsData = showsResponse.ok ? await showsResponse.json() : { items: [] };
        const albumsData = albumsResponse.ok ? await albumsResponse.json() : { items: [] };
        const artistsData = artistsResponse.ok ? await artistsResponse.json() : { items: [] };

        setProfile(meData);
        setPlaylists(playlistsData.items || []);
        setShows(showsData.items || []);
        setAlbums(albumsData.items || []);
        setArtists(artistsData.items || []);
      } catch (error) {
        console.error('MobileLibrary fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [navigate]);

  const visibleItems = useMemo(() => {
    if (activeTab === 'playlists') return playlists;
    if (activeTab === 'podcasts') return shows;
    if (activeTab === 'albums') return albums;
    if (activeTab === 'artists') return artists;
    return [];
  }, [activeTab, playlists, shows, albums, artists]);

  const likedSongsCard = useMemo(() => {
    if (activeTab !== 'playlists') return null;
    return {
      id: 'liked-songs',
      name: 'Gillade låtar',
      subtitle: 'Spellista • 227 låtar',
      type: 'liked'
    };
  }, [activeTab]);

  const libraryItems = useMemo(() => {
    if (activeTab === 'playlists' && likedSongsCard) {
      return [likedSongsCard, ...visibleItems];
    }
    return visibleItems;
  }, [activeTab, visibleItems, likedSongsCard]);

  const getItemKey = (item) => {
    if (item.type === 'liked') return item.id;
    return item.id || item.show?.id || item.album?.id || item.name;
  };

  const getItemImage = (item) => {
    if (item.type === 'liked') return null;
    if (activeTab === 'playlists') return item.images?.[0]?.url || '/Spotify_Logo.png';
    if (activeTab === 'podcasts') return item.show?.images?.[0]?.url || '/Spotify_Logo.png';
    if (activeTab === 'albums') return item.album?.images?.[0]?.url || '/Spotify_Logo.png';
    if (activeTab === 'artists') return item.images?.[0]?.url || '/Spotify_Logo.png';
    return '/Spotify_Logo.png';
  };

  const getItemTitle = (item) => {
    if (item.type === 'liked') return item.name;
    if (activeTab === 'playlists') return item.name || 'Spellista';
    if (activeTab === 'podcasts') return item.show?.name || 'Podcast';
    if (activeTab === 'albums') return item.album?.name || 'Album';
    if (activeTab === 'artists') return item.name || 'Artist';
    return 'Item';
  };

  const getItemSubtitle = (item) => {
    if (item.type === 'liked') return item.subtitle;
    if (activeTab === 'playlists') return `Spellista • ${item.owner?.display_name || 'Spotify'}`;
    if (activeTab === 'podcasts') return item.show?.publisher || 'Podcast';
    if (activeTab === 'albums') {
      return item.album?.artists?.map((artist) => artist.name).join(', ') || 'Album';
    }
    if (activeTab === 'artists') return 'Artist';
    return '';
  };

  const getPlaylistAccent = (item) => {
    if (item.type === 'liked') return null;
    if (activeTab !== 'playlists') return null;

    const ownerName = item.owner?.display_name || '';

    if (ownerName === 'Spotify') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <DownloadForOfflineRoundedIcon sx={{ fontSize: 17, color: '#35d166' }} />
          <Typography sx={{ fontSize: '13px', color: '#b3b3b3' }}>
            {getItemSubtitle(item).replace('Spellista • ', '')}
          </Typography>
        </Box>
      );
    }

    return null;
  };

  const handleItemClick = (item) => {
    if (item.type === 'liked') return;
    if (activeTab === 'playlists') {
      navigate(`/mobile/playlist/${item.id}`);
    }
  };

  return (
    <Box sx={{ px: 3, pt: 3, pb: 4, color: 'white' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2.2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.3, minWidth: 0 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: '#ef8fc0',
              color: '#111',
              fontSize: '29px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {profile?.display_name?.charAt(0)?.toUpperCase() || 'M'}
          </Box>

          <Typography sx={{ fontSize: '34px', fontWeight: 900, lineHeight: 1, whiteSpace: 'nowrap' }}>
            Ditt bibliotek
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4, flexShrink: 0 }}>
          <SearchRoundedIcon sx={{ fontSize: 38 }} />
          <AddRoundedIcon sx={{ fontSize: 40 }} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 1.1,
          overflowX: 'auto',
          overflowY: 'hidden',
          whiteSpace: 'nowrap',
          pb: 0.5,
          mb: 2.1,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none'
        }}
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.value;

          return (
            <Box
              key={tab.value}
              onClick={() => setSearchParams({ tab: tab.value })}
              sx={{
                height: 46,
                px: 2,
                borderRadius: '999px',
                backgroundColor: '#2a2a2a',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <Typography sx={{ fontSize: '14px', fontWeight: active ? 800 : 700, color: '#f2f2f2' }}>
                {tab.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2.1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.9 }}>
          <SwapVertRoundedIcon sx={{ fontSize: 26 }} />
          <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>Senaste</Typography>
        </Box>

        <AppsRoundedIcon sx={{ fontSize: 36 }} />
      </Box>

      {loading ? (
        <Typography sx={{ color: '#b3b3b3', fontSize: '15px' }}>Laddar...</Typography>
      ) : libraryItems.length === 0 ? (
        <Typography sx={{ color: '#b3b3b3', fontSize: '15px' }}>Inget innehåll hittades.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {libraryItems.map((item) => {
            const isLiked = item.type === 'liked';
            const accent = getPlaylistAccent(item);

            return (
              <Box
                key={getItemKey(item)}
                onClick={() => handleItemClick(item)}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '72px minmax(0, 1fr)',
                  gap: 1.8,
                  alignItems: 'center',
                  cursor: activeTab === 'playlists' && !isLiked ? 'pointer' : 'default'
                }}
              >
                {isLiked ? (
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: '4px',
                      background: 'linear-gradient(135deg, #5a3ff1 0%, #c5e7de 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <FavoriteRoundedIcon sx={{ color: 'white', fontSize: 34 }} />
                  </Box>
                ) : (
                  <Box
                    component="img"
                    src={getItemImage(item)}
                    alt={getItemTitle(item)}
                    onError={(e) => {
                      e.currentTarget.src = '/Spotify_Logo.png';
                    }}
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: activeTab === 'artists' ? '50%' : '4px',
                      objectFit: 'cover',
                      backgroundColor: '#404040',
                      flexShrink: 0
                    }}
                  />
                )}

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontWeight: 500,
                      lineHeight: 1.18,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      mb: 0.25
                    }}
                  >
                    {getItemTitle(item)}
                  </Typography>

                  {isLiked ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                      <PushPinRoundedIcon sx={{ fontSize: 17, color: '#35d166' }} />
                      <Typography
                        sx={{
                          fontSize: '13px',
                          color: '#b3b3b3',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {getItemSubtitle(item)}
                      </Typography>
                    </Box>
                  ) : accent ? (
                    accent
                  ) : (
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: '#b3b3b3',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {getItemSubtitle(item)}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default MobileLibrary;