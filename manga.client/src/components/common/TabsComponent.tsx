import React, { useState } from 'react';
import { Tabs, Tab} from '@mui/material';

const TabsComponent: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div
      style={{
        borderBottom: '1px solid #F2F2F2',
        background: '#F2F2F2',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
        marginTop: '64px',
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: 0,
        width: '100%',
        zIndex: 1000,
      }}
    >
      <Tabs 
            value={selectedTab} 
            onChange={handleTabChange} 
            aria-label="basic tabs example"
          >
            <Tab label="Recommended" /> {/* Translated 'おすすめ' to 'Recommended' */}
            <Tab label="My List" /> {/* Translated 'マイリスト' to 'My List' */}
          </Tabs>
      </div>
  );
};

export default TabsComponent;
