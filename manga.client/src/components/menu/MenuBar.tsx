//MenuBar.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import SellOutlined from '@mui/icons-material/SellOutlined';
import PersonOutline from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SellIcon from '@mui/icons-material/Sell';
import PersonIcon from '@mui/icons-material/Person';
import { useDrawer } from '../../hooks/useDrawer';
import MyBookModal from '../common/MyBookModal';

const MenuBar = React.memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const determineActiveIndex = () => {
    switch (location.pathname) {
      case '/': return 0;
      case '/main-notification': return 1;
      case '/main-mybook': return 2;
      case '/main-sell': return 3;
      case '/main-page': return 4;
      default: return -1;
    }
  };
  

  const [value, setValue] = React.useState(determineActiveIndex());

  // Effect to update the value when the location changes
  useEffect(() => {
    const newIndex = determineActiveIndex();
    setValue(newIndex);
  }, [location.pathname]); // location.pathname が変わったときだけ更新

  const handleNavigationChange = useCallback((newValue: 0 | 1 | 2 | 3 | 4) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/main-notification');
        break;
      case 2:
        handleModalToggle(); // モーダルをトグルする
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
    }, [navigate]);
  

  const getIcon = (index: number, outlined: React.ReactNode, filled: React.ReactNode) => {
    return value === index ? filled : outlined;
  };
  
  const actionStyle = {
    p: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color:`#7F7F7F`,
    '&.Mui-selected': {
      color: '#E97132', 
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  };

  const noticeStyle = {
    py: 0,
    pl: 0,
    pr: 6,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color:`#7F7F7F`,
    '&.Mui-selected': {
      color: '#E97132', 
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  };

  const sellStyle = {
    py: 0,
    pl: 6,
    pr: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color:`#7F7F7F`,
    '&.Mui-selected': {
      color: '#E97132', 
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  };

  const searchStyle = {
    p: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color:`#7F7F7F`,
    '&.Mui-selected': {
      color: '#E97132', 
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  };

  const myBookshelfStyle = {
    p:0,
    background: 'linear-gradient(to right, #FCCF31, #F55555)',
    boxShadow: '2px 4px 4px -1px rgba(0,0,0,0.25)', 
    color: 'white',
    zIndex: 1000,
    borderRadius: '50%', 
    width: `5rem`, 
    height: `5rem`, 
    position: 'absolute',
    top: `-0.1rem`,
    bottom: `10rem`, 
    right: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    '&.Mui-selected': {
      bgcolor: '#F2F2F2',
      color: 'white',
    },
    '& .MuiBottomNavigationAction-label': {
      fontSize: '0.75rem', 
      zIndex: 5000,
      color: 'white',
    },
    '& .MuiSvgIcon-root': { 
      fontSize: '2rem',
    },
  };

  return (
    <Paper sx={{boxShadow: '0px -4px 10px -1px rgba(0,0,0,0.25)',  position: 'fixed', bottom: 0, zIndex: 1000, maxWidth: '640px',width: '100%', left: '50%',transform: 'translateX(-50%)',   }}>
      <BottomNavigation
        value={value}
        onChange={(_, newValue) => handleNavigationChange(newValue)}
        showLabels
        sx={{ width: '100%' }}
      >
      <BottomNavigationAction label="探す" icon={getIcon(0, <SearchOutlined />, <SearchIcon />)} sx={actionStyle} />
      <BottomNavigationAction label="通知" icon={getIcon(1, <NotificationsOutlined />, <NotificationsIcon />)} sx={noticeStyle} />
      <BottomNavigationAction label="マイ本棚" icon={getIcon(2, <AutoStoriesOutlinedIcon />, <AutoStoriesIcon />)} sx={myBookshelfStyle} />
      <BottomNavigationAction label="出品" icon={getIcon(3, <SellOutlined />, <SellIcon />)} sx={sellStyle} />
      <BottomNavigationAction label="マイページ" icon={getIcon(4, <PersonOutline />, <PersonIcon />)} sx={searchStyle} />
    </BottomNavigation>
    <MyBookModal isOpen={isModalOpen} onClose={handleModalToggle} />
    </Paper>
    
  );
});

export default MenuBar;
