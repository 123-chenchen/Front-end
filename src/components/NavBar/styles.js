// Converted from makeStyles to a theme-aware sx object factory
const drawerWidth = 240;

export default function styles(theme) {
  return {
    toolbar: {
      height: '80px',
      display: 'flex',
      justifyContent: 'space-between',
      marginLeft: drawerWidth,
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        flexWrap: 'wrap',
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
    linkButton: {
      '&:hover': {
        color: 'white !important',
        textDecoration: 'none',
      },
    },
  };
}
