import React from 'react';
import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReorderIcon from '@mui/icons-material/Reorder';

interface DeleteBottomButtonProps {
  onDelete: () => void;
  onReorder: () => void;
}

const DeleteBottomButton: React.FC<DeleteBottomButtonProps> = ({ onDelete, onReorder }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        position: 'fixed',
        bottom: '4vh',
        width: '100%',
        bgcolor: 'rgba(255, 255, 255, 0)',
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button
        variant="text"
        color="secondary"
        size="large"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}
        onClick={onReorder}
      >
        <ReorderIcon sx={{ fontSize: '30px' }} />
        <Box>並び替え</Box>
      </Button>
      <Button
        variant="text"
        color="secondary"
        size="large"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        onClick={onDelete}
      >
        <DeleteIcon sx={{ fontSize: '30px' }} />
        <Box>削除</Box>
      </Button>
    </Box>
  );
};

export default DeleteBottomButton;