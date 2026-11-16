import { Box, Typography } from '@mui/material';

const EmptyState = ({
  icon = '🎵',
  title = 'Inget hittades',
  description = 'Det finns inget att visa här just nu.',
  compact = false
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: compact ? '220px' : '320px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 4
      }}
    >
      <Box
        sx={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          px: 4,
          py: 5
        }}
      >
        <Typography
          sx={{
            fontSize: compact ? '40px' : '52px',
            lineHeight: 1,
            mb: 2
          }}
        >
          {icon}
        </Typography>

        <Typography
          sx={{
            color: 'white',
            fontSize: compact ? '24px' : '28px',
            fontWeight: 800,
            mb: 1.2
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: '#b3b3b3',
            fontSize: '14px',
            lineHeight: 1.6
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default EmptyState;