import React from 'react';
import { Box } from '@mui/material';
import Comment from './Comment';

interface ReplyDto {
  replyId: number;
  message: string | null;
  created: string;
  nickName: string | null;
  profileIcon: string | null;
  isDeleted: boolean;
}

interface CommentListProps {
  replies: ReplyDto[];
}

const CommentList: React.FC<CommentListProps> = ({ replies }) => {
  return (
    <Box sx={{ pt: 1, pb: '5rem' }}>
      {replies.map((reply) => (
        <Comment key={reply.replyId} reply={reply} />
      ))}
    </Box>
  );
};

export default CommentList;
