import React from 'react';
import { Card, CardMedia, CardContent, Typography, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import WishListDisplay from './WishListDisplay';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// MangaListItemPropsインターフェースの定義
interface MangaListItemProps {
  sellId: number;
  sellImage: string;
  sellTitle: string;
  numberOfBooks: number;
  wishTitles: { title: string; isOwned: boolean }[];
}

// MangaListItemコンポーネントの定義
const MangaListItem: React.FC<MangaListItemProps> = React.memo(({ sellId, sellImage, sellTitle, numberOfBooks, wishTitles }) => {
  return (
    <Link to={`/item/${sellId}`} style={{ textDecoration: 'none' }}>
      <Card 
        sx={{ 
          display: 'flex', 
          margin: 0.9, 
          height: '13rem', 
          padding: 0,
          border: '0.05px solid rgba(0, 0, 0, 0.1)', // 薄い灰色の境界線を追加
          borderRadius: '4px', // 角の丸みを追加
          boxShadow: 'none' // カードの影をなくす
        }}
      >
        <Box sx={{
          width: '45%',  // 左側の画像の領域を45%に設定
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // 画像を中央に配置
          background: '#F2F2F2' // 背景色を設定
        }}>
          <CardMedia
            component="img"
            sx={{ 
              width: '98%',  // 画像をBoxの幅いっぱいに展開
              height: '98%',  // 画像の高さを自動調整
              objectFit: 'contain'  // アスペクト比を維持しつつ、全体が見えるように調整
            }}
            image={sellImage}
            alt={`Cover of ${sellTitle}`}
          />
        </Box>
        <CardContent sx={{ 
          pt:1.5,
          pl: 1.3,
          pr:0.5,
          width: '55%',  // 右側のテキスト領域を55%に設定
          height: 'auto',
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'flex-start', // コンテンツを上詰めに配置
          overflow: 'hidden' // コンテンツが溢れた場合にスクロール可能にする
        }}>
          <Grid container spacing={0} alignItems="center">
            <Typography 
              variant="body2" 
              sx={{ 
                 
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                WebkitLineClamp: 3,  // テキストを3行に制限
                textOverflow: 'ellipsis' // テキストが溢れた場合に省略記号を表示
              }}
            >
              {sellTitle}
            </Typography>
          </Grid>
          <Typography variant="subtitle2"  sx={{color: '#E97132', py:0.1}}>
              全巻
            <Box component="span" sx={{ color: '#757575',pl:1 }}>({numberOfBooks}巻)</Box>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', pt: 2 }}>
            <ShoppingCartIcon sx={{ fontSize: '1.2rem', mr: 0.5, color: '#F3B13D' }} />
            <Typography variant="subtitle2" component="span" sx={{ color: "#0F9ED5", fontWeight:`bold` }}>
              want
            </Typography>
            
          </Box>
          {/* WishListDisplayにwishTitlesを渡す */}
          {wishTitles && <WishListDisplay wishTitles={wishTitles} />}
        </CardContent>
      </Card>
    </Link>
  );
});

// MangaListItemコンポーネントをエクスポート
export default MangaListItem;
