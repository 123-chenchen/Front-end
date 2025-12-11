export default function styles(theme) {
  return {
    movie: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textDecoration: 'none',
      p: 1,
      display: 'flex',
      justifyContent: 'center',
      transition: 'transform 0.25s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },

    image: {
      borderRadius: 20,
      width: 180,
      height: 300,
      objectFit: 'cover',
     
    },

    title: {
      fontSize: '1rem',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      width: '100%',
      textAlign: 'center',
      color: theme.palette.text.primary,

    },
  };
}
