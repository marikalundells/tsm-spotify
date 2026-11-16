import { Box, InputBase, Typography } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

const browseStart = [
  {
    title: 'Musik',
    color: '#e1339c',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Poddar',
    color: '#c26c17',
    image:
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Ljudböcker',
    color: '#29407d',
    image:
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Live-evenemang',
    color: '#8b19ff',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80'
  }
];

const discoverCards = [
  {
    title: 'Musik för dig',
    image:
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: '#soft jazz',
    image:
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=900&q=80'
  },
  {
    title: 'Poddar för dig',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80'
  }
];

const exploreAll = [
  { title: 'Skapat för dig', color: '#8d67c8' },
  { title: 'Kommando central', color: '#14856a' },
  { title: 'Pop Mix', color: '#d95488' },
  { title: 'Avkoppling', color: '#4f6ccf' }
];

const MobileSearch = () => {
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.3 }}>
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
            M
          </Box>

          <Typography sx={{ fontSize: '34px', fontWeight: 900, lineHeight: 1 }}>
            Sök
          </Typography>
        </Box>

        <CameraAltOutlinedIcon sx={{ color: 'white', fontSize: 36 }} />
      </Box>

      <Box
        sx={{
          height: 64,
          borderRadius: '14px',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          gap: 1.4,
          mb: 2.8
        }}
      >
        <SearchRoundedIcon sx={{ color: '#111', fontSize: 30, flexShrink: 0 }} />
        <InputBase
          placeholder="Vad vill du lyssna på?"
          sx={{
            color: '#111',
            flex: 1,
            fontSize: '21px',
            '& input::placeholder': {
              color: '#111',
              opacity: 1
            }
          }}
        />
      </Box>

      <Typography sx={{ fontSize: '26px', fontWeight: 900, lineHeight: 1.1, mb: 1.8 }}>
        Börja utforska
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 1.4,
          mb: 3
        }}
      >
        {browseStart.map((item) => (
          <Box
            key={item.title}
            sx={{
              height: 120,
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: item.color,
              p: 1.6,
              display: 'flex',
              alignItems: 'flex-start'
            }}
          >
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.1,
                position: 'relative',
                zIndex: 2
              }}
            >
              {item.title}
            </Typography>

            <Box
              component="img"
              src={item.image}
              alt={item.title}
              sx={{
                position: 'absolute',
                right: -8,
                bottom: -6,
                width: 90,
                height: 90,
                borderRadius: '10px',
                objectFit: 'cover',
                transform: 'rotate(14deg)'
              }}
            />
          </Box>
        ))}
      </Box>

      <Typography sx={{ fontSize: '26px', fontWeight: 900, lineHeight: 1.1, mb: 1.8 }}>
        Upptäck något nytt
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          overflowX: 'auto',
          pb: 1,
          mb: 3,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none'
        }}
      >
        {discoverCards.map((card) => (
          <Box key={card.title} sx={{ minWidth: 194, maxWidth: 194, flexShrink: 0 }}>
            <Box
              sx={{
                height: 276,
                borderRadius: '16px',
                overflow: 'hidden',
                mb: 1.1,
                backgroundColor: '#1a1a1a'
              }}
            >
              <Box
                component="img"
                src={card.image}
                alt={card.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>

            <Typography sx={{ fontSize: '16px', fontWeight: 800, lineHeight: 1.2 }}>
              {card.title}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography sx={{ fontSize: '26px', fontWeight: 900, lineHeight: 1.1, mb: 1.8 }}>
        Utforska alla
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 1.4
        }}
      >
        {exploreAll.map((item) => (
          <Box key={item.title}>
            <Box
              sx={{
                height: 164,
                borderRadius: '16px',
                backgroundColor: item.color,
                mb: 0.9
              }}
            />
            <Typography sx={{ fontSize: '16px', fontWeight: 800, lineHeight: 1.2 }}>
              {item.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MobileSearch;