import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import styles from './styles';

function Pagination({ currentPage, totalPages, setPage }) {
  const theme = useTheme();
  const sx = styles(theme);

  const handlePrev = () => {
    if (currentPage > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <Box sx={sx.root}>
      {/* Nút trái */}
      <IconButton
        onClick={handlePrev}
        disabled={currentPage === 1}
        sx={sx.arrowButton}
      >
        <ArrowBackIosNew fontSize="small" />
      </IconButton>

      {/* Khối “Trang 1 / 13” */}
      <Box sx={sx.pill}>
        <Typography sx={sx.label}>Page</Typography>
        <Box sx={sx.currentBox}>
          <Typography sx={sx.currentText}>{currentPage}</Typography>
        </Box>
        <Typography sx={sx.totalText}>/ {totalPages}</Typography>
      </Box>

      {/* Nút phải */}
      <IconButton
        onClick={handleNext}
        disabled={currentPage === totalPages}
        sx={sx.arrowButton}
      >
        <ArrowForwardIos fontSize="small" />
      </IconButton>
    </Box>
  );
}

export default Pagination;
