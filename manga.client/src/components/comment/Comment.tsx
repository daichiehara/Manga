import React, { useState } from 'react';
import { Box, Typography, Chip, Avatar, IconButton } from '@mui/material';
import { Link } from "react-router-dom";
import FlagIcon from '@mui/icons-material/Flag';
import ReportDialog from '../common/ReportDialog'; 
import useTimeSince from '../../hooks/useTimeSince';

interface ReplyDto {
  replyId: number;
  message: string | null;
  created: string;
  userId: string | null;
  nickName: string | null;
  profileIcon: string | null;
  isDeleted: boolean;
}

const Comment: React.FC<{ reply: ReplyDto }> = React.memo(({ reply }) => {
  const displayDate = useTimeSince(reply.created);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleReportClick = () => {
    setReportDialogOpen(true);
  };

  const handleReportDialogClose = () => {
    setReportDialogOpen(false);
  };

  const UserInfo = () => {
    const avatar = (
      <Avatar 
        sx={{ height: '3rem', width: '3rem', marginRight: '0.7rem' }} 
        src={reply.profileIcon || undefined} 
      />
    );

    if (reply.userId) {
      return (
        <>
          <Link to={`/profile/${reply.userId}`} style={{ textDecoration: 'none' }}>
            {avatar}
          </Link>
          <Box sx={{ flexGrow: 1 }}>
            <Link to={`/profile/${reply.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant="subtitle2" sx={{ pl: 1 }}>
                {reply.nickName || '削除されたユーザー'}
              </Typography>
            </Link>
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                      {displayDate}
                    </Typography>
                    <Box onClick={handleReportClick} sx={{}} aria-label="Report">
                      <FlagIcon fontSize="small" sx={{ color: '#909090' }} focusable="false" />
                    </Box>
                  </Box>
                </Box>
              }
            />
          </Box>
        </>
      );
    }

    return (
      <>
        {avatar}
        <Box sx={{ flexGrow: 1 }}>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    {displayDate}
                  </Typography>
                  <Box onClick={handleReportClick} sx={{}} aria-label="Report">
                    <FlagIcon fontSize="small" sx={{ color: '#909090' }} focusable="false" />
                  </Box>
                </Box>
              </Box>
            }
          />
        </Box>
      </>
    );
  };

  return (
    <>
      <Box sx={{ p: '0.4rem', display: 'flex', alignItems: 'flex-start' }}>
        <UserInfo />
      </Box>
      <ReportDialog
        id={reply.replyId} 
        reportType={2} 
        open={reportDialogOpen}
        onClose={handleReportDialogClose}
      />
    </>
  );
});

export default Comment;
