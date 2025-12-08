export default function styles(theme) {
  return {
    imageLink: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  
    },
    image: {
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
      display: 'block',
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
