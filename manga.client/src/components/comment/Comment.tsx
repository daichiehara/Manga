import React from 'react';
import { Box, Typography, Chip, Avatar } from '@mui/material';

interface ReplyDto {
  replyId: number;
  message: string | null;
  created: string;
  nickName: string | null;
  profileIcon: string | null;
  isDeleted: boolean;
}

const Comment: React.FC<{ reply: ReplyDto }> = React.memo(({ reply }) => (
  <Box sx={{ p: '0.4rem', display: 'flex', alignItems: 'flex-start' }}>
    <Avatar sx={{ height: '3rem', width: '3rem', marginRight: '0.7rem' }} src={reply.profileIcon || undefined} />
    <Box>
      <Typography variant="subtitle2" sx={{ pl: 1 }}>
        {reply.nickName || '削除されたユーザー'}
      </Typography>
      <Chip
        sx={{
          height: 'auto',
          pl: 0,
          '& .MuiChip-label': {
            display: 'block',
            whiteSpace: 'normal',
            padding: '0.5rem',
          },
        }}
        label={
          <Box>
            <Typography variant="body2">
              {reply.message || 'このコメントは削除されました。'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(reply.created).toLocaleString()}
            </Typography>
          </Box>
        }
      />
    </Box>
  </Box>
));

export default Comment;
