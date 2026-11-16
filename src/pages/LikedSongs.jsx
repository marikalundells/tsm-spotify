import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import SongTable from '../components/SongTable';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';

const LikedSongs = () => {
  const { setCurrentTrack, currentTrack, playTrack } = useOutletContext();

  const [tracks, setTracks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLikedSongs = async () => {
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        setError('Ingen access token hittades.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const [tracksResponse, meResponse] = await Promise.all([
          fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch('https://api.spotify.com/v1/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ]);

        const tracksData = await tracksResponse.json();
        const meData = await meResponse.json();

        if (!tracksResponse.ok) {
          if (tracksResponse.status === 403) {
            setError('Spotify tillåter inte åtkomst till liked songs med nuvarande token.');
          } else if (tracksResponse.status === 401) {
            setError('Din inloggning har gått ut. Logga in igen.');
          } else {
            setError('Kunde inte hämta liked songs.');
          }

          setTracks([]);
        } else {
          setTracks(tracksData.items || []);
        }

        if (meResponse.ok) {
          setProfile(meData);
        }
      } catch (err) {
        console.error('Fel vid hämtning av liked songs:', err);
        setError('Något gick fel när liked songs hämtades.');
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, []);

  if (loading) {
    return <LoadingState type="playlist-header" />;
  }

  const likedImage = tracks[0]?.track?.album?.images?.[0]?.url || '/Spotify_Logo.png';
  const likedCount = tracks.length;

  return (
    <Box sx={{ color: 'white', minHeight: '100%', width: '100%' }}>
      <Box
        sx={{
          background:
            'linear-gradient(to bottom, #5f2cff 0%, #3a1ea8 35%, #181818 78%, #121212 100%)',
          px: { xs: 2.5, md: 4 },
          pt: { xs: 4, md: 5 },
          pb: 3
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
            minHeight: { xs: 'auto', md: '280px' },
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          <Box
            sx={{
              width: { xs: '180px', md: '232px' },
              height: { xs: '180px', md: '232px' },
              flexShrink: 0,
              borderRadius: '2px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
              background:
                likedCount > 0
                  ? '#2a2a2a'
                  : 'linear-gradient(135deg, #6545ff 0%, #b356ff 50%, #ffffff 140%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            {likedCount > 0 ? (
              <Box
                component="img"
                src={likedImage}
                alt="Liked Songs"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : null}

            <Typography
              sx={{
                position: likedCount > 0 ? 'absolute' : 'static',
                bottom: likedCount > 0 ? 16 : 'auto',
                right: likedCount > 0 ? 16 : 'auto',
                fontSize: likedCount > 0 ? '42px' : '64px',
                lineHeight: 1
              }}
            >
              💜
            </Typography>
          </Box>

          <Box sx={{ minWidth: 0, maxWidth: '1200px' }}>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                mb: 1
              }}
            >
              Playlist
            </Typography>

            <Typography
              sx={{
                fontSize: 'clamp(44px, 6vw, 88px)',
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                mb: 2,
                maxWidth: '12ch',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere'
              }}
            >
              Liked Songs
            </Typography>

            <Typography
              sx={{
                fontSize: '14px',
                color: '#e2e2e2',
                mb: 1.5,
                maxWidth: '900px',
                lineHeight: 1.45
              }}
            >
              Dina sparade favoritlåtar samlade på ett ställe.
            </Typography>

            <Typography
              sx={{
                fontSize: '13px',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              {profile?.display_name || 'Du'} • {likedCount} låtar
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 4, py: 3 }}>
        {error && (
          <Box
            sx={{
              mb: 2,
              px: 2,
              py: 1.5,
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Typography sx={{ color: '#ff6b6b', fontSize: '14px', fontWeight: 700 }}>
              Kunde inte läsa liked songs
            </Typography>

            <Typography sx={{ color: '#b3b3b3', fontSize: '13px', mt: 0.5 }}>
              {error}
            </Typography>
          </Box>
        )}

        {!error && tracks.length > 0 ? (
          <SongTable
            tracks={tracks}
            setCurrentTrack={setCurrentTrack}
            currentTrack={currentTrack}
            playTrack={playTrack}
            playlistUri={null}
          />
        ) : !error ? (
          <EmptyState
            icon="💜"
            title="Inga liked songs ännu"
            description="När du sparar låtar i Spotify dyker de upp här automatiskt."
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default LikedSongs;