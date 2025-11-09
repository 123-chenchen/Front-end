import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

export default function Profile() {
  const { id } = useParams();
  return (
    <Box sx={{ p: 3, mt: 8 }}>
      <Typography variant="h5">Profile ID: {id}</Typography>
    </Box>
  );
}
