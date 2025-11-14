import React from 'react';
import { Typography, Button } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import styles from './styles';

function Pagination({ currentPage, setPage, totalPages }) {
  const theme = useTheme();
  const sx = styles(theme);

  const handlePrev = () => {
    if (currentPage !== 1) { setPage((prevPage) => prevPage - 1); }
  };
  const handleNext = () => {
    if (currentPage !== totalPages) { setPage((prevPage) => prevPage + 1); }
  };

  if (totalPages === 0) return null;

  return (
    <div style={sx.container}>
      <Button onClick={handlePrev} variant="contained" sx={sx.button} color="primary" type="button">Prev</Button>
      <Typography variant="h4" sx={sx.pageNumber}>{currentPage}</Typography>
      <Button onClick={handleNext} variant="contained" sx={sx.button} color="primary" type="button">Next</Button>
    </div>
  );
}

export default Pagination;
