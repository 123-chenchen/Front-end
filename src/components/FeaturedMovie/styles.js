export default function styles(theme) {
  return {
    card: {
      marginBottom: '20px',
      display: 'flex',
      height: '500px',
      width: '100%',
      flexDirection: 'column',
      borderRadius: '20px',
      position: 'relative',
    },
    cardMedia: {
      position: 'absolute',
      height: '600px',
      width: '100%',
      
    },
    cardContentWrapper: {
      position: "absolute",
      padding: "20px",
      width: "100%",
      height: "100%",
      display: 'flex',
      alignItems: 'flex-end',
      background: `
        linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0)),
        linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0))
      `,
    },
    cardContent: {
      width: '50%',
      color: theme.palette.common.white,
    },
  };
}
