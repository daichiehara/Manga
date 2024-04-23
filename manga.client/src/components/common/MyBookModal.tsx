import React, { useState, useEffect } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import BooksTabs from './BooksTabs';

interface MyBookModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MyBookModal: React.FC<MyBookModalProps> = React.memo(({ isOpen, onClose }) => {
  // State to manage when to trigger data fetching in BooksTabs
  const [triggerFetch, setTriggerFetch] = useState(false);

  // Effect to control the triggerFetch state based on isOpen prop
  useEffect(() => {
    if (isOpen) {
      // Trigger fetching when modal opens
      setTriggerFetch(true);
    }
  }, [isOpen]);

  return (
    <SwipeableDrawer
        anchor='bottom'
        open={isOpen}
        onClose={() => {
          onClose();
          // Reset triggerFetch when modal closes
          setTriggerFetch(false);
        }}
        onOpen={() => {}}
        swipeAreaWidth={0}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,  // Keep the component mounted after it's been displayed once
          BackdropProps: {
            invisible: true
          }
        }}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            width: 'auto',
            mx: 'auto',
          }
        }}
      >
        <Box
          sx={{
            width: 'auto',
            height: 500,
            overflow: 'hidden',
            mx: 'auto',
            mt: 2,
            mb: 2,
            p: 2
          }}
          role="presentation"
        >
          {/* Pass the triggerFetch state to BooksTabs */}
          <BooksTabs triggerFetch={triggerFetch} />
        </Box>
      </SwipeableDrawer>
  );
});

export default MyBookModal;
