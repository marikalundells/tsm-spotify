import { Box, Button, Switch, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePlaylist = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreatePlaylist = async () => {
    const token = sessionStorage.getItem('accessToken');

    if (!token) {
      setError('Ingen access token hittades.');
      return;
    }

    if (!name.trim()) {
      setError('Du måste ange ett namn på spellistan.');
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage('');
      setError('');

      const meResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const meData = await meResponse.json();

      if (!meResponse.ok) {
        setError('Kunde inte läsa användaren.');
        setIsSubmitting(false);
        return;
      }

      const createResponse = await fetch(
        `https://api.spotify.com/v1/users/${meData.id}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            public: isPublic
          })
        }
      );

      const createData = await createResponse.json();

      if (!createResponse.ok) {
        setError('Kunde inte skapa spellistan.');
        setIsSubmitting(false);
        return;
      }

      setMessage(`Spellistan "${createData.name}" skapades.`);
      setName('');
      setDescription('');
      setIsPublic(false);

      window.dispatchEvent(
        new CustomEvent('playlist-created', {
          detail: createData
        })
      );

      navigate(`/dashboard/playlist/${createData.id}`);
    } catch (err) {
      console.error('Fel vid skapande av playlist:', err);
      setError('Något gick fel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, color: 'white', maxWidth: '760px' }}>
      <Typography sx={{ fontSize: '42px', fontWeight: 800, mb: 1 }}>
        Create Playlist
      </Typography>

      <Typography sx={{ color: '#b3b3b3', mb: 4, fontSize: '14px' }}>
        Skapa en ny spellista som direkt dyker upp i ditt bibliotek.
      </Typography>

      <TextField
        fullWidth
        label="Playlist name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            color: 'white',
            borderRadius: '10px'
          },
          '& .MuiInputLabel-root': {
            color: '#b3b3b3'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3a3a3a'
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#666'
          }
        }}
      />

      <TextField
        fullWidth
        label="Description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            color: 'white',
            borderRadius: '10px'
          },
          '& .MuiInputLabel-root': {
            color: '#b3b3b3'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3a3a3a'
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#666'
          }
        }}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 4,
          px: 1,
          py: 1,
          borderRadius: '10px',
          backgroundColor: '#181818'
        }}
      >
        <Switch
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <Box>
          <Typography sx={{ fontWeight: 700 }}>Public playlist</Typography>
          <Typography sx={{ fontSize: '12px', color: '#b3b3b3' }}>
            Av om du vill skapa en privat spellista
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        onClick={handleCreatePlaylist}
        disabled={isSubmitting}
        sx={{
          backgroundColor: '#1db954',
          color: 'black',
          fontWeight: 800,
          fontSize: '14px',
          px: 3,
          py: 1.2,
          borderRadius: '999px',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#1ed760'
          },
          '&.Mui-disabled': {
            backgroundColor: '#3a3a3a',
            color: '#9e9e9e'
          }
        }}
      >
        {isSubmitting ? 'Creating...' : 'Create playlist'}
      </Button>

      {message && (
        <Typography sx={{ mt: 3, color: '#1db954', fontWeight: 700 }}>
          {message}
        </Typography>
      )}

      {error && (
        <Typography sx={{ mt: 3, color: '#ff6b6b', fontWeight: 700 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CreatePlaylist;