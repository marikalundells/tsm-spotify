import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

const HOME_TABS = ['Playlists', 'Podcasts', 'Artists', 'Albums'];

const tabToQueryValue = {
  Playlists: 'playlists',
  Podcasts: 'podcasts',
  Artists: 'artists',
  Albums: 'albums'
};

const queryValueToTab = {
  playlists: 'Playlists',
  podcasts: 'Podcasts',
  artists: 'Artists',
  albums: 'Albums'
};

const SectionTitle = ({ title, subtitle }) => {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          fontSize: '24px',
          fontWeight: 800,
          color: 'white',
          mb: 0.4
        }}
      >
        {title}
      </Typography>

      {subtitle ? (
        <Typography
          sx={{
            fontSize: '13px',
            color: '#b3b3b3'
          }}
        >
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { playerError } = useOutletContext() || {};
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromUrl = queryValueToTab[searchParams.get('tab')] || 'Playlists';

  const [playlists, setPlaylists] = useState([]);
  const [shows, setShows] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const activeTab = tabFromUrl;

  const handleTabChange = (tab) => {
    setSearchParams({ tab: tabToQueryValue[tab] || 'playlists' });
  };

  useEffect(() => {
    if (!searchParams.get('tab')) {
      setSearchParams({ tab: 'playlists' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;

    const fetchData = async () => {
      try {
        const [
          playlistResponse,
          meResponse,
          showsResponse,
          artistsResponse,
          albumsResponse
        ] = await Promise.all([
          fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch('https://api.spotify.com/v1/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch('https://api.spotify.com/v1/me/shows?limit=20', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch('https://api.spotify.com/v1/me/top/artists?limit=20', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch('https://api.spotify.com/v1/me/albums?limit=20', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        const playlistData = await playlistResponse.json().catch(() => ({}));
        const meData = await meResponse.json().catch(() => ({}));
        const showsData = await showsResponse.json().catch(() => ({}));
        const artistsData = await artistsResponse.json().catch(() => ({}));
        const albumsData = await albumsResponse.json().catch(() => ({}));

        if (playlistResponse.ok) setPlaylists(playlistData.items || []);
        if (meResponse.ok) setProfile(meData);
        if (showsResponse.ok) setShows(showsData.items || []);
        else setShows([]);
        if (artistsResponse.ok) setArtists(artistsData.items || []);
        else setArtists([]);
        if (albumsResponse.ok) setAlbums(albumsData.items || []);
        else setAlbums([]);
      } catch (error) {
        console.error('Fel vid hämtning av Home-data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const playlistSections = useMemo(() => {
    return {
      featured: playlists.slice(0, 6),
      rest: playlists.slice(6)
    };
  }, [playlists]);

  const renderPlaylistCard = (playlist, large = false) => (
    <Box
      key={playlist.id}
      onClick={() => navigate(`/dashboard/playlist/${playlist.id}`)}
      sx={{
        backgroundColor: '#181818',
        borderRadius: '10px',
        p: large ? 1.6 : 2,
        cursor: 'pointer',
        transition: '0.2s',
        '&:hover': {
          backgroundColor: '#242424',
          transform: 'translateY(-1px)'
        }
      }}
    >
      <Box
        component="img"
        src={playlist.images?.[0]?.url || '/Spotify_Logo.png'}
        alt={playlist.name}
        sx={{
          width: '100%',
          aspectRatio: '1 / 1',
          objectFit: 'cover',
          borderRadius: '8px',
          mb: 1.5,
          boxShadow: '0 8px 18px rgba(0,0,0,0.22)'
        }}
      />

      <Typography
        sx={{
          fontSize: large ? '15px' : '14px',
          fontWeight: 800,
          color: 'white',
          mb: 0.6
        }}
        noWrap
      >
        {playlist.name}
      </Typography>

      <Typography
        sx={{
          fontSize: '13px',
          color: '#b3b3b3',
          lineHeight: 1.4,
          minHeight: '36px'
        }}
      >
        {playlist.owner?.display_name || 'Spotify'}
      </Typography>
    </Box>
  );

  const renderShowCard = (item) => {
    const show = item.show || item;
    if (!show) return null;

    return (
      <Box
        key={show.id}
        onClick={() => navigate(`/dashboard/show/${show.id}`)}
        sx={{
          backgroundColor: '#181818',
          borderRadius: '10px',
          p: 2,
          cursor: 'pointer',
          transition: '0.2s',
          '&:hover': {
            backgroundColor: '#242424',
            transform: 'translateY(-1px)'
          }
        }}
      >
        <Box
          component="img"
          src={show.images?.[0]?.url || '/Spotify_Logo.png'}
          alt={show.name}
          sx={{
            width: '100%',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            borderRadius: '8px',
            mb: 1.5,
            boxShadow: '0 8px 18px rgba(0,0,0,0.22)'
          }}
        />

        <Typography sx={{ fontWeight: 800, color: 'white', mb: 0.6 }} noWrap>
          {show.name}
        </Typography>

        <Typography
          sx={{
            fontSize: '13px',
            color: '#b3b3b3',
            lineHeight: 1.4,
            minHeight: '36px'
          }}
        >
          {show.publisher || 'Podcast'}
        </Typography>
      </Box>
    );
  };

  const renderArtistCard = (artist) => (
    <Box
      key={artist.id}
      onClick={() => navigate(`/dashboard/artist/${artist.id}`)}
      sx={{
        backgroundColor: '#181818',
        borderRadius: '10px',
        p: 2,
        cursor: 'pointer',
        transition: '0.2s',
        '&:hover': {
          backgroundColor: '#242424',
          transform: 'translateY(-1px)'
        }
      }}
    >
      <Box
        component="img"
        src={artist.images?.[0]?.url || '/Spotify_Logo.png'}
        alt={artist.name}
        sx={{
          width: '100%',
          aspectRatio: '1 / 1',
          objectFit: 'cover',
          borderRadius: '50%',
          mb: 1.5,
          boxShadow: '0 8px 18px rgba(0,0,0,0.22)'
        }}
      />

      <Typography sx={{ fontWeight: 800, color: 'white', mb: 0.4 }} noWrap>
        {artist.name}
      </Typography>

      <Typography sx={{ fontSize: '13px', color: '#b3b3b3' }}>
        Artist
      </Typography>
    </Box>
  );

  const renderAlbumCard = (item) => {
    const album = item.album || item;
    if (!album) return null;

    return (
      <Box
        key={album.id}
        onClick={() => navigate(`/dashboard/album/${album.id}`)}
        sx={{
          backgroundColor: '#181818',
          borderRadius: '10px',
          p: 2,
          cursor: 'pointer',
          transition: '0.2s',
          '&:hover': {
            backgroundColor: '#242424',
            transform: 'translateY(-1px)'
          }
        }}
      >
        <Box
          component="img"
          src={album.images?.[0]?.url || '/Spotify_Logo.png'}
          alt={album.name}
          sx={{
            width: '100%',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            borderRadius: '8px',
            mb: 1.5,
            boxShadow: '0 8px 18px rgba(0,0,0,0.22)'
          }}
        />

        <Typography sx={{ fontWeight: 800, color: 'white', mb: 0.6 }} noWrap>
          {album.name}
        </Typography>

        <Typography
          sx={{
            fontSize: '13px',
            color: '#b3b3b3',
            lineHeight: 1.4,
            minHeight: '36px'
          }}
        >
          {album.artists?.map((artist) => artist.name).join(', ') || 'Album'}
        </Typography>
      </Box>
    );
  };

  const renderGrid = (items, renderer, min = 180) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${min}px, 1fr))`,
        gap: 2
      }}
    >
      {items.map((item) => renderer(item))}
    </Box>
  );

  const renderPlaylistsView = () => (
    <>
      <Typography sx={{ fontSize: '42px', fontWeight: 800, mb: 3 }}>
        Playlists
      </Typography>

      <Box sx={{ mb: 5 }}>
        <SectionTitle
          title="Made for you"
          subtitle="Ett urval från ditt bibliotek"
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: 2
          }}
        >
          {playlistSections.featured.map((playlist) => renderPlaylistCard(playlist, true))}
        </Box>
      </Box>

      <Box>
        <SectionTitle
          title="Your playlists"
          subtitle="Resten av dina sparade spellistor"
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 2
          }}
        >
          {playlistSections.rest.map((playlist) => renderPlaylistCard(playlist))}
        </Box>
      </Box>
    </>
  );

  const renderPodcastsView = () => {
    if (!shows.length) {
      return (
        <EmptyState
          icon="🎙️"
          title="Inga podcasts hittades"
          description="Spara eller följ podcasts i Spotify så kan de visas här."
        />
      );
    }

    return (
      <>
        <Typography sx={{ fontSize: '42px', fontWeight: 800, mb: 3 }}>
          Podcasts
        </Typography>

        <Box sx={{ mb: 5 }}>
          <SectionTitle
            title="Shows you follow"
            subtitle="Dina sparade podcasts och shows"
          />
          {renderGrid(shows, renderShowCard)}
        </Box>
      </>
    );
  };

  const renderArtistsView = () => {
    if (!artists.length) {
      return (
        <EmptyState
          icon="🎤"
          title="Inga artister hittades"
          description="Dina top artists visas här när Spotify skickar tillbaka data för kontot."
        />
      );
    }

    return (
      <>
        <Typography sx={{ fontSize: '42px', fontWeight: 800, mb: 3 }}>
          Artists
        </Typography>

        <Box sx={{ mb: 5 }}>
          <SectionTitle
            title="Your top artists"
            subtitle="Artister du lyssnar mest på"
          />
          {renderGrid(artists, renderArtistCard)}
        </Box>
      </>
    );
  };

  const renderAlbumsView = () => {
    if (!albums.length) {
      return (
        <EmptyState
          icon="💿"
          title="Inga album hittades"
          description="Sparade album eller tillgängliga albumdata visas här."
        />
      );
    }

    return (
      <>
        <Typography sx={{ fontSize: '42px', fontWeight: 800, mb: 3 }}>
          Albums
        </Typography>

        <Box sx={{ mb: 5 }}>
          <SectionTitle
            title="Saved albums"
            subtitle="Album du har sparat i Spotify"
          />
          {renderGrid(albums, renderAlbumCard)}
        </Box>
      </>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState type="cards" cards={10} />;
    }

    if (activeTab === 'Playlists') return renderPlaylistsView();
    if (activeTab === 'Podcasts') return renderPodcastsView();
    if (activeTab === 'Artists') return renderArtistsView();
    if (activeTab === 'Albums') return renderAlbumsView();

    return null;
  };

  return (
    <Box sx={{ color: 'white', minHeight: '100%' }}>
      <TopBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userName={profile?.display_name || 'user'}
        tabs={HOME_TABS}
      />

      <Box sx={{ px: 4, pb: 4 }}>
        {playerError && (
          <Typography sx={{ color: '#ff6b6b', mb: 2 }}>
            {playerError}
          </Typography>
        )}

        {renderContent()}
      </Box>
    </Box>
  );
};

export default Home;