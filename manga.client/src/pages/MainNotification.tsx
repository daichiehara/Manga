import React from 'react';
import { Box, Typography, Toolbar, Grid, Card, CardActionArea, CardContent, CardMedia} from '@mui/material';
import MenuBar from '../components/menu/MenuBar';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Notification {
  id: string;
  mangaTitle: string;
  wishesCount?: number; // 交換希望の件数はオプショナルにする
  imageUrl: string;
  productPageUrl: string;
  createdAt: string;
  commenterName?: string; // コメントしたユーザーの名前
  commentType?: 'comment'; // この通知がコメントに関するものであることを示す
}


const notifications : Notification[] = [
  {
  // 交換希望に関する通知
    id: '1',
    mangaTitle: 'ドラえもん全巻',
    wishesCount: 5,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSrA7qmMVEVQN1P1GITkrtGL6zsJt9WBkFOQ4dDTPapeNIHV1DrHwtEc3eRP9pPwk1dQ16f-O5_x53wERcpROQj6VwRyMrwNWWf3uzzJMC4',
    productPageUrl: '/product/1',
    createdAt: '2024-04-08T14:13:00Z', // ISO 8601形式の日時
  },
  // コメントに関する通知
  {
    id: '2',
    mangaTitle: 'ワンピース全巻',
    imageUrl: 'https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0204/users/31b130205d0d01653580bf1eaceada876de040d3/i-img1200x1200-1619319014kj0df7128921.jpg',
    productPageUrl: '/product/2',
    createdAt: '2024-01-06T15:30:00Z',
    commenterName: '太郎',
    commentType: 'comment',
  },
  // 交換希望に関する通知
  {
    id: '3',
    mangaTitle: 'ワンピース全巻',
    wishesCount: 2,
    imageUrl: 'https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0204/users/31b130205d0d01653580bf1eaceada876de040d3/i-img1200x1200-1619319014kj0df7128921.jpg',
    productPageUrl: '/product/2',
    createdAt: '2024-01-05T14:20:00Z', // ISO 8601形式の日時
  },
  // 交換希望に関する通知
  {
    id: '4',
    mangaTitle: 'ナルト全巻',
    wishesCount: 8,
    imageUrl: 'https://static.mercdn.net/item/detail/orig/photos/m51136006711_1.jpg?1662523485',
    productPageUrl: '/product/3',
    createdAt: '2024-04-05T14:20:00Z', // ISO 8601形式の日時
  },
  // 他の通知データ...
];

function timeSince(date: string): string  {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + "年前";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "ヶ月前";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "日前";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "時間前";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "分前";
  }
  return Math.floor(seconds) + "秒前";  
}


const MainNotification: React.FC = () => {
  return (
    <>
      {/* メインコンテンツエリア */}
      {/* 見出し */}
      <Toolbar sx={{
          justifyContent: 'center', // Toolbar内の要素を中央揃えに
          boxShadow: '0px 8px 8px -1px rgba(0,0,0,0.2)',
          background: '#F2F2F2', // グラデーションの背景色
          mb:0.5
      }}>
          <Typography variant="h5" color="#757575" sx={{ 
            flexGrow: 1, 
            textAlign: 'center',
            fontWeight: '600',
            }}>
            お知らせ
          </Typography>
      </Toolbar>
      
      {/* 通知カードのリスト */}
      <Box >
        <Grid container spacing={0.5}>
          {notifications.map((notification) => (
            <Grid item xs={12} key={notification.id}>
              <Card>
                <CardActionArea onClick={() => window.location.href = notification.productPageUrl}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 88, height: 70, margin: 2, borderRadius: '10px' }}
                      image={notification.imageUrl}
                    />
                    <CardContent sx={{ flexGrow: 1}}>
                      {/* 交換希望とコメントの通知を区別して表示 */}
                      {notification.commentType === 'comment' ? (
                       <Typography variant="body2" sx={{ fontWeight: '570'}}>
                        {notification.commenterName}さんが{notification.mangaTitle}にコメントしました。
                       </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: '570'}}>
                        あなたの{notification.mangaTitle}に{notification.wishesCount}件の交換希望があります。
                      </Typography>
                    )}
                      <Typography variant="body2" color="text.secondary"sx={{fontSize: 12, mt:0.5}}>
                        {timeSince(notification.createdAt)}
                      </Typography>
                    </CardContent>
                    <ArrowForwardIosIcon sx={{ marginRight: 2, fontSize: '24px', color: '#707070'}} />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          
        </Grid>
      </Box>

      <MenuBar /> {/* 画像のボトムのナビゲーションバーに対応するコンポーネント */}
    </>
  );
};


export default MainNotification;
