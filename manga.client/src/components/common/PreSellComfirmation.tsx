import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CancelIcon from '@mui/icons-material/Cancel';

interface PreSellDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PreSellDialog: React.FC<PreSellDialogProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Typography variant="body1" paragraph>
          以下の重要事項をご確認ください
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <LocalShippingIcon sx={{color: '#0F9ED5'}} />
            </ListItemIcon>
            <ListItemText 
              primary="配送方法" 
              secondary="マッチング成立後、商品の発送は元払い（送料出品者負担）となります。適切な梱包をお願いします。" 
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CancelIcon color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="キャンセルポリシー" 
              secondary="マッチング成立後のキャンセルは原則できません。" 
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          戻る
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained" autoFocus>
          同意して出品する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreSellDialog;