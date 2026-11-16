import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';

import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded';
import BedtimeRoundedIcon from '@mui/icons-material/BedtimeRounded';
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded';
import AudiotrackRoundedIcon from '@mui/icons-material/AudiotrackRounded';

const LIBRARY_TABS = ['Playlists', 'Podcasts', 'Artists', 'Albums'];

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

const sectionMeta = {
  Mine: {
    title: 'My Playlists',
    icon: FolderRoundedIcon,
    iconColor: '#b3b3b3',
    hoverColor: '#ffffff'
  },
  Gym: {
    title: 'Gym',
    icon: FitnessCenterRoundedIcon,
    iconColor: '#c7c7c7',
    hoverColor: '#1db954'
  },
  Chill: {
    title: 'Chill',
    icon: BedtimeRoundedIcon,
    iconColor: '#c7c7c7',
    hoverColor: '#8ab4ff'
  },
  House: {
    title: 'House',
    icon: GraphicEqRoundedIcon,
    iconColor: '#c7c7c7',
    hoverColor: '#ff7a59'
  },
  Other: {
    title: 'Other',
    icon: AudiotrackRoundedIcon,
    iconColor: '#c7c7c7',
    hoverColor: '#d8b4fe'
  }
};

const Library = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = queryValueToTab[searchParams.get('tab')] || 'Playlists';

  const [playlists, setPlaylists] = useState([]);
  const [shows, setShows] = useState([]);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

        if (playlistResponse.ok) {
          setPlaylists(playlistData.items || []);
        }

        if (meResponse.ok) {
          setProfile(meData);
        }

        if (showsResponse.ok) {
          setShows(showsData.items || []);
        } else {
          setShows([]);
        }

        if (artistsResponse.ok) {
          setArtists(artistsData.items || []);
        } else {
          setArtists([]);
        }

        if (albumsResponse.ok) {
          setAlbums(albumsData.items || []);
        } else {
          setAlbums([]);
        }
      } catch (error) {
        console.error('Fel vid hämtning av Library-data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const visibleSections = useMemo(() => {
    if (activeTab !== 'Playlists') return [];

    return [
      { key: 'Mine', items: groupedPlaylists.Mine },
      { key: 'Gym', items: groupedPlaylists.Gym },
      { key: 'Chill', items: groupedPlaylists.Chill },
      { key: 'House', items: groupedPlaylists.House },
      { key: 'Other', items: groupedPlaylists.Other }
    ].filter((section) => section.items.length > 0);
  }, [activeTab, groupedPlaylists]);

  const renderPlaylistCard = (playlist) => {
    const image = playlist.images?.[0]?.url || '/Spotify_Logo.png';
    const owner = playlist.owner?.display_name || 'Spotify';
    const trackCount = playlist.tracks?.total ?? 0;

    return (
      <Box
        key={playlist.id}
        onClick={() => navigate(`/dashboard/playlist/${playlist.id}`)}
        sx={{
          backgroundColor: '#181818',
          borderRadius: '12px',
          p: 1.8,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            backgroundColor: '#202020',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.28)'
          }
        }}
      >
        <Box
          component="img"
          src={image}
          alt={playlist.name}
          sx={{
            width: '100%',
            aspectRatio: '1 / 1',
            objectFit: 'cover',
            borderRadius: '10px',
            mb: 1.4
          }}
        />

        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 800,
            color: 'white',
            mb: 0.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {playlist.name || 'Untitled playlist'}
        </Typography>

        <Typography
          sx={{
            fontSize: '12px',
            color: '#b3b3b3',
            mb: 0.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {owner}
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
    );
  };

  const renderShowCard = (item) => {
    const show = item.show || item;
    if (!show) return null;

    return (
      <Box
        key={show.id}
        onClick={() => navigate(`/dashboard/show/${show.id}`)}
        sx={{
          backgroundColor: '#181818',
          borderRadius: '12px',
          p: 1.8,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            backgroundColor: '#202020',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.28)'
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
            borderRadius: '10px',
            mb: 1.4
          }}
        />

        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 800,
            color: 'white',
            mb: 0.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {show.name}
        </Typography>

        <Typography
          sx={{
            fontSize: '12px',
            color: '#b3b3b3',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {show.publisher || 'Podcast'}
        </Typography>
      </Box>
    );
  };

  const renderArtistCard = (artist) => {
    return (
      <Box
        key={artist.id}
        onClick={() => navigate(`/dashboard/artist/${artist.id}`)}
        sx={{
          backgroundColor: '#181818',
          borderRadius: '12px',
          p: 1.8,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            backgroundColor: '#202020',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.28)'
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
            mb: 1.4
          }}
        />

        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 800,
            color: 'white',
            mb: 0.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {artist.name}
        </Typography>

        <Typography
          sx={{
            fontSize: '12px',
            color: '#b3b3b3'
          }}
        >
          Artist
        </Typography>
      </Box>
    );
  };

  const renderAlbumCard = (item) => {
    const album = item.album || item;
    if (!album) return null;

    return (
      <Box
        key={album.id}
        onClick={() => navigate(`/dashboard/album/${album.id}`)}
        sx={{
          backgroundColor: '#181818',
          borderRadius: '12px',
          p: 1.8,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            backgroundColor: '#202020',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.28)'
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
            borderRadius: '10px',
            mb: 1.4
          }}
        />

        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 800,
            color: 'white',
            mb: 0.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {album.name}
        </Typography>

        <Typography
          sx={{
            fontSize: '12px',
            color: '#b3b3b3',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {album.artists?.map((artist) => artist.name).join(', ') || 'Album'}
        </Typography>
      </Box>
    );
  };

  const renderMediaGrid = (items, renderer) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
        gap: 2
      }}
    >
      {items.map((item) => renderer(item))}
    </Box>
  );

  return (
    <Box sx={{ color: 'white', minHeight: '100%' }}>
      <TopBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userName={profile?.display_name || 'user'}
        tabs={LIBRARY_TABS}
      />

      <Box sx={{ px: 4, pb: 4 }}>
        <Typography
          sx={{
            fontSize: '42px',
            fontWeight: 800,
            mb: 1
          }}
        >
          Your Library
        </Typography>

        <Typography
          sx={{
            color: '#b3b3b3',
            fontSize: '14px',
            mb: 4
          }}
        >
          Allt du sparat, organiserat i en renare och mer visuell översikt.
        </Typography>

        {loading ? (
          <LoadingState type="cards" cards={10} />
        ) : activeTab === 'Playlists' ? (
          visibleSections.length > 0 ? (
            visibleSections.map((section) => {
              const meta = sectionMeta[section.key];
              const SectionIcon = meta.icon;

              return (
                <Box key={section.key} sx={{ mb: 5 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1.1,
                      mb: 2,
                      cursor: 'default',
                      '& .library-section-icon': {
                        color: meta.iconColor,
                        transition: 'color 0.2s ease, transform 0.2s ease'
                      },
                      '& .library-section-title': {
                        transition: 'color 0.2s ease'
                      },
                      '&:hover .library-section-icon': {
                        color: meta.hoverColor,
                        transform: 'scale(1.06)'
                      },
                      '&:hover .library-section-title': {
                        color: '#ffffff'
                      }
                    }}
                  >
                    <SectionIcon
                      className="library-section-icon"
                      sx={{
                        fontSize: 23
                      }}
                    />

                    <Typography
                      className="library-section-title"
                      sx={{
                        fontSize: '22px',
                        fontWeight: 800,
                        color: 'white'
                      }}
                    >
                      {meta.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#8f8f8f',
                        mt: 0.3
                      }}
                    >
                      {section.items.length} spellistor
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
                      gap: 2
                    }}
                  >
                    {section.items.map((playlist) => renderPlaylistCard(playlist))}
                  </Box>
                </Box>
              );
            })
          ) : playlists.length > 0 ? (
            renderMediaGrid(playlists, renderPlaylistCard)
          ) : (
            <EmptyState
              icon="📚"
              title="Ditt bibliotek är tomt"
              description="Skapa eller följ en spellista så dyker den upp här."
            />
          )
        ) : activeTab === 'Podcasts' ? (
          shows.length > 0 ? (
            renderMediaGrid(shows, renderShowCard)
          ) : (
            <EmptyState
              icon="🗂️"
              title="Podcasts är tomt just nu"
              description="Du har inga sparade podcasts eller så skickar Spotify ingen data för kontot."
              compact
            />
          )
        ) : activeTab === 'Artists' ? (
          artists.length > 0 ? (
            renderMediaGrid(artists, renderArtistCard)
          ) : (
            <EmptyState
              icon="🗂️"
              title="Artists är tomt just nu"
              description="Du har inga top artists tillgängliga här ännu."
              compact
            />
          )
        ) : activeTab === 'Albums' ? (
          albums.length > 0 ? (
            renderMediaGrid(albums, renderAlbumCard)
          ) : (
            <EmptyState
              icon="🗂️"
              title="Albums är tomt just nu"
              description="Du har inga sparade album eller så skickar Spotify ingen data för kontot."
              compact
            />
          )
        ) : null}
      </Box>
    </Box>
  );
};

export default Library;