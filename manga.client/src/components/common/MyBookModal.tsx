import React, { useState, useEffect, useRef } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import BooksTabs from './BooksTabs';

interface MyBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    openWishlistTab?: boolean;
}

const MyBookModal: React.FC<MyBookModalProps> = React.memo(({ isOpen, onClose, openWishlistTab }) => {
  // State to manage when to trigger data fetching in BooksTabs
  const [triggerFetch, setTriggerFetch] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // スクロール位置をリセットするためのエフェクト
  useEffect(() => {
    if (!isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0; // モーダルが閉じたときにスクロール位置をリセット
    }
  }, [isOpen]);

  // Effect to control the triggerFetch state based on isOpen prop
  useEffect(() => {
    if (isOpen) {
      // Trigger fetching when modal opens
      setTriggerFetch(true);
    }
  }, [isOpen]);

  return (
    <SwipeableDrawer
        disableScrollLock //、これを有効にすることでページの
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
            width: '100vw', // 画面の幅にフルで広げる// Allows the width to grow with content up to maxWidth
            maxWidth: '640px',  // Maximum width set to 640px
            mx: 'auto',
          }
        }}
      >
        <Box
          ref={contentRef} // 追加: RefをBoxに割り当てる
          sx={{
            width: 'auto',  // Allows the width to grow with content up to maxWidth
            maxWidth: '640px',  // Maximum width set to 640px
            height: `80vh`,
            overflow: 'auto',
            
            mb: 2,
            px: 5
          }}
          role="presentation"
        >
          {/* Pass the triggerFetch state to BooksTabs */}
          <BooksTabs triggerFetch={triggerFetch} initialTab={openWishlistTab ? 1 : 0} />
        </Box>
      </SwipeableDrawer>
  );
});

export default MyBookModal;
