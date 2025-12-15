import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styles from '../styles';
import Navbar from '../Navbar/Navbar';

function MainLayout({ children }) {
  const theme = useTheme();
  const sx = styles(theme);

  return (
    <Box sx={sx.root}>
      <CssBaseline />
      <Navbar />
      <Box component="main" sx={sx.content}>
        <Box sx={sx.toolbar} />
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;
