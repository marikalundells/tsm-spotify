import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import TopBar from '../components/TopBar';
import formatDuration from '../utils/formatDuration';

const Artist = () => {
  const { id } = useParams();
  const { setCurrentTrack, currentTrack, playTrack } = useOutletContext();

  const [artist, setArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;

    const fetchData = async () => {
      try {
        const [artistResponse, tracksResponse, meResponse] = await Promise.all([
          fetch(`https://api.spotify.com/v1/artists/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks`, {
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

        const artistData = await artistResponse.json();
        const tracksData = await tracksResponse.json();
        const meData = await meResponse.json();

        if (artistResponse.ok) {
          setArtist(artistData);
        }

        if (tracksResponse.ok) {
          setTopTracks(tracksData.tracks || []);
        }

        if (meResponse.ok) {
          setProfile(meData);
        }
      } catch (error) {
        console.error('Fel vid hämtning av artist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleTrackClick = (track) => {
    setCurrentTrack(track);
    playTrack(track, null);
  };

  return (
    <Box sx={{ color: 'white', minHeight: '100%' }}>
      <TopBar userName={profile?.display_name || 'user'} />

      <Box sx={{ p: 4 }}>
        {loading ? (
          <Typography sx={{ color: '#b3b3b3' }}>Laddar artist...</Typography>
        ) : artist ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Box
                component="img"
                src={artist.images?.[0]?.url || '/Spotify_Logo.png'}
                alt={artist.name}
                sx={{
                  width: '220px',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />

              <Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, mb: 1 }}>
                  Artist
                </Typography>

                <Typography sx={{ fontSize: '64px', fontWeight: 900, lineHeight: 0.95 }}>
                  {artist.name}
                </Typography>

                <Typography sx={{ color: '#b3b3b3', mt: 2 }}>
                  {artist.followers?.total?.toLocaleString('sv-SE')} följare
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ fontSize: '26px', fontWeight: 800, mb: 2 }}>
              Top tracks
            </Typography>

            {topTracks.map((track, index) => {
              const isActive = currentTrack?.uri === track.uri;

              return (
                <Box
                  key={track.id}
                  onClick={() => handleTrackClick(track)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    py: 1.4,
                    px: 1,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.08)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                    <Typography
                      sx={{
                        width: 24,
                        color: isActive ? '#1db954' : '#b3b3b3',
                        fontWeight: isActive ? 700 : 500,
                        flexShrink: 0
                      }}
                    >
                      {index + 1}
                    </Typography>

                    <Box
                      component="img"
                      src={track.album?.images?.[0]?.url || '/Spotify_Logo.png'}
                      alt={track.name}
                      sx={{
                        width: '48px',
                        height: '48px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        flexShrink: 0
                      }}
                    />

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: isActive ? '#1db954' : 'white'
                        }}
                        noWrap
                      >
                        {track.name}
                      </Typography>

                      <Typography
                        sx={{ fontSize: '13px', color: '#b3b3b3' }}
                        noWrap
                      >
                        {track.album?.name}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: '#b3b3b3',
                      flexShrink: 0
                    }}
                  >
                    {formatDuration(track.duration_ms)}
                  </Typography>
                </Box>
              );
            })}
          </>
        ) : (
          <Typography sx={{ color: '#b3b3b3' }}>Ingen artist hittades.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Artist;