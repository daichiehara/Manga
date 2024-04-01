import React from 'react';
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import WishListDisplay from './WishListDisplay';
/*
interface MangaListItemProps {
  imageUrl: string;
  title: string;
  numberOfBooks?: number;
  sellList: string[];
  wantList: string[];
}

const MangaListItem: React.FC<MangaListItemProps> = ({ imageUrl, title, numberOfBooks, wantList }) => {
  return (
    <Card sx={{ display: 'flex', margin: 2, alignItems: 'center', padding: 1 }}>
      <CardMedia
        component="img"
        sx={{ width: 151, height: 151 }}
        image={imageUrl}
        alt={`Cover of ${title}`}
      />
      <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
        <Typography component="div" variant="h5">
          {title} 全巻 {numberOfBooks}巻
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            欲しい
          </Typography>
          {wantList.map((item, index) => (
            <Chip key={index} label={item} sx={{ mb: 0.5 }} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MangaListItem;
*/

interface MangaListItemProps {
  sellId: number;
  sellImage: string;
  sellTitle: string;
  numberOfBooks: number;
  wishTitles: { title: string; isOwned: boolean }[];
}

const MangaListItem: React.FC<MangaListItemProps> = ({ sellId, sellImage, sellTitle, numberOfBooks, wishTitles }) => {
  return (
    <Link to={`/item/${sellId}`} style={{ textDecoration: 'none' }}>
      <Card 
        sx={{ 
          display: 'flex', 
          margin: 0.5, 
          height: '180px', 
          alignItems: 'center', 
          padding: 1,
          border: '0.05px solid rgba(0, 0, 0, 0.1)',// ここで境界線を追加し、薄い灰色に設定
          borderRadius: '4px', // 角の丸みを追加（オプション）
          boxShadow: 'none' // カードの影を無くす（オプション）
        }}
      >
        
        <div style={{
          width: '45%',  // 左側の画像の領域を45%に設定
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // 画像をdiv内で中央に配置
          background: '#F2F2F2'
        }}>
          <CardMedia
            component="img"
            sx={{ 
              width: '98%',  // 画像をdivの幅いっぱいに展開
              height: '98%',  // 画像の高さを自動調整
              objectFit: 'contain'  // アスペクト比を維持しつつ、全体が見えるように調整
            }}
            image={sellImage}
            alt={`Cover of ${sellTitle}`}
          />
        </div>
        <CardContent sx={{ 
          pl:1.3, pt:3,
          width: '55%',  // 右側のテキスト領域を55%に設定
          height: `auto`,
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'flex-start', // コンテンツを上寄せにする
          overflow: 'auto'
        }}>
          
          <Grid container spacing={0} alignItems="center" sx={{}}>
              <Typography variant="body1" gutterBottom sx={{ fontWeight: 548 }}>
                {sellTitle}
              </Typography>
              <Typography variant="body1" gutterBottom sx={{pl:2, color: '#E97132', fontWeight: 'bold' }}>
                全巻
              </Typography>
          </Grid>
          <Typography variant="body1" gutterBottom sx={{pl:0.5, color: '#757575'}}>
            {numberOfBooks}巻
          </Typography>

          
            <Typography variant="subtitle1" component="div" gutterBottom sx={{pl:0.5, color: "#49AFFE"}}>
              相手の欲しい漫画リスト
            </Typography>
            
              {wishTitles && (
                <WishListDisplay wishTitles={wishTitles} />
              )}
            
          
        </CardContent>
      </Card>
    </Link>
  );
};
export default MangaListItem;
