import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import TopBar from '../components/TopBar';
import formatDuration from '../utils/formatDuration';

const Album = () => {
  const { id } = useParams();
  const { setCurrentTrack, currentTrack, playTrack } = useOutletContext();

  const [album, setAlbum] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;

    const fetchData = async () => {
      try {
        const [albumResponse, meResponse] = await Promise.all([
          fetch(`https://api.spotify.com/v1/albums/${id}`, {
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

        const albumData = await albumResponse.json();
        const meData = await meResponse.json();

        if (albumResponse.ok) {
          setAlbum(albumData);
        }

        if (meResponse.ok) {
          setProfile(meData);
        }
      } catch (error) {
        console.error('Fel vid hämtning av album:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleTrackClick = (track) => {
    if (!album?.uri) return;

    setCurrentTrack(track);
    playTrack(track, album.uri);
  };

  return (
    <Box sx={{ color: 'white', minHeight: '100%' }}>
      <TopBar userName={profile?.display_name || 'user'} />

      <Box sx={{ p: 4 }}>
        {loading ? (
          <Typography sx={{ color: '#b3b3b3' }}>Laddar album...</Typography>
        ) : album ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, mb: 4 }}>
              <Box
                component="img"
                src={album.images?.[0]?.url || '/Spotify_Logo.png'}
                alt={album.name}
                sx={{
                  width: '220px',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />

              <Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, mb: 1 }}>
                  Album
                </Typography>

                <Typography sx={{ fontSize: '64px', fontWeight: 900, lineHeight: 0.95 }}>
                  {album.name}
                </Typography>

                <Typography sx={{ color: '#b3b3b3', mt: 2 }}>
                  {album.artists?.map((artist) => artist.name).join(', ')}
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ fontSize: '26px', fontWeight: 800, mb: 2 }}>
              Tracks
            </Typography>

            {(album.tracks?.items || []).map((track, index) => {
              const isActive = currentTrack?.uri === track.uri;

              return (
                <Box
                  key={track.id || index}
                  onClick={() => handleTrackClick(track)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.4,
                    px: 1,
                    gap: 2,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.08)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      sx={{
                        width: 24,
                        color: isActive ? '#1db954' : '#b3b3b3',
                        fontWeight: isActive ? 700 : 500
                      }}
                    >
                      {index + 1}
                    </Typography>

                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: isActive ? '#1db954' : 'white'
                        }}
                        noWrap
                      >
                        {track.name}
                      </Typography>

                      <Typography sx={{ fontSize: '13px', color: '#b3b3b3' }} noWrap>
                        {track.artists?.map((a) => a.name).join(', ')}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ fontSize: '13px', color: '#b3b3b3' }}>
                    {formatDuration(track.duration_ms)}
                  </Typography>
                </Box>
              );
            })}
          </>
        ) : (
          <Typography sx={{ color: '#b3b3b3' }}>Inget album hittades.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Album;