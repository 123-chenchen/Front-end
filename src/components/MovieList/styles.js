export default function styles(theme) {
  return {
    moviesContainer: {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: theme.spacing(1),
    },
  };
}
