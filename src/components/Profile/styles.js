export default function styles(theme) {
  return {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: 1,
    },
    box: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
    },
  };
}
