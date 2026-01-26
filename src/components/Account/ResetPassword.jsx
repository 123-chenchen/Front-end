import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {Link as RouterLink } from 'react-router-dom';
import background from '../../assets/background/background.png';
import blueLogo from '../../assets/logo/3.png';
import redLogo from '../../assets/logo/4.png';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import styles from './styles';

export default function ResetPassword({ onClose }) {
  const theme = useTheme();
  const sx = styles(theme);
  const logo = theme.palette.mode === 'dark' ? redLogo : blueLogo;

  return (
    <Box sx={{ ...sx.background, backgroundImage: `url(${background})` }}>
      <Box sx={sx.overlay} />
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
        }}
      >
        <img src={logo} alt="Logo" style={{ height: 100 }} />
      </Box>
      {/* Content */}

      <Box sx={sx.content}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight="bold">
            Reset Password
          </Typography>

          {/* RECOMOVIE LOGIN */}
          <TextField label="Fullname" />
          <TextField label="Email" />
          <TextField label="Username" />
          <TextField label="Password" />
          <TextField label="Confirm Password" />

          <Button
            variant="outlined"
            color={
              theme.palette.mode === 'dark' ? theme.palette.error.main : theme.palette.primary.main
            }
            sx={sx.button}
            startIcon={<LiveTvIcon />}
          >
            <Typography sx={sx.text}>Reset</Typography>
          </Button>

        </Stack>
        <Typography>
            Already have an account?
            <Typography
              component={RouterLink}
              to="/login"
              sx={{ ...sx.text, zIndex: 10, position: 'relative' }}
            >
              &nbsp; Sign in
            </Typography>
          </Typography>
      </Box>
    </Box>
  );
}
