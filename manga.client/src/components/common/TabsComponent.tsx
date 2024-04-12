import React from 'react';
import { Tabs, Tab } from '@mui/material';

interface TabsComponentProps {
  selectedTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({ selectedTab, onTabChange }) => {
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
        top: 20,
        left: 0,
        right: 0,
        padding: 0,
        width: '100%',
        zIndex: 1000,
      }}
    >
      <Tabs 
        value={selectedTab} 
        onChange={onTabChange} 
        aria-label="basic tabs example"
      >
        <Tab label="おすすめ" />
        <Tab label="マイリスト" />
      </Tabs>
    </div>
  );
};

export default TabsComponent;
