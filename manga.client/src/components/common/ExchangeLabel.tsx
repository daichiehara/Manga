import React from 'react';
import { Box, BoxProps, Typography } from '@mui/material';

interface ExchangeLabelProps extends BoxProps {
  type: 'give' | 'want';
}

const ExchangeLabel: React.FC<ExchangeLabelProps> = ({ type, ...props }) => {
  const label = type === 'give' ? '譲' : '求';
  const bgColor = type === 'give' ? 'rgba(0, 128, 0, 0.1)' : 'rgba(255, 165, 0, 0.2)'; // 「求」の背景色を少し濃くしました
  const textColor = type === 'give' ? 'rgba(0, 128, 0, 0.8)' : 'rgba(255, 165, 0, 1.5)'; // 「求」の文字色を少し濃くしました

  return (
    <Box
      component="span"
      sx={{
        bgcolor: bgColor,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '1.8rem',
        height: '1.8rem',
        mr: 1,
        borderRadius: '0.3rem',
        ...props.sx
      }}
      {...props}
    >
      <Typography
        component="span"
        sx={{
          color: textColor,
          fontSize: '0.9rem',
          fontWeight: 'bold',
          fontFamily: 'Yu Gothic, "YuGothic", "游ゴシック体", "游ゴシック Medium", "游ゴシック", sans-serif',
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default ExchangeLabel;