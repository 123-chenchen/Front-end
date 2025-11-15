// Converted from makeStyles to a theme-aware sx object factory
export default function styles(theme) {
  return {
    root: {
      display: 'flex',
      height: '100%',
    },
    content: {
      flexGrow: 1,
      padding: '5em 2em 2em',
    },
    toolbar: theme?.mixins?.toolbar || { height: '70px' },
  };
}
