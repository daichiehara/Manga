import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import axios from 'axios';
import CustomToolbar from '../components/common/CustumToolbar';

interface SellDraftDto {
  sellId: number;
  title: string;
  imageUrl: string;
}

const DraftList: React.FC = () => {
  const [drafts, setDrafts] = useState<SellDraftDto[]>([]);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await axios.get<SellDraftDto[]>('https://localhost:7103/api/Sells/Drafts');
      setDrafts(response.data);
    } catch (error) {
      console.error('Error fetching drafts:', error);
    }
  };

  return (
    <Box>
      <CustomToolbar title='下書き一覧' />
      <Box sx={{pt: { xs: '3.5rem', sm: '4rem' }}}>
        {drafts.length === 0 ? (
            <Typography>下書きはありません。</Typography>
        ) : (
            <List>
            {drafts.map((draft) => (
                <ListItem key={draft.sellId}>
                <ListItemAvatar>
                    <Avatar src={draft.imageUrl} alt={draft.title} />
                </ListItemAvatar>
                <ListItemText primary={draft.title} />
                </ListItem>
            ))}
            </List>
        )}
      </Box>
    </Box>
  );
};

export default DraftList;