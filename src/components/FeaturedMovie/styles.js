// Converted from makeStyles to a theme-aware sx object factory
export default function styles(theme) {
  return {
    featuredCardContainer: {
      marginBottom: '20px',
      display: 'flex',
      height: '490px',
      textDecoration: 'none',
    },
    card: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      flexDirection: 'column',
    },
    cardRoot: {
      position: 'relative',
    },
    cardMedia: {
      position: 'absolute',
      height: '100%',
      width: '100%',
    },
    cardContent: {
      color: '#fff',
      width: '40%',
      [theme.breakpoints.down('sm')]: {
        width: '40%',
      },
    },
    cardContentRoot: {
      position: 'relative',
      backgroundColor: 'transparent', 
    },
  };
}
