import { Box, Button, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const MobileCreate = () => {
  return (
    <Box
      sx={{
        px: 2,
        pt: 3,
        minHeight: '100%',
        color: 'white'
      }}
    >
      <Typography
        sx={{
          fontSize: '34px',
          fontWeight: 900,
          lineHeight: 1,
          mb: 2
        }}
      >
        Create
      </Typography>

      <Box
        sx={{
          mt: 2,
          borderRadius: '22px',
          background:
            'linear-gradient(180deg, rgba(35,35,35,1) 0%, rgba(18,18,18,1) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          p: 3
        }}
      >
        <Typography
          sx={{
            fontSize: '28px',
            fontWeight: 900,
            mb: 1.2
          }}
        >
          Start a new playlist
        </Typography>

        <Typography
          sx={{
            color: '#b3b3b3',
            fontSize: '15px',
            lineHeight: 1.5,
            mb: 3
          }}
        >
          Den här sidan är byggd för portfolio-visning. Här visar du att mobilen har
          en egen create-yta och inte skickar användaren till desktop.
        </Typography>

        <Button
          startIcon={<AddRoundedIcon />}
          sx={{
            backgroundColor: '#1db954',
            color: '#111',
            textTransform: 'none',
            fontWeight: 800,
            px: 2.2,
            py: 1.1,
            borderRadius: '999px',
            '&:hover': {
              backgroundColor: '#1ed760'
            }
          }}
        >
          Create playlist
        </Button>
      </Box>
    </Box>
  );
};

export default MobileCreate;