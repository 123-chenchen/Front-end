// Converted from makeStyles to a theme-aware sx object factory
export default function styles() {
  return {
    image: {
      width: '100%',
      maxWidth: '350px',
      borderRadius: '20px',
      objectFit: 'cover',
      boxShadow: '0.5em 0.5em 1em',
    },
    btns: {
      marginTop: '2rem',
      display: 'flex',
      gap: 2,
      justifyContent: { xs: 'center', md: 'flex-start' },
      flexWrap: 'wrap',
    },
  };
}
