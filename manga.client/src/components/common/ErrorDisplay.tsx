import React from 'react';
import { Box, Typography } from '@mui/material';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography variant="h6" color="error">
        エラー: {message}
      </Typography>
    </Box>
  );
};

export default ErrorDisplay;
