export default function styles() {
  return {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    },
    box: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
    },
  };
}
