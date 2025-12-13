export default function styles(theme) {
  return {
    image: {
      width: '100%',
      display: 'block',
    },

    links: {
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
    
    genreImages: {
      filter: theme.palette.mode === 'dark' ? 'invert(1)' : undefined,
      height: 30,
    },
  };
}
