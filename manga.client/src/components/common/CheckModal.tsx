import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import theme from '../../theme/theme';

interface CheckModalProps {
  open: boolean;
  onClose: () => void;
  questionText: string;
  agreeText: string;
  onAgree: () => void;
  children?: React.ReactNode; // childrenプロパティを追加
}

const CheckModal: React.FC<CheckModalProps> = ({ open, onClose, questionText, agreeText, onAgree, children = null }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '640px',
          width: '60vw',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: '1.5rem',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', marginBottom: 2, color: theme.palette.text.secondary }}>
          {questionText}
        </Typography>
        {children}
        <Button
          variant="contained"
          color="primary"
          onClick={onAgree}
          sx={{ width: '100%', marginTop: 2, fontWeight: 'bold', boxShadow: 'none' }}
        >
          {agreeText}
        </Button>
        <Button
          variant="text"
          onClick={onClose}
          sx={{ width: '100%', marginTop: 2, fontWeight: 'bold', color: theme.palette.primary.main }}
        >
          キャンセル
        </Button>
      </Box>
    </Modal>
  );
};

export default CheckModal;
