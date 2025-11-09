import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  content: {
    flexGrow: 1,
    padding: '6em 2em 2em',
  },
  toolkit: {
    height: '70px',
  },
}));

export default useStyles;
