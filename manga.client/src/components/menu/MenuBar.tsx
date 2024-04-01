import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookIcon from '@mui/icons-material/Book';
import SellIcon from '@mui/icons-material/Sell';
import PersonIcon from '@mui/icons-material/Person';

const MenuBar: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const handleNavigationChange = (newValue: 0 | 1 | 2 | 3 | 4) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/main-notification');
        break;
      case 2:
        navigate('/main-mybook');
        break;
      case 3:
        navigate('/main-sell'); 
        break;
      case 4:
        navigate('/main-page'); 
        break;
      default:
        break;
    }
  };
  
  const actionStyle = {
    p: 0,
    display: 'flex', // フレックスボックスレイアウトを使用
    flexDirection: 'column', // 要素を縦に配置
    justifyContent: 'center', // 中央揃え
    alignItems: 'center', // アイテムを中央に配置
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // ホバー時の背景色
    }
  };

  return (
    <BottomNavigation
      value={value}
      onChange={(_, newValue) => handleNavigationChange(newValue)}
      showLabels
      sx={{width: '100%', position: 'fixed', bottom: 0, zIndex: 1000 }}
    >
      <BottomNavigationAction label="探す" icon={<SearchIcon />} sx={actionStyle}/>
      <BottomNavigationAction label="通知" icon={<NotificationsIcon />} sx={actionStyle}/>
      <BottomNavigationAction label="マイ本棚" icon={<BookIcon />} sx={actionStyle}/> 
      <BottomNavigationAction label="出品" icon={<SellIcon />} sx={actionStyle}/> 
      <BottomNavigationAction label="マイページ" icon={<PersonIcon />} sx={actionStyle}/>
    </BottomNavigation>
  );
};

export default MenuBar;
