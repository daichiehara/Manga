import React from 'react';
import { Drawer, Box, Typography, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
  
  interface RequestedSellDrawerProps {
    open: boolean;
    onClose: () => void;
    requestedSell: {
      sellId: number;
      title: string;
      requesterSells: Array<{ itemId: number; title: string }>;
    } | null;
  }
  
  const RequestedSellDrawer: React.FC<RequestedSellDrawerProps> = ({ open, onClose, requestedSell }) => {
    const navigate = useNavigate();
  
    if (!requestedSell) return null;
  
    const handleNavigateToDetails = () => {
      navigate(`/item/${requestedSell.sellId}`);
      onClose();
    };
  
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 250, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
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
          onClick={handleNavigateToDetails}
          sx={{ mt: 2 }}
        >
          商品詳細・キャンセル
        </Button>
      </Box>
    </Drawer>
  );
};

export default React.memo(RequestedSellDrawer);