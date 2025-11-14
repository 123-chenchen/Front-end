// Converted from makeStyles to a theme-aware sx object factory
export default function styles(theme) {
  return {
    // Ô Grid bao quanh mỗi movie card
    movie: {
      padding: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',   // card nằm giữa ô Grid
    },

    // Link bọc ảnh + title + rating
    links: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textDecoration: 'none',
      fontWeight: 'bolder',
      width: 180,                 // card rộng cố định ~180px để 6 cái/1 hàng dễ canh
      '&:hover': {
        cursor: 'pointer',
      },
    },

    // Ảnh poster
    image: {
      borderRadius: 20,
      width: '100%',              // full theo width của card (180px)
      height: 270,                // cao vừa phải, giống poster
      objectFit: 'cover',         // cắt cho đẹp, không méo
      marginBottom: 10,
      transition: 'transform 200ms ease-in-out',
    },

    // Tiêu đề phim
    title: {
      fontSize: '1rem',
      textOverflow: 'ellipsis',
      overflow: 'hidden', 
      whiteSpace: 'nowrap', 
      width: '100%',  
      textAlign: 'center', 
    },
  };
}
