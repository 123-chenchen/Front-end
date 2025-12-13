export default function styles(theme) {
  return {
    image: {
      width: '250px',
      height: '350px',
      objectFit: 'cover',
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
      transition: 'transform 0.25s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
    line: {
      width: '3px',
      bgcolor: theme.palette.mode === 'dark' ? theme.palette.error.main : theme.palette.primary.main,
    },
    
  }
}