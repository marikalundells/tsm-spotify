import { Box, IconButton, TextField, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState } from 'react';
import {
  useNavigate,
  useOutletContext,
  useSearchParams
} from 'react-router-dom';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';

const SEARCH_TABS = ['Playlists', 'Tracks', 'Artists', 'Albums', 'Podcasts'];

const tabToQueryValue = {
  Playlists: 'playlists',
  Tracks: 'tracks',
  Artists: 'artists',
  Albums: 'albums',
  Podcasts: 'podcasts'
};

const queryValueToTab = {
  playlists: 'Playlists',
  tracks: 'Tracks',
  artists: 'Artists',
  albums: 'Albums',
  podcasts: 'Podcasts'
};

const Search = () => {
  const navigate = useNavigate();
  const { playTrack } = useOutletContext() || {};
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = queryValueToTab[searchParams.get('tab')] || 'Playlists';

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [profile, setProfile] = useState(null);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tabToQueryValue[tab] || 'playlists');
    setSearchParams(nextParams);
  };

  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (currentQ !== query) {
      setQuery(currentQ);
    }
  }, [searchParams]); // eslint-disable-line

  useEffect(() => {
    if (!searchParams.get('tab')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('tab', 'playlists');
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;

    const fetchInitialData = async () => {
      try {
        const [meResponse, playlistsResponse] = await Promise.all([
          fetch('https://api.spotify.com/v1/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        const meData = await meResponse.json().catch(() => ({}));
        const playlistsData = await playlistsResponse.json().catch(() => ({}));

        if (meResponse.ok) {
          setProfile(meData);
        }

        if (playlistsResponse.ok) {
          setMyPlaylists(playlistsData.items || []);
        }
      } catch (error) {
        console.error('Fel vid hämtning av Search-data:', error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        if (activeTab === 'Playlists') {
          const localMatches = myPlaylists
            .filter((playlist) =>
              (playlist.name || '').toLowerCase().includes(query.toLowerCase())
            )
            .map((item) => ({
              id: item.id,
              title: item.name,
              subtitle: item.owner?.display_name || 'Du',
              image: item.images?.[0]?.url,
              type: 'Playlist',
              isLocalPlaylist: true
            }));

          const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=12`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          const data = await response.json().catch(() => ({}));

          let apiMatches = [];
          if (response.ok) {
            apiMatches = (data.playlists?.items || []).map((item) => ({
              id: item.id,
              title: item.name,
              subtitle: item.owner?.display_name || 'Spotify',
              image: item.images?.[0]?.url,
              type: 'Playlist',
              isLocalPlaylist: false
            }));
          }

          const deduped = [...localMatches, ...apiMatches].filter(
            (item, index, array) =>
              array.findIndex((x) => x.id === item.id) === index
          );

          setResults(deduped);
          setLoading(false);
          return;
        }

        const typeMap = {
          Tracks: 'track',
          Artists: 'artist',
          Albums: 'album',
          Podcasts: 'show'
        };

        const spotifyType = typeMap[activeTab];

        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${spotifyType}&limit=12`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          setResults([]);
          setLoading(false);
          return;
        }

        let mappedResults = [];

        if (activeTab === 'Tracks') {
          mappedResults = (data.tracks?.items || []).map((item) => ({
            id: item.id,
            title: item.name,
            subtitle: item.artists?.map((artist) => artist.name).join(', ') || 'Artist',
            image: item.album?.images?.[0]?.url,
            type: 'Track',
            uri: item.uri,
            rawTrack: item
          }));
        }

        if (activeTab === 'Artists') {
          mappedResults = (data.artists?.items || []).map((item) => ({
            id: item.id,
            title: item.name,
            subtitle: 'Artist',
            image: item.images?.[0]?.url,
            type: 'Artist'
          }));
        }

        if (activeTab === 'Albums') {
          mappedResults = (data.albums?.items || []).map((item) => ({
            id: item.id,
            title: item.name,
            subtitle: item.artists?.map((artist) => artist.name).join(', '),
            image: item.images?.[0]?.url,
            type: 'Album'
          }));
        }

        if (activeTab === 'Podcasts') {
          mappedResults = (data.shows?.items || []).map((item) => ({
            id: item.id,
            title: item.name,
            subtitle: item.publisher || 'Podcast',
            image: item.images?.[0]?.url,
            type: 'Podcast'
          }));
        }

        setResults(mappedResults);
      } catch (error) {
        console.error('Fel vid sökning:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, activeTab, myPlaylists]);

  const handleInputChange = (value) => {
    setQuery(value);

    const nextParams = new URLSearchParams(searchParams);

    if (value.trim()) {
      nextParams.set('q', value);
    } else {
      nextParams.delete('q');
    }

    if (!nextParams.get('tab')) {
      nextParams.set('tab', 'playlists');
    }

    setSearchParams(nextParams);
  };

  const handleCardClick = (item) => {
    if (item.type === 'Playlist') navigate(`/dashboard/playlist/${item.id}`);
    if (item.type === 'Artist') navigate(`/dashboard/artist/${item.id}`);
    if (item.type === 'Album') navigate(`/dashboard/album/${item.id}`);
    if (item.type === 'Podcast') navigate(`/dashboard/show/${item.id}`);
  };

  const handleTrackPlay = (event, item) => {
    event.stopPropagation();
    if (!item.rawTrack) return;
    playTrack?.(item.rawTrack, null);
  };

  return (
    <Box sx={{ color: 'white', minHeight: '100%' }}>
      <TopBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userName={profile?.display_name || 'user'}
        tabs={SEARCH_TABS}
      />

      <Box sx={{ p: 4 }}>
        <Typography sx={{ fontSize: '42px', fontWeight: 800, mb: 3 }}>
          Search
        </Typography>

        <TextField
          fullWidth
          placeholder="Sök efter låtar, artister, album, podcasts eller dina playlists"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          autoComplete="off"
          sx={{
            mb: 4,
            maxWidth: '760px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              borderRadius: '999px',
              color: '#111',
              fontSize: '16px',
              px: 1.5
            },
            '& input': {
              color: '#111',
              py: 1.7
            },
            '& input::placeholder': {
              color: '#666',
              opacity: 1
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            }
          }}
        />

        {!query.trim() ? (
          <EmptyState
            icon="🔎"
            title="Börja söka"
            description="Sök efter låtar, spellistor, artister, album eller podcasts för att se resultat här."
            compact
          />
        ) : loading ? (
          <LoadingState type="search-grid" cards={8} />
        ) : results.length === 0 ? (
          <EmptyState
            icon="🫥"
            title="Inga resultat hittades"
            description="Testa ett annat sökord eller byt flik för att få fler träffar."
            compact
          />
        ) : activeTab === 'Tracks' ? (
          <Box
            sx={{
              display: 'grid',
              gap: 1.2
            }}
          >
            {results.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '56px 1fr auto',
                  alignItems: 'center',
                  gap: 2,
                  px: 1.5,
                  py: 1.2,
                  borderRadius: '10px',
                  backgroundColor: '#181818',
                  transition: '0.2s',
                  '&:hover': {
                    backgroundColor: '#242424'
                  }
                }}
              >
                <Box
                  component="img"
                  src={item.image || '/Spotify_Logo.png'}
                  alt={item.title}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '6px',
                    objectFit: 'cover'
                  }}
                />

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: 'white',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#b3b3b3',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                </Box>

                <IconButton
                  onClick={(event) => handleTrackPlay(event, item)}
                  sx={{
                    color: 'white',
                    backgroundColor: '#1db954',
                    width: 42,
                    height: 42,
                    '&:hover': {
                      backgroundColor: '#1ed760'
                    }
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 2
            }}
          >
            {results.map((item) => (
              <Box
                key={`${item.type}-${item.id}`}
                onClick={() => handleCardClick(item)}
                sx={{
                  backgroundColor: '#181818',
                  borderRadius: '8px',
                  p: 2,
                  cursor: 'pointer',
                  transition: '0.2s',
                  '&:hover': {
                    backgroundColor: '#242424'
                  }
                }}
              >
                <Box
                  component="img"
                  src={item.image || '/Spotify_Logo.png'}
                  alt={item.title}
                  sx={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    borderRadius: item.type === 'Artist' ? '50%' : '6px',
                    mb: 1.5
                  }}
                />

                <Typography sx={{ fontWeight: 700 }} noWrap>
                  {item.title}
                </Typography>

                <Typography sx={{ fontSize: '13px', color: '#b3b3b3' }} noWrap>
                  {item.subtitle}
                </Typography>

                <Typography sx={{ fontSize: '12px', color: '#1db954', mt: 1 }}>
                  {item.isLocalPlaylist ? 'Din playlist' : item.type}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Search;