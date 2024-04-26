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
        // borderBottom: '1px solid #F2F2F2',
        //backgroundColor: '#F2F2F2',
        //boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
        mt: 9, // Material-UI ではテーマのスペーシング単位を使用できます。デフォルトでは8倍数です。
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        top: '0.8rem', 
        
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
        sx={{pt:`0px`}}
      >
        <Tab  sx={{color:`#404040`,pt:`0px`, pb:`2px`,px:`5vw`}} label="マイリスト" />
        <Tab sx={{color:`#404040`,pt:`0px`, pb:`2px`,px:`5vw`}} label="おすすめ" />
        <Tab sx={{color:`#404040`,pt:`0px`, pb:`2px`,px:`5vw`}} label="新着順" />
      </Tabs>
    </Box>
  );
};

export default TabsComponent;
