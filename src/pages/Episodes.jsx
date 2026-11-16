import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const Episodes = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEpisodes = async () => {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        setError('Ingen access token hittades.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://api.spotify.com/v1/me/episodes?limit=20', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 403) {
            setError('Spotify tillåter inte åtkomst till sparade episodes för den här användaren/token.');
          } else if (response.status === 401) {
            setError('Din inloggning har gått ut. Logga in igen.');
          } else {
            setError('Kunde inte hämta episodes.');
          }
          return;
        }

        setEpisodes(data.items || []);
      } catch (error) {
        console.error('Fel vid hämtning av episodes:', error);
        setError('Något gick fel när episodes hämtades.');
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  return (
    <Box sx={{ p: 4, color: 'white' }}>
      <Typography sx={{ fontSize: '42px', fontWeight: 800, mb: 3 }}>
        Your Episodes
      </Typography>

      {loading ? (
        <Typography sx={{ color: '#b3b3b3' }}>Laddar episodes...</Typography>
      ) : error ? (
        <Typography sx={{ color: '#ff6b6b' }}>{error}</Typography>
      ) : episodes.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 2
          }}
        >
          {episodes.map((item, index) => {
            const episode = item.episode;
            if (!episode) return null;

            return (
              <Box
                key={episode.id || index}
                sx={{
                  backgroundColor: '#181818',
                  borderRadius: '8px',
                  p: 2
                }}
              >
                <Box
                  component="img"
                  src={episode.images?.[0]?.url || '/Spotify_Logo.png'}
                  alt={episode.name}
                  sx={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    mb: 1.5
                  }}
                />

                <Typography sx={{ fontWeight: 700 }} noWrap>
                  {episode.name}
                </Typography>

                <Typography sx={{ fontSize: '13px', color: '#b3b3b3' }} noWrap>
                  {episode.show?.name || 'Podcast'}
                </Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography sx={{ color: '#b3b3b3' }}>
          Inga sparade episodes hittades.
        </Typography>
      )}
    </Box>
  );
};

export default Episodes;