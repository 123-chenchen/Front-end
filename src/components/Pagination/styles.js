// Pagination styles: navigation kiểu pill như hình
export default function styles(theme) {
  const isDark = theme.palette.mode === 'dark';

  return {
    // Container bọc tất cả
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(3),
      marginTop: theme.spacing(4),
    },

    // Hai nút tròn trái/phải
    arrowButton: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: isDark ? '#252836' : '#e0e0e0',
      color: isDark ? '#b0b3c1' : '#555',
      boxShadow: isDark
        ? '0 4px 10px rgba(0,0,0,0.5)'
        : '0 4px 10px rgba(0,0,0,0.15)',
      '&:hover': {
        backgroundColor: isDark ? '#2f3444' : '#d5d5d5',
      },
      '&.Mui-disabled': {
        opacity: 0.3,
        boxShadow: 'none',
      },
    },

    // Khối pill ở giữa
    pill: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: 999,
      padding: theme.spacing(0.5, 2),
      backgroundColor: isDark ? '#2b3040' : '#f0f0f0',
      boxShadow: isDark
        ? '0 4px 14px rgba(0,0,0,0.6)'
        : '0 4px 14px rgba(0,0,0,0.12)',
      gap: theme.spacing(1.5),
    },

    // Chữ "Trang"
    label: {
      fontSize: 14,
      color: isDark ? '#ffffff' : '#333333',
    },

    // Ô số hiện tại
    currentBox: {
      borderRadius: 8,
      border: isDark
        ? '1px solid rgba(255,255,255,0.3)'
        : '1px solid rgba(0,0,0,0.2)',
      padding: theme.spacing(0.2, 1.5),
      minWidth: 32,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    currentText: {
      fontSize: 14,
      fontWeight: 500,
      color: isDark ? '#ffffff' : '#333333',
    },

    // Chữ "/ 13"
    totalText: {
      fontSize: 14,
      color: isDark ? '#c0c3d2' : '#555555',
    },
  };
}
