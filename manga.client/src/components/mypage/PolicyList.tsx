// PolicyList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { Box, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';

const PolicyList: React.FC = () => {
  const menuItems = [
    { name: 'ヘルプ・お問い合わせ', path: '/mypage/contact', isExternal: false },
    { name: '利用規約等', path: '/terms', isExternal: false },
    { name: 'プライバシーポリシー等', path: '/privacy', isExternal: false },
    { name: '運営会社', path: 'https://roadmint.co.jp', isExternal: true }, // 外部リンクを追加
  ];

  return (
    <Box>
      <Typography variant='h6' sx={{ mx: `0.9rem`, mt: `1.8rem`, mb: `1rem`, fontWeight: 600, color: '#707070' }}>規約・ポリシー</Typography>
      <List sx={{ pt: 0 }}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {index === 0 && <Divider sx={{ mx: `0.9rem` }} />}
            <ListItem
              component={item.isExternal ? 'a' : Link}
              to={item.isExternal ? undefined : item.path}
              href={item.isExternal ? item.path : undefined}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
            >
              <ListItemText primary={item.name} sx={{ color: '#707070' }} />
              <ChevronRightIcon sx={{ color: '#707070' }} />
            </ListItem>
            {index < menuItems.length - 1 && <Divider sx={{ mx: `1.0rem` }} />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default PolicyList;
