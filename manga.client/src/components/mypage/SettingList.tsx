// SettingList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { Box, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';

const SettingList: React.FC = () => {
  const menuItems = [
    { name: 'プロフィール設定', path: '/mpfavolist' },
    { name: 'メール・パスワード', path: '/mpchangeemailpassword' },
    { name: '住所', path: '/mpadressupdate' },
    { name: '本人確認', path: '/user/verification' },
  ];

  return (
    <Box>
    <Typography variant='h6' sx={{ mx: `0.9rem`, mt: `1.8rem`,mb: `1rem`, fontWeight:600, color:'#707070'}}>設定</Typography>
    <List sx={{pt:0}}>
      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 && <Divider sx={{ mx: `0.9rem`}} />} 
          <ListItem component={Link} to={item.path}>
            <ListItemText primary={item.name} sx={{color:'#707070'}}/>
            <ChevronRightIcon sx={{color:'#707070'}}/>
          </ListItem>
          {index < menuItems.length  && <Divider sx={{mx:`1.0rem`}}/>} {/* 最後のアイテムの後にはDividerを表示しない */}
        </React.Fragment>
      ))}
    </List>
    </Box>
  );
};

export default SettingList;
