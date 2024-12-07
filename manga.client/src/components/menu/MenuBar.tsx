//MenuBar.tsx
import React, { useState, useEffect, useCallback, memo, useContext } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Badge} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import PersonOutline from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import MyBookModal from '../common/MyBookModal';
import { NotificationContext } from '../context/NotificationContext';

// determineActiveIndexをコンポーネント外に移動
function determineActiveIndex(pathname: string): number {
  switch (pathname) {
    case '/':
    case '/item/new':
    case '/item/favorite':
      return 0;
    case '/notification':
      return 1;
    case '/main-mybook':
      return 2;
    case '/main-sell':
      return 3;
    case '/mypage':
      return 4;
    default:
      return -1;
  }
}

const MenuBar = memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(-1);
  const { unreadCount } = useContext(NotificationContext);

  useEffect(() => {
    const newIndex = determineActiveIndex(location.pathname);
    if (newIndex !== value) {
      setValue(newIndex);
    }
  }, [location.pathname, value]);

  const handleModalToggle = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  const handleNavigationChange = useCallback((newValue: number) => {
    if (newValue !== value) {
      setValue(newValue);
      switch (newValue) {
        case 0:
          // タブの状態を保持しながら遷移
          const currentTab = sessionStorage.getItem('selectedTab') || '1';
          const paths = ['item/favorite', '', 'item/new'];
          navigate(`/${paths[parseInt(currentTab)]}`);
          break;
        case 1:
          navigate('/notification');
          break;
        case 2:
          handleModalToggle();
          break;
        case 3:
          navigate('/main-sell');
          break;
        case 4:
          navigate('/mypage');
          break;
        default:
          break;
      }
    }
  }, [navigate, value, handleModalToggle]);
  

  const getIcon = (index: number, outlined: React.ReactNode, filled: React.ReactNode) => {
    if (index === 1) { // 通知アイコンの場合
      const icon = value === index ? filled : outlined;
      return (
        <Badge badgeContent={unreadCount} color="error">
          {icon}
        </Badge>
      );
    }
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
    background: '#E97032',
     
    boxShadow: '0px -5px 5px -1px rgba(0,0,0,0.2)', 
    color: 'white',
    zIndex: 1000,
    borderRadius: '50%', 
    width: `5rem`, 
    height: `5rem`, 
    position: 'absolute',
    top: `0.5rem`,
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
    <>
      {/*  <Paper sx={{pb:0, pt:`0.1rem`, boxShadow: '0px -4px 2.5px -1px rgba(0,0,0,0.1)',  position: 'fixed', bottom: 0, zIndex: 1000, maxWidth: '640px',width: '100%', left: '50%',transform: 'translateX(-50%)',   }}>  */}
      <Paper className="safe-area-bottom" sx={{ pt:`0.1rem`, position: 'fixed', bottom: 0, zIndex: 1000, maxWidth: '640px',width: '100%', left: '50%',transform: 'translateX(-50%)' }}>
        <BottomNavigation
          value={value}
          onChange={(_, newValue) => handleNavigationChange(newValue)}
          showLabels
          sx={{ width: '100%' }}
        >
          <BottomNavigationAction label="探す" icon={getIcon(0, <SearchOutlined sx={{fontSize:`1.6rem`}}/>, <SearchIcon sx={{fontSize:`1.6rem`}} />)} sx={actionStyle} />
            <BottomNavigationAction label="通知" icon={getIcon(1, <NotificationsOutlined sx={{fontSize:`1.6rem`}} />, <NotificationsIcon sx={{fontSize:`1.6rem`}} />)} sx={noticeStyle} />
            <BottomNavigationAction label="マイ本棚" icon={getIcon(2, <AutoStoriesOutlinedIcon sx={{fontSize:`1.6rem`}} />, <AutoStoriesIcon sx={{fontSize:`1.6rem`}} />)} sx={myBookshelfStyle} />
            <BottomNavigationAction label="出品" icon={getIcon(3, <CameraAltOutlinedIcon sx={{fontSize:`1.6rem`}}/>, <CameraAltIcon sx={{fontSize:`1.6rem`}}/>)} sx={sellStyle} />
            <BottomNavigationAction label="マイページ" icon={getIcon(4, <PersonOutline sx={{fontSize:`1.6rem`}} />, <PersonIcon sx={{fontSize:`1.6rem`}}/>)} sx={searchStyle} />
          </BottomNavigation>
        <MyBookModal isOpen={isModalOpen} onClose={handleModalToggle} />
      </Paper>
    </>
  );
});

export default MenuBar;
