import { AppBar, Toolbar, IconButton, Drawer, Box, useMediaQuery } from '@mui/material';
import { Menu, Brightness4, Brightness7 } from '@mui/icons-material';
import { useState, useContext } from 'react';
import { useTheme } from '@mui/material/styles';

import styles from './styles';
import { Search, Sidebar } from '../index';
import LoginMenu from '../Profile/LoginMenu';
import { ColorModeContext } from '../../utils/ToggleColorMode';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const sx = styles(theme);

  return (
    <>
      <AppBar position="fixed" sx={sx.appBar}>
        <Toolbar sx={sx.toolbar}>
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu />
            </IconButton>
          )}

          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {!isMobile && <Search />}

          <LoginMenu isMobile={isMobile} />

          {isMobile && <Search />}
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={sx.drawer}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          slotProps={{ paper: { sx: sx.drawerPaper } }}
        >
          <Sidebar setMobileOpen={setMobileOpen} />
        </Drawer>
      </Box>
    </>
  );
}

export default Navbar;
