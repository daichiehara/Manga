import React from 'react';
import { Box, Typography, Avatar, Chip } from '@mui/material';
import useTimeSince from '../../hooks/useTimeSince';

export interface Reply {
  replyId: number;
  message: string;
  created: string;
  nickName: string;
  profileIcon: string | null;
}

interface RecentCommentsDisplayProps {
  replies: Reply[];
}

const RecentCommentsDisplay: React.FC<RecentCommentsDisplayProps> = ({ replies }) => {
  return (
    <Box sx={{ pt: 1, pb: '1rem' }}>
      {replies.map((reply) => {
        const displayDate = useTimeSince(reply.created);
        return (
          <Box key={reply.replyId} sx={{ p: '0.4rem', display: 'flex', alignItems: 'flex-start' }}>
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
                      {displayDate}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default RecentCommentsDisplay;
