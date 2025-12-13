export default function styles(theme) {
  return {
    image: {
       width: '350px',
      height: '450px',
      objectFit: 'cover',
      borderRadius: '20px',
      boxShadow: '0.5em 0.5em 1em',
    },
    layout: {
      display: 'flex',
      gap: 8,
    },
    genresContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: theme.spacing(4),
    },

    genreImage: {
      filter: theme.palette.mode === 'dark' ? 'invert(1)' : undefined,
      marginRight: '10px',
      height: 30,
      transition: 'transform 0.25s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },

    castImage: {
      width: "80%",
      height: "150px",
      objectFit: "cover",
      borderRadius: "12px",
    },

    links: {
      display: 'flex',
      textDecoration: 'none',
      color: 'inherit',
    },

    modal: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    video: {
      width: '100%',
      height: '100%',
    },

    line: {
      width: '3px',
      bgcolor: theme.palette.mode === 'dark' ? theme.palette.error.main : theme.palette.primary.main,
    },
    
    castContainer: {
      width: 120,
      height: 200,
      display: "flex",
      flexDirection: "column",
      transition: 'transform 0.25s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
    nameCast: {
      mt: 1,
      variant:"subtitle1",      
    },
    
    button: {
      bgcolor: theme.palette.mode === 'dark' ? theme.palette.error.main : theme.palette.primary.main,       
      borderRadius: '40px',
      my: 2.5,
      transition: 'transform 0.25s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },

    castText: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      p: 0.5,
    },

    imdb: {
      color: theme.palette.mode === 'dark' ? theme.palette.error.main : theme.palette.primary.main,       
    }
  }
}
