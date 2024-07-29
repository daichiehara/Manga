// LogoutList.tsx
import React, { useState } from 'react';
import { ListItem, ListItemText, List, Box, Divider } from '@mui/material';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { authService } from '../../api/authService';
import CheckModal from '../common/CheckModal';

const LogoutList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    { name: 'ログアウト', path: '/mypage' },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    authService.logout()
      .then(() => {
        console.log("Logged out successfully");
        // ログアウト成功後の遷移や状態更新処理をここに追加
        setIsModalOpen(false);
      })
      .catch(error => {
        console.error("Logout failed", error);
        // エラーハンドリングをここに追加
      });
  };

  return (
    <Box>
      <List sx={{ pt: 4, pb: 18 }}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {index === 0 && <Divider sx={{ mx: `0.9rem` }} />}
            <ListItem button onClick={handleOpenModal}>
              <ListItemText primary={item.name} sx={{ color: '#707070' }} />
              <ChevronRightIcon sx={{ color: '#707070' }} />
            </ListItem>
            {index < menuItems.length && <Divider sx={{ mx: `1.0rem` }} />}
          </React.Fragment>
        ))}
      </List>
      <CheckModal
        open={isModalOpen}
        onClose={handleCloseModal}
        questionText="ログアウトしますか？"
        agreeText="ログアウトする"
        onAgree={handleLogout}
      />
    </Box>
  );
};

export default LogoutList;
