import React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';

const MyBottomNavigation: React.FC = () => {
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(_s, newValue) => {
        setValue(newValue);
      }}
    >
      <BottomNavigationAction label="探す" icon={<SearchIcon />} />
      <BottomNavigationAction label="通知" icon={<NotificationsNoneIcon />} />
      <BottomNavigationAction label="マイ本棚" icon={<AutoStoriesOutlinedIcon />} />
    </BottomNavigation>
  );
};

export default MyBottomNavigation;
