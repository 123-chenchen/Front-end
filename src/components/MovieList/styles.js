// Converted from makeStyles to a theme-aware sx object factory
export default function styles(theme) {
  return {
    moviesContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      overflow: 'auto',
      flexWrap: 'wrap',
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      },
    },
  };
}
