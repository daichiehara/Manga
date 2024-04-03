import React from 'react';
import { CircularProgress, Button } from '@mui/material';

interface LoginButtonProps {
  onClick: () => void;    // Callback function for the button click
  label: string;         // Text label for the button
  isLoading: boolean;    // Indicates whether the button is in loading state
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, label, isLoading }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={isLoading}
      fullWidth
      sx={{my:1, background: 'linear-gradient(to right, #FCCF31, #F55555)',}}
    >
      {isLoading ? <CircularProgress size={24} /> : label}
    </Button>
  );
};

export default LoginButton;
