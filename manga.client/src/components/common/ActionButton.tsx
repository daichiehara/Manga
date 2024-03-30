import React from 'react';
import { Box, Button } from '@mui/material';

interface ActionButtonProps {
    onClick: () => void;  // Callback function for the button click
    label: string;       // Text label for the button
  }

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, label }) => {
  return (
    <Box sx={{ px: 2, py:2, position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', background: 'white', boxShadow: '0px 8px 12px 10px rgba(0, 0, 0, 0.25)' }}>
        <Button
            variant="contained"
            color="primary"
            sx={{
            px: 0,
            width: '100%',
            background: 'linear-gradient(to right, #E97132, #F2CFEE)',
            boxShadow: 'none',
            color: '#f5f5f5'
            }}
            onClick={onClick}
        >
            {label}
        </Button>
    </Box>
  );
};
export default ActionButton;
