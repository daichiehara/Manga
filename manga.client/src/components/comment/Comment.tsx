import React, { useState } from 'react';
import { Box, Typography, Chip, Avatar, IconButton } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import ReportDialog from '../common/ReportDialog'; 
import useTimeSince from '../../hooks/useTimeSince';

interface ReplyDto {
  replyId: number;
  message: string | null;
  created: string;
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

  return (
    <>
      <Box sx={{ p: '0.4rem', display: 'flex', alignItems: 'flex-start' }}>
        <Avatar sx={{ height: '3rem', width: '3rem', marginRight: '0.7rem' }} src={reply.profileIcon || undefined} />
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
                  {/* Ensure no aria-hidden or focus-blocking properties */}
                  <Box onClick={handleReportClick} sx={{ }} aria-label="Report">
                    <FlagIcon fontSize="small" sx={{ color: '#909090' }} focusable="false" />
                  </Box>
                </Box>
              </Box>
            }
          />
        </Box>
      </Box>

      {/* Report Dialog */}
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
