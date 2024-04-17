import CustomToolbar from '../components/common/CustumToolbar';
import BackButton from '../components/common/BackButton';
import {  useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, CardMedia} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';


interface MpMySell {
  sellId: number;
  message: string;
  sellImage: string;
  sellTime: string
  type:number
  title: string; 
  sellStatus: number
}

function timeSince(date: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval >= 1) {
    return Math.floor(interval) + "年前";
  }
  interval = seconds / 2592000;
  if (interval >= 1) {
    return Math.floor(interval) + "ヶ月前";
  }
  interval = seconds / 86400;
  if (interval >= 1) {
    return Math.floor(interval) + "日前";
  }
  interval = seconds / 3600;
  if (interval >= 1) {
    return Math.floor(interval) + "時間前";
  }
  interval = seconds / 60;
  if (interval >= 1) {
    return Math.floor(interval) + "分前";
  }
  return Math.floor(seconds) + "秒前";
}

{/* ステータスに基づいてテキストを決定する */}
interface StatusStyle {
  text: string;
  color: string;
}
function getStatusStyle(sellStatus: number): StatusStyle {
  switch (sellStatus) {
    case 1:
      return { text: "公開中", color: "#4EA72E" };
    case 2:
      return { text: "公開停止中", color: "red" };
    case 3:
      return { text: "match!!", color: "gray" };
    default:
      return { text: "", color: "inherit" }; // 不明なステータスの場合はデフォルト色
  }
}



const MpMySell: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };
  const [mpmysell, setmpmysell] = useState<MpMySell[]>([]);
  const { authState } = useContext(AuthContext); // 認証状態にアクセス


  useEffect(() => {
    if (!authState.isAuthenticated) return; // ログインしていない場合はAPIコールをスキップ
    // APIから通知データを取得する関数
    const fetchsetmpmysell = async () => {
      try {
        const response = await axios.get('https://localhost:7103/api/Sells/MySell',{
          withCredentials: true  // クロスオリジンリクエストにクッキーを含める
        });
        // 取得したデータで状態を更新
        setmpmysell(response.data);
      } catch (error) {
        console.error('通知データの取得に失敗:', error);
      }
    };
    fetchsetmpmysell();
  }, [authState.isAuthenticated]); // isAuthenticatedに依存しているため、この値が変わるとエフェクトが再実行されます


  //通知がない場合の表示
  if (mpmysell.length === 0) {
    return (
      <>
        {/* 見出しのToolbar */}
        <CustomToolbar title='出品した漫画'/>
        {/* 戻るボタン */}
        <BackButton handleBack={handleBack} />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 9 }}>
          <NotificationsNoneIcon sx={{ fontSize: 60, color: 'action.active', padding:9}} />  {/* アイコンのサイズと色、下のマージンを調整 */}
          <Typography variant="subtitle1">
            出品した漫画はありません
          </Typography>
        </Box>
      </>
    );
  }


  return (
    <>
      {/* CustomToolbarはそのままにする */}
      <CustomToolbar title='出品した漫画' />
      {/* 戻るボタン */}
      <BackButton handleBack={handleBack} />
      {/* 通知カードのリスト */}
      <Box sx={{mt: 8, mb: 8}}>
      <Grid container spacing={0.5}>
        {mpmysell.map((item, index) => (
        <Grid item xs={12} key={item.sellId} style={{ 
          borderBottom: index !== mpmysell.length - 1 ? '1px solid #e0e0e0' : '' 
          }}>
            <Card elevation={0} sx={{ display: 'flex', alignItems: 'center'}}>
              <CardActionArea onClick={() => navigate(`/products/${item.sellId}`)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  sx={{
                    width: 70,    // 幅を70pxに設定
                    height: 70,   // 高さを70pxに設定
                    margin: 2,
                    borderRadius: '10px',
                    objectFit: 'cover'  // 画像が枠内に収まるように調整
                  }}
                  image={item.sellImage}
                  />
                  <CardContent sx={{ flexGrow: 1, '&:last-child': { paddingBottom: '8px' }, padding: '4px' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: '580'}}>
                    {item.message}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mt: 0.5 }}>
                    {timeSince(item.sellTime)}
                  </Typography>
                 {/* ステータステキストと色の適用 */}
                 <Typography variant="body2" style={{ color: getStatusStyle(item.sellStatus).color, fontWeight: '590'}}>
                   {getStatusStyle(item.sellStatus).text}
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

    </>
  );
};

export default MpMySell;