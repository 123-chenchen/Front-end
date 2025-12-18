const drawerWidth = 'clamp(200px, 18vw, 280px)';

export default function styles(theme) {
  return {
    appBar: {
      width: `calc(100% - ${drawerWidth})`,
      marginLeft: drawerWidth,
    },

    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 2),
    },

    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },

    drawerPaper: {
      width: drawerWidth,
    },
  };
}
