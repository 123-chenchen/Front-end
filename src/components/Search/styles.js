import React from 'react';
import { InputBase, Paper } from '@mui/material';

export function Search() {
  return (
    <Paper component="form" sx={{ p: '2px 8px', display: 'flex', alignItems: 'center', width: 260 }}>
      <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
    </Paper>
  );
}
