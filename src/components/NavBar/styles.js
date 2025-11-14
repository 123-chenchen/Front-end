// src/components/Navbar/styles.js
const drawerWidth = 240;

export default function styles(theme) {
  return {
    // AppBar chừa chỗ cho sidebar trên màn hình >= sm
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
      },
    },

    // Thanh Toolbar bên trong AppBar
    toolbar: {
      height: '80px',
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 2),
      [theme.breakpoints.down('sm')]: {
        flexWrap: 'wrap',
      },
    },

    // Nút menu (chỉ hiện mobile)
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },

    // Vùng nav chứa Drawer (dùng cho layout)
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },

    // Paper bên trong Drawer
    drawerPaper: {
      width: drawerWidth,
    },

    // Nút link (My Movies)
    linkButton: {
      '&:hover': {
        color: 'white !important',
        textDecoration: 'none',
      },
    },
  };
}
