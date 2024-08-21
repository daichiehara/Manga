import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';



interface WishListProps {
  wishTitles: { title: string; isOwned: boolean }[];
  shouldTruncate: boolean; 
}

const WishListDisplay: React.FC<WishListProps> = ({ wishTitles, shouldTruncate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // モバイル (600px以下)
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // タブレット (600px-960px)
  const isIse = useMediaQuery(theme.breakpoints.only('ise')); // カスタムブレークポイント (400px)

  // 表示するタイトルの数を設定
  let maxDisplayCount;
  if (isIse) {
    maxDisplayCount = 3;
  } else if (isMobile) {
    maxDisplayCount = 3;
  } else if (isTablet) {
    maxDisplayCount = 6;
  } else {
    maxDisplayCount = 6; // デフォルト値
  }

  // shouldTruncateがTrueの場合、表示するタイトルをmaxDisplayCountに制限
  const displayTitles = shouldTruncate ? wishTitles.slice(0, maxDisplayCount) : wishTitles;

  // wishTitlesが100以上の場合も表示するタイトルをmaxDisplayCountに制限
  const finalDisplayTitles = wishTitles.length > 100 ? displayTitles.slice(0, maxDisplayCount) : displayTitles;
  const moreExists = wishTitles.length > 100 || shouldTruncate;

  // タイトルの省略を行う関数
  const truncateTitle = (title: string, maxLength: number = 13) => {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
  };

  // 表示されるタイトルの数に応じて残りの数を計算
  const remainingCount = wishTitles.length - finalDisplayTitles.length;

  return (
    <Box sx={{ pt:0.2 ,display: 'flex', flexWrap: 'wrap'}}>
      {finalDisplayTitles.map((wish, index) => (
        <Box
        key={index}
        sx={{
          m: 0.4,
          ml: 0, // 一番右端の隙間を作らないために
          borderRadius: '100px',
          border: '1px solid',
          borderColor: wish.isOwned ? '#E97032' : 'rgba(0, 0, 0, 0.23)', // 透明な背景の場合の境界線
          backgroundColor: wish.isOwned ? '#FFF0E6' : 'inherit',
          //backgroundColor: wish.isOwned ? '#E97032' : 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          
        }}
      >
        <Typography
          sx={{
            px:1.3,
            py:0.4,
            fontSize: '0.75rem', 
            color: wish.isOwned ? '#E97032' : '#909090',
            textOverflow: 'ellipsis',
            whiteSpace: shouldTruncate ? 'nowrap' : 'nomal'
          }}
        >
          {shouldTruncate ? truncateTitle(wish.title) : wish.title}
        </Typography>
      </Box>
      ))}
      {moreExists && remainingCount > 0 && (
        <Typography component="span" sx={{ ml: 0.5, alignSelf: 'center', fontSize: '0.75rem',color:'#757575' }}>
          その他 {remainingCount} 点
        </Typography>
      )}
    </Box>
  );
};

export default WishListDisplay;
