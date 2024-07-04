import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Link, Button, SwipeableDrawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
  
  interface RequestedSellDrawerProps {
    open: boolean;
    onClose: () => void;
    onOpen: () => void;
    requestedSell: {
      sellId: number;
      title: string;
      requesterSells: Array<{ itemId: number; title: string }>;
    } | null;
  }
  
  const RequestedSellDrawer: React.FC<RequestedSellDrawerProps> = ({ open, onClose, onOpen, requestedSell }) => {
    const navigate = useNavigate();
  
    if (!requestedSell) return null;
  
    const handleNavigateToDetails = (itemId: number) => {
        navigate(`/item/${itemId}`);
        onClose();
    };
  
    return (
        <SwipeableDrawer 
        anchor="bottom" 
        open={open} 
        onClose={onClose} 
        onOpen={onOpen}
        disableBackdropTransition
        disableDiscovery
        disableSwipeToOpen
        swipeAreaWidth={0}
        disableScrollLock
            PaperProps={{
            style: {
                maxHeight: '70%',
                width: '100%',
                maxWidth: '640px',
                margin: 'auto',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
            },
            }}
        >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%', textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h6" sx={{pb: 3, color:'#0F9ED5', fontWeight: 'bold'}}>
            相手の漫画
          </Typography>
          <Link
          component="button"
          variant="body1"
          onClick={() => handleNavigateToDetails(requestedSell.sellId)}
          sx={{pb: 4, textDecoration: 'none', color: 'inherit'}}
        >
          {requestedSell.title}
        </Link>
        <KeyboardDoubleArrowUpIcon sx={{fontSize: '48px', pb: 4}} />
        <Typography variant="h6" gutterBottom sx={{color: '#EB4848', fontWeight: 'bold'}}>
          あなたの漫画
        </Typography>
        <List sx={{ overflowY: 'auto', width: '100%' }}>
          {requestedSell.requesterSells.map((sell) => (
            <ListItemButton 
              key={sell.itemId} 
              onClick={() => handleNavigateToDetails(sell.itemId)}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={sell.title} />
            </ListItemButton>
          ))}
        </List>
        <Button 
          variant="contained" 
          color="primary" 
          size='large'
          fullWidth
          onClick={() => handleNavigateToDetails(requestedSell.sellId)}
          sx={{ mt: 2 }}
        >
          商品詳細・キャンセル
        </Button>
      </Box>
    </SwipeableDrawer>
  );
};

export default React.memo(RequestedSellDrawer);