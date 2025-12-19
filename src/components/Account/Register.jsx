import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import background from '../../assets/background/background.png';
import blueLogo from '../../assets/logo/3.png';
import redLogo from '../../assets/logo/4.png';
import { ColorModeContext } from '../../utils/ToggleColorMode';
import styles from './styles';

export default function Register({ onClose }) {
  const theme = useTheme();
  const sx = styles(theme);
  const colorMode = useContext(ColorModeContext);
  const logo = theme.palette.mode === 'dark' ? redLogo : blueLogo;

  return (
    <Box sx={{ ...sx.background, backgroundImage: `url(${background})` }}>
      <Box sx={sx.overlay} />

      {/* Toggle theme */}
      <IconButton
        onClick={colorMode.toggleColorMode}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 2,
          color: 'white',
        }}
      >
        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>

      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 100 }} />
      </Box>
      {/* Content */}

      <Box sx={sx.content}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight="bold">
            Sign In
          </Typography>

          {/* TMDB LOGIN */}
          <Button>
            <Typography sx={sx.text}>Sign in with TMDB</Typography>
          </Button>

          {/* Divider */}
          <Typography>Or</Typography>

          {/* RECOMOVIE LOGIN */}
          <TextField label="Fullname" />
          <TextField label="Email" />
          <TextField label="Username" />
          <TextField label="Password" />
          <TextField label="Confirm Password" />

          <Button>
            <Typography sx={sx.text}>Sign in Recomovie</Typography>
          </Button>
        </Stack>
        <Typography variant="body2" mt={3}>
          Already have an account?{' '}
          <Link to="/login" sx={sx.text}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
