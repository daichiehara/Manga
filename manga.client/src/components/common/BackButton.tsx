import React from 'react';
import { IconButton, IconButtonProps } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
interface BackButtonProps extends IconButtonProps {
  handleBack: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ handleBack, ...rest }) => (
  <IconButton
    onClick={handleBack}
    {...rest}
    sx={{
      position: 'fixed',
      zIndex: 10000,
      top: 8,  // Fixed button position to top-left corner with some padding
      left: 8, // Fixed button position to top-left corner with some padding
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      },
    }}
  >
    <ArrowBackIosNewIcon />
  </IconButton>
);

export default BackButton;
