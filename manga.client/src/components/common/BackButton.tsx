import React from 'react';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps extends IconButtonProps {
  handleBack: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ handleBack, ...rest }) => (
  <IconButton
    onClick={handleBack}
    {...rest}
    sx={{
      position: 'fixed',
      top: 16,
      left: 16,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      },
    }}
  >
    <ArrowBackIcon />
  </IconButton>
);

export default BackButton;