// Converted from makeStyles to a theme-aware sx object factory
export default function styles(theme) {
  return {
    searchContainer: {},
    input: {
      color: theme.palette.mode === 'light' ? 'dark' : undefined,
      filter: theme.palette.mode === 'light' ? 'invert(1)' : undefined,
    },
  };
}