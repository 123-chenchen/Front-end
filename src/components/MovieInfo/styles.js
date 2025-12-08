export default function styles(theme) {
  return {
   poster: {
  borderRadius: '20px',
  boxShadow: '0.5em 1em 1em rgb(64, 64, 70)',
  width: '80%',
  maxWidth: '350px',
  [theme.breakpoints.down('md')]: {
    margin: '0 auto',
    width: '60%',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    height: '350px',
    margin: '0 auto 30px auto',
  },
},

    genresContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      gap: theme.spacing(4),
    },

    genreImage: {
      filter: theme.palette.mode === 'dark' ? 'invert(1)' : undefined,
      marginRight: '10px',
    },

    castImage: {
      width: '100%',
      maxWidth: '7em',
      height: '8em',
      objectFit: 'cover',
      borderRadius: '10px',
    },

    links: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textDecoration: 'none',
      [theme.breakpoints.down('sm')]: {
        padding: '0.5rem 1rem',
      },
    },

    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },

    modal: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    video: {
      width: '50%',
      height: '50%',
      [theme.breakpoints.down('sm')]: {
        width: '90%',
        height: '90%',
      },
    },
  };
}
