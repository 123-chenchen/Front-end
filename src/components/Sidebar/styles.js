// Converted from makeStyles to a theme-aware sx object factory
export default function styles(theme) {
  return {
    imageLink: {
      display: 'flex',
      justifyContent: 'center',
      padding: '10% 0',
    },
    image: {
      width: '70%',
    },
    links: {
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
    genreImages: {
      filter: theme.palette.mode === 'dark' ? 'invert(1)' : undefined,
    },
    bigText: {
      color: theme.palette.primary.main,
      fontSize: 30,
    },
  };
}
