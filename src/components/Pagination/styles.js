// Converted from makeStyles to a theme-aware sx object factory
export default function styles(theme) {
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      margin: '30px 2px',
    },
    pageNumber: {
      margin: '0 20px !important',
      color: theme.palette.text.primary,
    },
  };
}
