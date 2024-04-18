import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

interface TabsComponentProps {
  selectedTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const TabsComponent: React.FC<TabsComponentProps> = ({ selectedTab, onTabChange }) => {
  return (
    <Box
      sx={{
        borderBottom: '1px solid #F2F2F2',
        backgroundColor: '#F2F2F2',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
        mt: 9, // Material-UI ではテーマのスペーシング単位を使用できます。デフォルトでは8倍数です。
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        top: '20px', // 数値の直接使用よりも単位付きの文字列を使用するのが一般的です。
        right: 0,
        p: 0,
        width: '100%',
        zIndex: 'tooltip', // Material-UI では z-index を theme から参照することができます。
        maxWidth: '640px',
        left: '50%',
        transform: 'translateX(-50%)',
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
    </Box>
  );
};

export default TabsComponent;
