import { Box, Skeleton } from '@mui/material';

const LoadingState = ({
  type = 'page',
  cards = 6
}) => {
  if (type === 'playlist-header') {
    return (
      <Box sx={{ color: 'white', minHeight: '100%', width: '100%' }}>
        <Box
          sx={{
            background:
              'linear-gradient(to bottom, #4e4e4e 0%, #2a2a2a 45%, #121212 100%)',
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
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                width: { xs: 180, md: 232 },
                height: { xs: 180, md: 232 },
                bgcolor: 'rgba(255,255,255,0.12)',
                flexShrink: 0
              }}
            />

            <Box sx={{ width: '100%', maxWidth: '820px' }}>
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: '12px', width: 80, bgcolor: 'rgba(255,255,255,0.12)' }}
              />

              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: '76px', width: '72%', bgcolor: 'rgba(255,255,255,0.12)' }}
              />

              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: '76px', width: '48%', bgcolor: 'rgba(255,255,255,0.12)' }}
              />

              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: '14px', width: '85%', mt: 1, bgcolor: 'rgba(255,255,255,0.12)' }}
              />

              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: '14px', width: '52%', bgcolor: 'rgba(255,255,255,0.12)' }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: 4, py: 3 }}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                display: 'grid',
                gridTemplateColumns: '44px minmax(240px, 1.8fr) minmax(180px, 1.2fr) 56px',
                alignItems: 'center',
                gap: 2,
                px: 2,
                py: 1.1
              }}
            >
              <Skeleton variant="text" animation="wave" sx={{ fontSize: '16px', width: 20, bgcolor: 'rgba(255,255,255,0.08)' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Skeleton variant="rectangular" animation="wave" sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.08)' }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" animation="wave" sx={{ fontSize: '14px', width: '60%', bgcolor: 'rgba(255,255,255,0.08)' }} />
                  <Skeleton variant="text" animation="wave" sx={{ fontSize: '13px', width: '40%', bgcolor: 'rgba(255,255,255,0.08)' }} />
                </Box>
              </Box>
              <Skeleton variant="text" animation="wave" sx={{ fontSize: '13px', width: '65%', justifySelf: 'end', bgcolor: 'rgba(255,255,255,0.08)' }} />
              <Skeleton variant="text" animation="wave" sx={{ fontSize: '13px', width: 32, justifySelf: 'end', bgcolor: 'rgba(255,255,255,0.08)' }} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (type === 'cards') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
          gap: 2
        }}
      >
        {Array.from({ length: cards }).map((_, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: '#181818',
              borderRadius: '10px',
              p: 1.8
            }}
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '8px',
                mb: 1.4,
                bgcolor: 'rgba(255,255,255,0.08)'
              }}
            />

            <Skeleton variant="text" animation="wave" sx={{ fontSize: '14px', width: '78%', bgcolor: 'rgba(255,255,255,0.08)' }} />
            <Skeleton variant="text" animation="wave" sx={{ fontSize: '12px', width: '58%', bgcolor: 'rgba(255,255,255,0.08)' }} />
            <Skeleton variant="text" animation="wave" sx={{ fontSize: '11px', width: '34%', bgcolor: 'rgba(255,255,255,0.08)' }} />
          </Box>
        ))}
      </Box>
    );
  }

  if (type === 'search-grid') {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 2
        }}
      >
        {Array.from({ length: cards }).map((_, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: '#181818',
              borderRadius: '8px',
              p: 2
            }}
          >
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '6px',
                mb: 1.5,
                bgcolor: 'rgba(255,255,255,0.08)'
              }}
            />

            <Skeleton variant="text" animation="wave" sx={{ fontSize: '14px', width: '74%', bgcolor: 'rgba(255,255,255,0.08)' }} />
            <Skeleton variant="text" animation="wave" sx={{ fontSize: '13px', width: '58%', bgcolor: 'rgba(255,255,255,0.08)' }} />
            <Skeleton variant="text" animation="wave" sx={{ fontSize: '12px', width: '28%', bgcolor: 'rgba(255,255,255,0.08)' }} />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Skeleton variant="text" animation="wave" sx={{ fontSize: '42px', width: 220, mb: 2, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Skeleton variant="text" animation="wave" sx={{ fontSize: '14px', width: 360, mb: 4, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
          gap: 2
        }}
      >
        {Array.from({ length: cards }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            animation="wave"
            sx={{
              width: '100%',
              aspectRatio: '1 / 1.24',
              borderRadius: '12px',
              bgcolor: 'rgba(255,255,255,0.08)'
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default LoadingState;