import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookIcon from '@mui/icons-material/Book'; // マイ本棚のアイコン
import SellIcon from '@mui/icons-material/Sell';
import PersonIcon from '@mui/icons-material/Person';

const NavigationBar: React.FC = () => {
  const [value, setValue] = React.useState(0); // マイ本棚を初期選択状態に

  return (
    <BottomNavigation
      value={value}
      onChange={(_, newValue) => setValue(newValue)}
      showLabels
      sx={{ width: '100%', position: 'fixed', bottom: 0 }}
    >
      <BottomNavigationAction label="探す" icon={<SearchIcon />} />
      <BottomNavigationAction label="通知" icon={<NotificationsIcon />} />
      <BottomNavigationAction label="マイ本棚" icon={<BookIcon />} /> {/* 目立つスタイルを適用 */}
      <BottomNavigationAction label="出品" icon={<SellIcon />} />
      <BottomNavigationAction label="マイページ" icon={<PersonIcon />} />
    </BottomNavigation>
  );
};

export default NavigationBar;
