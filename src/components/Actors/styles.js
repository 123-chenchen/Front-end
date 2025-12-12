export default function styles(theme) {
  return {
    image: {
      display: 'flex',
      maxWidth: '240px',
      maxHeight: '360px',
      borderRadius: '20px',
      boxShadow: '0.5em 0.5em 1em',
    },
    layout: {
      display: 'flex',
      gap: 6,
    },
    button: {
      bgcolor: theme.palette.mode === 'dark' ? theme.palette.error.main : theme.palette.primary.main,       
      borderRadius: '40px',
      my: 1.5,
    }
  }
}