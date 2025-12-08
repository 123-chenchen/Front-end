export default function styles(theme) {
  return {
    // Khung chứa mỗi movie card
    movie: {
      padding: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
      transition: 'transform 0.25s ease-in-out',

      '&:hover': {
        transform: 'scale(1.05)',   // PHÓNG TO TOÀN BỘ CARD
      },
    },

    // Link bọc toàn bộ nội dung
    links: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textDecoration: 'none',
      fontWeight: 'bolder',
      width: 180,
      color: theme.palette.text.primary,
      transition: 'color 180ms ease',

      '&:hover': {
        color: theme.palette.text.primary,  // KHÔNG đổi màu
      },
      '&:visited': {
        color: theme.palette.text.primary,
      }
    },

    // Ảnh poster
    image: {
      borderRadius: 20,
      width: '100%',
      height: 270,
      objectFit: 'cover',
      marginBottom: 10,
      transition: 'transform 0.25s ease-in-out',
    },

    // Tiêu đề phim
    title: {
      fontSize: '1rem',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      width: '100%',
      textAlign: 'center',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      textDecoration: 'none',
    },

    // Rating (nếu bạn có add custom style)
    rating: {
      transition: 'transform 0.25s ease-in-out',
    },
  };
}
