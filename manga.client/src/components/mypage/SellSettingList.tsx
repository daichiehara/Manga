// SellSettingList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { Box, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';

const SellSettingList: React.FC = () => {
  const menuItems = [
    { name: 'いいね一覧', path: '/mpfavolist' },
    { name: '出品した漫画', path: '/mangahistory' },
    { name: '交換した漫画', path: '/mangaexchanged' },
  ];

  return (
    <Box>
    <Typography variant='h6' sx={{ mx: `0.9rem`, mt: `1.8rem`,mb: `1rem`, fontWeight:600, color:'#707070'}}>出品管理</Typography>
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

export default SellSettingList;
