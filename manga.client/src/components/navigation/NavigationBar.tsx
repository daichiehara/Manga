import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookIcon from '@mui/icons-material/Book'; // マイ本棚のアイコン
import SellIcon from '@mui/icons-material/Sell';
import PersonIcon from '@mui/icons-material/Person';

const NavigationBar: React.FC = () => {
  const [value, setValue] = React.useState(0); // マイ本棚を初期選択状態に
  const navigate = useNavigate();

  const handleNavigationChange = (newValue: number) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/'); // 探すページへ
        break;
      case 1:
        navigate('/main-notification'); // 通知ページへ
        break;
      case 2:
        navigate('/main-mybook'); // マイ本棚ページへ
        break;
      case 3:
        navigate('/main-sell');
        break;
      case 4:
        navigate('/main-sell');
        break;
      default:
        break;
    }
  };

  return (
    <BottomNavigation
      value={value}
      onChange={(_, newValue) => handleNavigationChange(newValue)}
      showLabels
      sx={{width: '100%', position: 'fixed', bottom: 0, zIndex: 1000}}
    >
      <BottomNavigationAction label="探す" icon={<SearchIcon />} sx={{p:0}}/>
      <BottomNavigationAction label="通知" icon={<NotificationsIcon />} sx={{p:0}}/>
      <BottomNavigationAction label="マイ本棚" icon={<BookIcon />} sx={{p:0}}/> {/* 目立つスタイルを適用 */}
      <BottomNavigationAction label="出品" icon={<SellIcon />} sx={{p:0}}/> 
      <BottomNavigationAction label="マイページ" icon={<PersonIcon />} sx={{p:0}} />
    </BottomNavigation>
  );
};

export default NavigationBar;
