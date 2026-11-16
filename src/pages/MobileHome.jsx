import { Box, Typography, Chip } from '@mui/material';
import MicNoneRoundedIcon from '@mui/icons-material/MicNoneRounded';
import HeadphonesRoundedIcon from '@mui/icons-material/HeadphonesRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import LibraryMusicRoundedIcon from '@mui/icons-material/LibraryMusicRounded';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getAccessTokenFromStorage from '../utils/getAccessTokenFromStorage';

const topFilters = ['Alla', 'Musik', 'Poddar', 'Ljudböcker'];

const fallbackQuickMixes = [
  { id: 'mix-1', name: 'skön flow', image: '/Spotify_Logo.png', type: 'music' },
  { id: 'mix-2', name: 'little tiny', image: '/Spotify_Logo.png', type: 'music' },
  { id: 'mix-3', name: 'sexy', image: '/Spotify_Logo.png', type: 'music' },
  { id: 'mix-4', name: 'meditation', image: '/Spotify_Logo.png', type: 'music' },
  { id: 'mix-5', name: 'hunkdunk', image: '/Spotify_Logo.png', type: 'music' },
  { id: 'mix-6', name: 'RageMode', image: '/Spotify_Logo.png', type: 'music' }
];

const discoverCards = [
  {
    title: 'Sleep Token-mix',
    subtitle: 'Bad Omens, NOTHING MORE och Falling In Reverse',
    color: 'linear-gradient(180deg, #3a2a38 0%, #151515 100%)'
  },
  {
    title: 'Dina topplåtar 2025',
    subtitle: 'Spotify Wrapped presenterar de låtar som följt dig',
    color: 'linear-gradient(180deg, #f2f2f2 0%, #cfc8ff 100%)',
    darkText: true
  },
  {
    title: 'Ariana Grande Radio',
    subtitle: 'Nya favoritspår och liknande artister',
    color: 'linear-gradient(180deg, #f6a6c1 0%, #f2bfd0 100%)',
    darkText: true
  }
];

const musicMixCards = [
  { title: 'Musik för dig', color: 'linear-gradient(180deg, #41234a 0%, #171717 100%)' },
  { title: '#soft jazz', color: 'linear-gradient(180deg, #3a241d 0%, #171717 100%)' },
  { title: 'Skapat för dig', color: 'linear-gradient(180deg, #8b67b6 0%, #5f4682 100%)' },
  { title: 'PopMix', color: 'linear-gradient(180deg, #b3567a 0%, #8d3f61 100%)' }
];

const podcastCards = [
  {
    id: 'pod-1',
    title: 'Samtal sent på kvällen',
    subtitle: 'Nya avsnitt varje vecka',
    color: 'linear-gradient(180deg, #55314f 0%, #171717 100%)'
  },
  {
    id: 'pod-2',
    title: 'Design och digitalt',
    subtitle: 'UX, teknik och idéer',
    color: 'linear-gradient(180deg, #264b57 0%, #171717 100%)'
  },
  {
    id: 'pod-3',
    title: 'Lugn morgonpodd',
    subtitle: 'Mjukt, stilla och inspirerande',
    color: 'linear-gradient(180deg, #5b3f26 0%, #171717 100%)'
  }
];

const audiobookCards = [
  {
    id: 'book-1',
    title: 'Stillhet',
    subtitle: 'En ljudbok för fokus och återhämtning',
    color: 'linear-gradient(180deg, #43515f 0%, #171717 100%)'
  },
  {
    id: 'book-2',
    title: 'Skriv bättre',
    subtitle: 'Praktiska kapitel för kreativt arbete',
    color: 'linear-gradient(180deg, #65523b 0%, #171717 100%)'
  },
  {
    id: 'book-3',
    title: 'Vanor som håller',
    subtitle: 'Små förändringar med stor effekt',
    color: 'linear-gradient(180deg, #355240 0%, #171717 100%)'
  }
];

const SectionTitle = ({ children }) => (
  <Typography sx={{ fontSize: '32px', fontWeight: 900, lineHeight: 1.05, mb: 1.8 }}>
    {children}
  </Typography>
);

const EmptyStateCard = ({ icon, title, text }) => (
  <Box
    sx={{
      borderRadius: '18px',
      background: 'linear-gradient(180deg, #232323 0%, #171717 100%)',
      border: '1px solid rgba(255,255,255,0.05)',
      px: 2,
      py: 2.2,
      mb: 3
    }}
  >
    <Box sx={{ color: '#1ed760', mb: 1 }}>{icon}</Box>
    <Typography sx={{ fontSize: '18px', fontWeight: 800, color: '#fff', mb: 0.8 }}>
      {title}
    </Typography>
    <Typography sx={{ fontSize: '14px', color: '#b3b3b3', lineHeight: 1.5 }}>
      {text}
    </Typography>
  </Box>
);

const MobileHome = () => {
  const navigate = useNavigate();

  const [profileLetter, setProfileLetter] = useState('M');
  const [playlists, setPlaylists] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Alla');

  useEffect(() => {
    const token = getAccessTokenFromStorage();
    if (!token) return;

    const fetchHomeData = async () => {
      try {
        const [meResponse, playlistsResponse] = await Promise.all([
          fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('https://api.spotify.com/v1/me/playlists?limit=12', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (meResponse.ok) {
          const meData = await meResponse.json();
          const firstLetter = meData?.display_name?.charAt(0)?.toUpperCase();
          if (firstLetter) setProfileLetter(firstLetter);
        }

        if (playlistsResponse.ok) {
          const playlistsData = await playlistsResponse.json();
          setPlaylists(playlistsData.items || []);
        }
      } catch (error) {
        console.error('MobileHome fetch error:', error);
      }
    };

    fetchHomeData();
  }, []);

  const quickMixes = useMemo(() => {
    if (playlists.length >= 6) {
      return playlists.slice(0, 6).map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        image: playlist.images?.[0]?.url || '/Spotify_Logo.png',
        type: 'music',
        isRealPlaylist: true
      }));
    }

    return fallbackQuickMixes.map((item) => ({
      ...item,
      isRealPlaylist: false
    }));
  }, [playlists]);

  const topDiscover = useMemo(() => {
    if (playlists.length >= 3) {
      return playlists.slice(0, 3).map((playlist, index) => ({
        id: playlist.id,
        title: playlist.name,
        subtitle: playlist.owner?.display_name || 'Spotify',
        image: playlist.images?.[0]?.url || '/Spotify_Logo.png',
        color:
          discoverCards[index]?.color ||
          'linear-gradient(180deg, #2d2d2d 0%, #171717 100%)',
        darkText: false,
        type: 'music',
        isRealPlaylist: true
      }));
    }

    return discoverCards.map((card, index) => ({
      id: `discover-${index}`,
      title: card.title,
      subtitle: card.subtitle,
      image: '/Spotify_Logo.png',
      color: card.color,
      darkText: card.darkText || false,
      type: 'music',
      isRealPlaylist: false
    }));
  }, [playlists]);

  const showMusic = activeFilter === 'Alla' || activeFilter === 'Musik';

  return (
    <Box sx={{ px: 3, pt: 3, pb: 4, color: 'white' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.2, minWidth: 0 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            backgroundColor: '#ef8fc0',
            color: '#111',
            fontSize: '27px',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {profileLetter}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.9,
            overflowX: 'auto',
            overflowY: 'hidden',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
            minWidth: 0,
            flex: 1,
            pr: 0.5,
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none'
          }}
        >
          {topFilters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              clickable
              onClick={() => setActiveFilter(filter)}
              sx={{
                height: 42,
                borderRadius: '999px',
                px: 0.2,
                backgroundColor: activeFilter === filter ? '#65d46e' : '#2a2a2a',
                color: activeFilter === filter ? '#111' : '#fff',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0,
                '& .MuiChip-label': { px: 1.6 }
              }}
            />
          ))}
        </Box>
      </Box>

      {showMusic && (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.2,
              mb: 2.8
            }}
          >
            {quickMixes.map((item) => (
              <Box
                key={item.id}
                onClick={() => {
                  if (item.isRealPlaylist) {
                    navigate(`/mobile/playlist/${item.id}`);
                  }
                }}
                sx={{
                  minWidth: 0,
                  height: 72,
                  borderRadius: '12px',
                  backgroundColor: '#2a2a2a',
                  display: 'grid',
                  gridTemplateColumns: '72px 1fr',
                  overflow: 'hidden',
                  cursor: item.isRealPlaylist ? 'pointer' : 'default'
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src = '/Spotify_Logo.png';
                  }}
                  sx={{
                    width: 72,
                    height: 72,
                    objectFit: 'cover',
                    backgroundColor: '#404040'
                  }}
                />
                <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center', px: 1.4 }}>
                  <Typography
                    sx={{
                      fontSize: '15px',
                      fontWeight: 800,
                      lineHeight: 1.2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              minHeight: 72,
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #2b2b2b 0%, #252525 100%)',
              display: 'flex',
              alignItems: 'center',
              px: 1.4,
              gap: 1.4,
              mb: 3.2,
              border: '1px solid rgba(255,255,255,0.04)'
            }}
          >
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: '50%',
                backgroundColor: '#1264d7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1ed760',
                fontWeight: 900,
                fontSize: '26px',
                flexShrink: 0
              }}
            >
              ◔
            </Box>

            <Typography
              sx={{
                flex: 1,
                color: '#d1d1d1',
                fontSize: '17px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Be om lite musik
            </Typography>

            <Box
              sx={{
                px: 1.05,
                py: 0.35,
                borderRadius: '9px',
                backgroundColor: '#d5d5d5',
                color: '#111',
                fontSize: '13px',
                fontWeight: 800,
                lineHeight: 1,
                flexShrink: 0
              }}
            >
              Beta
            </Box>

            <MicNoneRoundedIcon sx={{ fontSize: 28, color: '#d8d8d8', flexShrink: 0 }} />
          </Box>

          <SectionTitle>Fortsätt där du slutade</SectionTitle>

          <Box
            sx={{
              display: 'flex',
              gap: 1.4,
              overflowX: 'auto',
              pb: 1,
              mb: 3.2,
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none'
            }}
          >
            {topDiscover.map((card) => (
              <Box
                key={card.id}
                onClick={() => {
                  if (card.isRealPlaylist) {
                    navigate(`/mobile/playlist/${card.id}`);
                  }
                }}
                sx={{
                  minWidth: 206,
                  maxWidth: 206,
                  flexShrink: 0,
                  cursor: card.isRealPlaylist ? 'pointer' : 'default'
                }}
              >
                <Box
                  sx={{
                    height: 246,
                    borderRadius: '16px',
                    background: card.color,
                    overflow: 'hidden',
                    position: 'relative',
                    mb: 1.1,
                    display: 'flex',
                    alignItems: 'flex-end'
                  }}
                >
                  <Box
                    component="img"
                    src={card.image}
                    alt={card.title}
                    onError={(e) => {
                      e.currentTarget.src = '/Spotify_Logo.png';
                    }}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.88
                    }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontSize: '17px',
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: card.darkText ? '#111' : '#fff',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 0.45
                  }}
                >
                  {card.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: '14px',
                    color: card.darkText ? '#2b2b2b' : '#b3b3b3',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {card.subtitle}
                </Typography>
              </Box>
            ))}
          </Box>

          <SectionTitle>Dina topplåtmixar</SectionTitle>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.4,
              pb: 1,
              mb: 3
            }}
          >
            {musicMixCards.map((card) => (
              <Box key={card.title}>
                <Box
                  sx={{
                    height: 220,
                    borderRadius: '16px',
                    background: card.color,
                    overflow: 'hidden',
                    mb: 0.9,
                    position: 'relative'
                  }}
                />

                <Typography sx={{ fontSize: '16px', fontWeight: 800, lineHeight: 1.2 }}>
                  {card.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}

      {activeFilter === 'Poddar' && (
        <>
          <SectionTitle>Poddar för dig</SectionTitle>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.4, mb: 3 }}>
            {podcastCards.map((card) => (
              <Box
                key={card.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '92px 1fr',
                  gap: 1.4,
                  p: 1.2,
                  borderRadius: '16px',
                  backgroundColor: '#1c1c1c'
                }}
              >
                <Box
                  sx={{
                    width: 92,
                    height: 92,
                    borderRadius: '12px',
                    background: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <HeadphonesRoundedIcon sx={{ fontSize: 34, color: '#fff' }} />
                </Box>

                <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: '17px', fontWeight: 800, lineHeight: 1.2, mb: 0.55 }}>
                    {card.title}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#b3b3b3', lineHeight: 1.4 }}>
                    {card.subtitle}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <EmptyStateCard
            icon={<HeadphonesRoundedIcon sx={{ fontSize: 30 }} />}
            title="Fler poddar kommer här"
            text="Den här fliken visar just nu poddrelaterat innehåll i portfolio-versionen."
          />
        </>
      )}

      {activeFilter === 'Ljudböcker' && (
        <>
          <SectionTitle>Ljudböcker för dig</SectionTitle>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.4, mb: 3 }}>
            {audiobookCards.map((card) => (
              <Box
                key={card.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '92px 1fr',
                  gap: 1.4,
                  p: 1.2,
                  borderRadius: '16px',
                  backgroundColor: '#1c1c1c'
                }}
              >
                <Box
                  sx={{
                    width: 92,
                    height: 92,
                    borderRadius: '12px',
                    background: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MenuBookRoundedIcon sx={{ fontSize: 34, color: '#fff' }} />
                </Box>

                <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: '17px', fontWeight: 800, lineHeight: 1.2, mb: 0.55 }}>
                    {card.title}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#b3b3b3', lineHeight: 1.4 }}>
                    {card.subtitle}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <EmptyStateCard
            icon={<MenuBookRoundedIcon sx={{ fontSize: 30 }} />}
            title="Ljudböcker visas här"
            text="I portfolio-läget används en separat sektion för ljudböcker med ett eget uttryck."
          />
        </>
      )}

      {activeFilter === 'Alla' && (
        <>
          <SectionTitle>Rekommenderade stationer</SectionTitle>

          <Box
            sx={{
              display: 'flex',
              gap: 1.4,
              overflowX: 'auto',
              pb: 1,
              mb: 3.2,
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none'
            }}
          >
            {podcastCards.map((card) => (
              <Box key={card.id} sx={{ minWidth: 220, maxWidth: 220, flexShrink: 0 }}>
                <Box
                  sx={{
                    height: 220,
                    borderRadius: '16px',
                    background: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1
                  }}
                >
                  <HeadphonesRoundedIcon sx={{ fontSize: 42, color: '#fff' }} />
                </Box>

                <Typography sx={{ fontSize: '16px', fontWeight: 800, mb: 0.4 }}>
                  {card.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#b3b3b3',
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {card.subtitle}
                </Typography>
              </Box>
            ))}
          </Box>

          <SectionTitle>Böcker att fortsätta med</SectionTitle>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.4,
              pb: 1
            }}
          >
            {audiobookCards.slice(0, 2).map((card) => (
              <Box key={card.id}>
                <Box
                  sx={{
                    height: 220,
                    borderRadius: '16px',
                    background: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 0.9
                  }}
                >
                  <LibraryMusicRoundedIcon sx={{ fontSize: 42, color: '#fff' }} />
                </Box>

                <Typography sx={{ fontSize: '16px', fontWeight: 800, lineHeight: 1.2, mb: 0.4 }}>
                  {card.title}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#b3b3b3', lineHeight: 1.35 }}>
                  {card.subtitle}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default MobileHome;