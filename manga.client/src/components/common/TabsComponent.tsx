import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

// TabsComponent の Props の型定義
interface TabsComponentProps {
  selectedTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

// 共通のタブスタイル定義
const commonTabStyle = {
  color: '#404040', // タブのテキスト色
  pt: '0px', // 上パディングなし
  pb: '0px', // 下パディングなし
  py: '0px', // 垂直方向のパディングなし
  zIndex: 1000, // z-index 設定で前面に表示
  mx: '3%', // 水平方向のマージンを3%に設定
  width: '27.3333333333%', // 3つのタブで分割した幅
};

// タブコンポーネントの実装
const TabsComponent: React.FC<TabsComponentProps> = ({ selectedTab, onTabChange }) => {
  return (
    // タブを囲む Box コンポーネント
    <Box
      sx={{
        mt: 0, // 上マージンなし
        mb: 0, // 下マージンなし
        display: 'flex', // Flexbox コンテナ設定
        justifyContent: 'center', // 中央揃え（水平方向）
        alignContent: 'center', // 中央揃え（垂直方向）
        p: 0, // 全方向のパディングなし
        width: '100%', // 幅は100%
        maxWidth: '640px', // 最大幅は640px
        position: 'relative', // 相対位置
        left: '50%', // 左から50%の位置
        transform: 'translateX(-50%)', // X軸で中央に配置
      }}
    >
      {/* タブコンポーネント */}
      <Tabs 
        value={selectedTab}
        onChange={onTabChange}
        aria-label="basic tabs example"
        sx={{
          width: '100%', 
          pt: '0px', 
          height: '0.5rem', 
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
        // タブのインジケーターのカスタムスタイルを適用
        TabIndicatorProps={{ 
          style: {
            marginBottom: '0.5rem', 
            paddingBottom: '1.0rem', 
            height: '1.0rem', 
            background: 'white', 
            borderRadius: '50px', 
            position: 'absolute',
          }
        }}
      >
        {/* 個々のタブ */}
        <Tab disableRipple sx={{ ...commonTabStyle }} label="マイリスト" />
        <Tab disableRipple sx={{ ...commonTabStyle }} label="おすすめ" />
        <Tab disableRipple sx={{ ...commonTabStyle }} label="新着順" />
      </Tabs>
    </Box>
  );
};

// エクスポート時に React.memo を使用して、
// props が変更されない限り再レンダリングしないようにする
export default React.memo(TabsComponent);
