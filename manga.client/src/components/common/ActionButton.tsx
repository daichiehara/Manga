import React from 'react';
import { Button } from '@mui/material';

interface ActionButtonProps {
    onClick: () => void;  // Callback function for the button click
    label: string;       // Text label for the button
  }

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, label }) => {
  return (
    
        <Button
            variant="contained"
            sx={{
            mx: 2,
            maxWidth: '640px',
            width: '100%',
            //background: 'linear-gradient(to right, #E97132, #F2CFEE)',
            background: '#D83022',
            boxShadow: 'none',
            color: '#f5f5f5',
            fontWeight:'bold'
            }}
            onClick={onClick}
        >
            {label}
        </Button>
    
  );
};

export default ActionButton;
