import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  const theme = useTheme(); // テーマを取得

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <EmojiObjectsOutlinedIcon sx={{pb:`4rem`, fontSize:`8rem`,color: `#858585`,}}/>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.text.secondary }}> {/* テーマの色を使用 */}
        {message}
      </Typography>
    </Box>
  );
};

export default ErrorDisplay;
