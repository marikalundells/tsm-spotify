import { Box, Typography } from '@mui/material';
import { useParams, useOutletContext } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import SongTable from '../components/SongTable';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import TopBar from '../components/TopBar';

const normalizeTrackEntry = (entry) => {
  if (!entry) return null;

  const actualTrack =
    entry.track ||
    entry.item ||
    entry.item?.track ||
    entry.item?.data ||
    entry.data ||
    null;

  if (!actualTrack) return null;

  return {
    ...entry,
    track: actualTrack
  };
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const rgbToCss = (r, g, b) => `rgb(${r}, ${g}, ${b})`;

const darken = (r, g, b, amount = 0.2) => [
  Math.round(r * (1 - amount)),
  Math.round(g * (1 - amount)),
  Math.round(b * (1 - amount))
];

const brighten = (r, g, b, amount = 0.14) => [
  clamp(Math.round(r + (255 - r) * amount), 0, 255),
  clamp(Math.round(g + (255 - g) * amount), 0, 255),
  clamp(Math.round(b + (255 - b) * amount), 0, 255)
];

const rgbToHsl = (r, g, b) => {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;

  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case nr:
        h = (ng - nb) / d + (ng < nb ? 6 : 0);
        break;
      case ng:
        h = (nb - nr) / d + 2;
        break;
      case nb:
        h = (nr - ng) / d + 4;
        break;
      default:
        break;
    }

    h /= 6;
  }

  return { h, s, l };
};

const getDominantColorFromImage = (imageUrl) => {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve([78, 78, 78]);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const sampleWidth = 60;
        const sampleHeight = 60;

        canvas.width = sampleWidth;
        canvas.height = sampleHeight;
        ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);

        const { data } = ctx.getImageData(0, 0, sampleWidth, sampleHeight);

        const buckets = new Map();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          if (a < 180) continue;

          const { s, l } = rgbToHsl(r, g, b);

          if (l < 0.12 || l > 0.82) continue;
          if (s < 0.18) continue;

          const br = Math.round(r / 24) * 24;
          const bg = Math.round(g / 24) * 24;
          const bb = Math.round(b / 24) * 24;

          const key = `${br},${bg},${bb}`;
          const weight = 1 + s * 2.4 + (0.5 - Math.abs(0.5 - l));

          if (!buckets.has(key)) {
            buckets.set(key, {
              r: br,
              g: bg,
              b: bb,
              score: 0
            });
          }

          buckets.get(key).score += weight;
        }

        if (!buckets.size) {
          resolve([78, 78, 78]);
          return;
        }

        const best = [...buckets.values()].sort((a, b) => b.score - a.score)[0];

        let [rr, gg, bb] = brighten(best.r, best.g, best.b, 0.08);
        [rr, gg, bb] = darken(rr, gg, bb, 0.12);

        resolve([rr, gg, bb]);
      } catch {
        resolve([78, 78, 78]);
      }
    };

    img.onerror = () => {
      resolve([78, 78, 78]);
    };
  });
};

const Playlist = () => {
  const { id } = useParams();
  const { setCurrentTrack, currentTrack, playTrack } = useOutletContext();

  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBlockedPlaylist, setIsBlockedPlaylist] = useState(false);
  const [heroColor, setHeroColor] = useState([78, 78, 78]);

  useEffect(() => {
    const fetchPlaylistAndTracks = async () => {
      const token = sessionStorage.getItem('accessToken');

      if (!token) {
        setError('Ingen access token hittades.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        setPlaylist(null);
        setTracks([]);
        setIsBlockedPlaylist(false);

        const [playlistResponse, meResponse] = await Promise.all([
          fetch(`https://api.spotify.com/v1/playlists/${id}`, {
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

        const playlistData = await playlistResponse.json().catch(() => ({}));
        const meData = await meResponse.json().catch(() => ({}));

        if (meResponse.ok) {
          setProfile(meData);
        }

        if (!playlistResponse.ok) {
          setError('Kunde inte hämta spellistan.');
          setLoading(false);
          return;
        }

        setPlaylist(playlistData);

        const imageUrl = playlistData.images?.[0]?.url || null;
        const extractedColor = await getDominantColorFromImage(imageUrl);
        setHeroColor(extractedColor);

        const tracksUrl =
          playlistData.tracks?.href ||
          playlistData.items?.href ||
          `https://api.spotify.com/v1/playlists/${id}/tracks`;

        const tracksResponse = await fetch(tracksUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const tracksData = await tracksResponse.json().catch(() => ({}));

        if (!tracksResponse.ok) {
          if (tracksResponse.status === 403) {
            setIsBlockedPlaylist(true);
            setError('Spotify tillåter inte att låtarna i den här spellistan hämtas via API.');
          } else {
            setError('Kunde inte hämta låtarna i den här spellistan.');
          }

          setTracks([]);
          setLoading(false);
          return;
        }

        const normalizedTracks = (tracksData.items || [])
          .map(normalizeTrackEntry)
          .filter(Boolean)
          .filter((entry) => entry.track);

        setTracks(normalizedTracks);
      } catch (err) {
        console.error('Fel i Playlist.jsx:', err);
        setError('Något gick fel när spellistan hämtades.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistAndTracks();
  }, [id]);

  const heroBackground = useMemo(() => {
    const [r, g, b] = heroColor;
    const top = brighten(r, g, b, 0.1);
    const mid = darken(r, g, b, 0.08);
    const deep = darken(r, g, b, 0.28);

    return `
      linear-gradient(
        to bottom,
        ${rgbToCss(top[0], top[1], top[2])} 0%,
        ${rgbToCss(mid[0], mid[1], mid[2])} 36%,
        ${rgbToCss(deep[0], deep[1], deep[2])} 58%,
        #181818 78%,
        #121212 100%
      )
    `;
  }, [heroColor]);

  const topBarBackground = useMemo(() => {
    const [r, g, b] = heroColor;
    const top = darken(r, g, b, 0.18);
    const bottom = darken(r, g, b, 0.34);

    return `
      linear-gradient(
        to bottom,
        rgba(${top[0]}, ${top[1]}, ${top[2]}, 0.72) 0%,
        rgba(${bottom[0]}, ${bottom[1]}, ${bottom[2]}, 0.26) 72%,
        rgba(${bottom[0]}, ${bottom[1]}, ${bottom[2]}, 0) 100%
      )
    `;
  }, [heroColor]);

  if (loading) {
    return (
      <Box sx={{ color: 'white', minHeight: '100%', width: '100%' }}>
        <Box sx={{ position: 'relative' }}>
          <TopBar
            activeTab=""
            onTabChange={() => {}}
            userName={profile?.display_name || 'user'}
            tabs={[]}
            overlay
            background="linear-gradient(to bottom, rgba(24,24,24,0.9), rgba(24,24,24,0.25), rgba(24,24,24,0))"
          />
          <LoadingState type="playlist-header" />
        </Box>
      </Box>
    );
  }

  if (!playlist) {
    return (
      <Box sx={{ color: 'white', minHeight: '100%', width: '100%' }}>
        <Box sx={{ position: 'relative' }}>
          <TopBar
            activeTab=""
            onTabChange={() => {}}
            userName={profile?.display_name || 'user'}
            tabs={[]}
            overlay
            background="linear-gradient(to bottom, rgba(24,24,24,0.9), rgba(24,24,24,0.25), rgba(24,24,24,0))"
          />
        </Box>

        <Box sx={{ p: 4, pt: 14 }}>
          <Typography color="white">Ingen playlist hittades.</Typography>
        </Box>
      </Box>
    );
  }

  const cleanedDescription = playlist.description
    ? playlist.description.replace(/<[^>]*>/g, '')
    : '';

  const playlistOwner = playlist.owner?.display_name || 'Spotify';
  const playlistImage = playlist.images?.[0]?.url || '/Spotify_Logo.png';
  const displayedTotal =
    tracks.length || playlist.tracks?.total || playlist.items?.total || 0;

  return (
    <Box sx={{ color: 'white', minHeight: '100%', width: '100%' }}>
      <Box sx={{ position: 'relative' }}>
        <TopBar
          activeTab=""
          onTabChange={() => {}}
          userName={profile?.display_name || 'user'}
          tabs={[]}
          overlay
          background={topBarBackground}
        />

        <Box
          sx={{
            background: heroBackground,
            px: { xs: 2.5, md: 4 },
            pt: { xs: 14, md: 16 },
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
              component="img"
              src={playlistImage}
              alt={playlist.name}
              sx={{
                width: { xs: '180px', md: '232px' },
                height: { xs: '180px', md: '232px' },
                objectFit: 'cover',
                boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
                flexShrink: 0
              }}
            />

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
                {playlist.name}
              </Typography>

              {cleanedDescription && (
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#d0d0d0',
                    mb: 1.5,
                    maxWidth: '900px',
                    lineHeight: 1.45
                  }}
                >
                  {cleanedDescription}
                </Typography>
              )}

              <Typography
                sx={{
                  fontSize: '13px',
                  color: '#ffffff',
                  fontWeight: 600
                }}
              >
                {playlistOwner} • {displayedTotal} låtar
              </Typography>
            </Box>
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
              {isBlockedPlaylist
                ? 'Spellistan är begränsad av Spotify API'
                : 'Kunde inte läsa spellistan'}
            </Typography>

            <Typography sx={{ color: '#b3b3b3', fontSize: '13px', mt: 0.5 }}>
              {isBlockedPlaylist
                ? 'Den här spellistan kan visas, men Spotify tillåter inte att låtlistan hämtas i den här appen.'
                : error}
            </Typography>
          </Box>
        )}

        {!error && tracks.length > 0 ? (
          <SongTable
            tracks={tracks}
            setCurrentTrack={setCurrentTrack}
            currentTrack={currentTrack}
            playTrack={playTrack}
            playlistUri={playlist.uri}
          />
        ) : !error ? (
          <EmptyState
            icon="🫧"
            title="Den här spellistan är tom"
            description="Lägg till låtar i spellistan så dyker de upp här."
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default Playlist;