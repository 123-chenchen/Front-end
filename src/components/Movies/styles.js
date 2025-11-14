// Converted to a theme-aware sx object factory
export default function styles(theme) {
  return {
    // Container khi đang loading
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '50vh',
    },

    // Container khi không có kết quả
    noResultsContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(2),
      textAlign: 'center',
    },

    // Wrapper chung cho phần nội dung Movies (nếu sau này cần thêm padding / margin)
    root: {
      // padding: theme.spacing(2), // nếu muốn thêm khoảng trống 2 bên
    },
  };
}
