import React from 'react';
import { Drawer, Box, Typography, List, ListItem, ListItemText, Divider, Button, SwipeableDrawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
  
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
  
    const handleNavigateToDetails = () => {
      navigate(`/item/${requestedSell.sellId}`);
      onClose();
    };
  
    return (
        <SwipeableDrawer 
        anchor="bottom" 
        open={open} 
        onClose={onClose} 
        onOpen={onOpen}
        disableScrollLock
            PaperProps={{
            style: {
                height: 'auto',
                width: '100%',
                maxWidth: '640px',
                margin: 'auto',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
            },
            }}
        >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            交換申請詳細
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            相手の漫画: {requestedSell.title}
          </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2" gutterBottom>
          あなたの出品:
        </Typography>
        <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {requestedSell.requesterSells.map((sell) => (
            <ListItem key={sell.itemId}>
              <ListItemText primary={sell.title} />
            </ListItem>
          ))}
        </List>
        <Button 
          variant="contained" 
          color="primary" 
          size='large'
          fullWidth
          onClick={handleNavigateToDetails}
          sx={{ mt: 2 }}
        >
          商品詳細・キャンセル
        </Button>
      </Box>
    </SwipeableDrawer>
  );
};

export default React.memo(RequestedSellDrawer);