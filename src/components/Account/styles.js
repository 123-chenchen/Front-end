export default function styles(theme) {
  return {
    background: {
      minHeight: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      bgcolor: theme.palette.action.hover,
    },
    content: {
      textAlign: 'center',
      borderRadius: 2,
      p: 5,
      bgcolor: theme.palette.background.default,
    },
    text: {
      color: theme.palette.mode === 'dark' ? theme.palette.error.main : theme.palette.primary.main,
    },
    button: {
      color: theme.palette.mode === 'dark' ? theme.palette.error.main : theme.palette.primary.main,
      borderRadius: '10px',
      p:1,
    },
  };
}
