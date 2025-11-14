// Converted from makeStyles to a theme-aware sx object factory
export default function styles(theme) {
  return {
    movie: {
      padding: '10px',
    },
    title: {
      color: theme.palette.text.primary,
      textOverflow: 'ellipsis',
      width: '230px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      marginTop: '10px',
      marginBottom: 0,
      textAlign: 'center',
    },
    links: {
      alignItems: 'center',
      fontWeight: 'bolder',
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    image: {
      borderRadius: '20px',
      height: '300px',
      marginBottom: '10px',
      transition: 'transform 200ms ease-in-out',
    },
  };
}
