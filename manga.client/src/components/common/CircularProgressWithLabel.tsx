import React from 'react';
import { Box, CircularProgress, CircularProgressProps, Typography, Backdrop } from '@mui/material';

interface CircularProgressWithLabelProps extends CircularProgressProps {
  value: number;
  open: boolean;
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({
  value,
  open,
  ...props
}) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" value={value} {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="body2"
            component="div"
            sx={{ color: 'white' }}
          >{`${Math.round(value)}%`}</Typography>
        </Box>
      </Box>
    </Backdrop>
  );
};

export default CircularProgressWithLabel;