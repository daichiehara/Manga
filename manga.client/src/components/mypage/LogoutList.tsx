// LogoutList.tsx
import React from 'react';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import { Box} from '@mui/material';
import Divider from '@mui/material/Divider';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { authService } from '../../api/authService';

const LogoutList: React.FC = () => {
    const menuItems = [
      { name: 'ログアウト', path: '/mypage' },
    ];
  
    const handleLogout = useCallback(() => {
      authService.logout()
        .then(() => {
          console.log("Logged out successfully");
          // ログアウト成功後の遷移や状態更新処理をここに追加
        })
        .catch(error => {
          console.error("Logout failed", error);
          // エラーハンドリングをここに追加
        });
    }, []); // 依存配列は空でOK、authServiceは変わらないため


  return (
    <Box>
    <List sx={{pt:4, pb:18}}>
      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 && <Divider sx={{ mx: `0.9rem`}} />} 
          <ListItem component={Link} to={item.path} onClick={handleLogout}>
            <ListItemText primary={item.name} sx={{color:'#707070'}}/>
            <ChevronRightIcon sx={{color:'#707070'}}/>
          </ListItem>
          {index < menuItems.length  && <Divider sx={{mx:`1.0rem`}}/>} 
        </React.Fragment>
      ))}
    </List>
    </Box>
  );
};

export default LogoutList;
