import React from 'react';
import { List, ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Sidebar({ setMobileOpen }) {
  const close = () => setMobileOpen?.(false);
  return (
    <List>
      <ListItemButton component={Link} to="/" onClick={close}>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton component={Link} to="/profile/1" onClick={close}>
        <ListItemText primary="Profile" />
      </ListItemButton>
    </List>
  );
}
