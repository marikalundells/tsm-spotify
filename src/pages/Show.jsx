import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';

const Show = () => {
  const { id } = useParams();

  const [show, setShow] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;

    const fetchData = async () => {
      try {
        const [showResponse, meResponse] = await Promise.all([
          fetch(`https://api.spotify.com/v1/shows/${id}`, {
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

        const showData = await showResponse.json();
        const meData = await meResponse.json();

        if (showResponse.ok) {
          setShow(showData);
        }

        if (meResponse.ok) {
          setProfile(meData);
        }
      } catch (error) {
        console.error('Fel vid hämtning av show:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Box sx={{ color: 'white', minHeight: '100%' }}>
      <TopBar userName={profile?.display_name || 'user'} />

      <Box sx={{ p: 4 }}>
        {loading ? (
          <Typography sx={{ color: '#b3b3b3' }}>Laddar podcast...</Typography>
        ) : show ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3, mb: 4 }}>
              <Box
                component="img"
                src={show.images?.[0]?.url || '/Spotify_Logo.png'}
                alt={show.name}
                sx={{
                  width: '220px',
                  height: '220px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />

              <Box>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, mb: 1 }}>
                  Podcast
                </Typography>

                <Typography sx={{ fontSize: '56px', fontWeight: 900, lineHeight: 0.95 }}>
                  {show.name}
                </Typography>

                <Typography sx={{ color: '#b3b3b3', mt: 2, maxWidth: '700px' }}>
                  {show.publisher}
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ fontSize: '16px', color: '#d0d0d0', maxWidth: '900px' }}>
              {show.description}
            </Typography>
          </>
        ) : (
          <Typography sx={{ color: '#b3b3b3' }}>Ingen podcast hittades.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Show;