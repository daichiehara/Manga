// components/item/RecentCommentsDisplay.tsx

import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';

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
        <Box sx={{}}>
            <List>
                {replies.map((reply) => (
                    <ListItem key={reply.replyId}>
                        <Avatar src={reply.profileIcon || 'default_avatar_url'} alt={reply.nickName} />
                        <ListItemText 
                            primary={reply.nickName}
                            secondary={`${reply.message.substring(0, 30)}... - ${new Date(reply.created).toLocaleDateString()}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default RecentCommentsDisplay;
