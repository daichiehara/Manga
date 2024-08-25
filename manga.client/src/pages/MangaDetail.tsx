import { useEffect, useState, useContext} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, CircularProgress, Alert, Typography, Paper, Button, IconButton, Divider, Drawer} from '@mui/material';
import 'swiper/swiper-bundle.css'; 
import ImageCarousel from '../components/common/ImageCarousel';
import BackButton from '../components/common/BackButton';
import MangaDetailInfo from '../components/item/MangaDetailInfo';
import WishListDisplay from '../components/item/WishListDisplay';
import ShippingInfo from '../components/item/ShippingInfo';
import ActionButton from '../components/common/ActionButton';
import LoadingComponent from '../components/common/LoadingComponent';
import ErrorDisplay from '../components/common/ErrorDisplay';
import SellerInfo from '../components/common/SellerInfo';
import ImageModal from '../components/common/ImageModal';
import MyBookModal from '../components/common/MyBookModal';
import RecentCommentsDisplay from '../components/comment/RecentCommentsDisplay';
import { useSnackbar } from '../hooks/useSnackbar';
import ExchangeRequestModal from '../components/common/ExchangeRequestModal';
import axios from 'axios';
import { SnackbarContext } from '../components/context/SnackbarContext';
import CloseIcon from '@mui/icons-material/Close';
import CustomToolbar from '../components/common/CustumToolbar';
import theme from '../theme/theme';


/**
 * MangaDetail コンポーネント
 * 
 * 漫画の詳細情報を表示するコンポーネント。
 * URLパラメータから漫画の出品IDを取得し、サーバーからその出品IDに対応する漫画の詳細情報を取得する。
 * 取得した詳細情報をMaterial-UIコンポーネントを使って表示する。
 * 
 * Props:
 *  None
 */
enum SellStatus {
  Recruiting = 1,
  Suspended = 2,
  Establish = 3,
  Draft = 4,
}
interface MangaDetail {
    title: string;
    numberOfBooks: number;
    bookState: string;
    sellTime: string;
    imageUrls: string[];
    profileIcon: string;
    userName: string;
    sellMessage: string;
    sellStatus: SellStatus;
    wishTitles: { title: string; isOwned: boolean }[];
    sendPrefecture: string;
    sendDay: string;
    hasIdVerificationImage: boolean;
    requestButtonStatus :number;
    replies: Reply[]; 
    replyCount:number;
    isLiked:boolean;
    likeCount:number;
}  

interface Reply {
  replyId: number;
  message: string;
  created: string;
  nickName: string;
  profileIcon: string | null;
}


const MangaDetail: React.FC = () => {
  const { sellId } = useParams();
  const [mangaDetail, setMangaDetail] = useState<MangaDetail | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cancelDrawerOpen, setCancelDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [isCancelDrawerOpen, setIsCancelDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 送信中状態を管理
  const { showSnackbar } = useContext(SnackbarContext);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isMyBookModalOpen, setIsMyBookModalOpen] = useState(false);
  const location = useLocation();
  const openWishlistDrawer = location.state?.openWishlistDrawer;
  useSnackbar();

  useEffect(() => {
    if (openWishlistDrawer) {
      //遅延を追加
      const timer = setTimeout(() => {
        setIsMyBookModalOpen(true);
      }, 1000);
  
      // クリーンアップ関数
      return () => clearTimeout(timer);
    }
  }, [openWishlistDrawer]);

  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
  };

  const handleExchangeRequest = () => {
    // Implementation of the exchange request logic
    setDrawerOpen(!drawerOpen);
  };  

  const handleCancelRequest = () => {
    // Implementation of the cancel request logic
    setCancelDrawerOpen(!cancelDrawerOpen);
  }; 

  const [error, setError] = useState<string | null>(null); 

  const handlCancelClickSuccess = () => {
    showSnackbar('交換申請がキャンセルされました', 'success');
  };

  const handleCommentNavigate = () => {
    navigate(`/item/${sellId}/comment`);
  }

  const fetchMangaDetails = async () => {
    try {
      console.log('fetch: api Details');
      const response = await axios.get(`https://localhost:7103/api/Sells/${sellId}`, {
        withCredentials: true
      });
      setMangaDetail(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setError('該当する漫画は削除されています');
      } else {
        setError('漫画の詳細の読み込みに失敗しました。');
      }
      console.error('漫画の詳細情報の取得に失敗:', error);
    }
  };
  

  useEffect(() => {
    fetchMangaDetails();
  }, [sellId]);


  const withdrawRequests = async () => {
    setIsSubmitting(true);
    try {
        await axios.put(`https://localhost:7103/api/Requests/withdrawRequests/${sellId}`, null, {
            withCredentials: true  // クロスオリジンリクエストにクッキーを含める
        });
        // 必要に応じて他の状態を更新
    } catch (error) {
        showSnackbar("交換申請の取り消しに失敗しました", 'error'); // 失敗メッセージをセット
        console.error('交換申請の取り消しに失敗:', error);
      } finally {
        const response = await axios.get(`https://localhost:7103/api/Sells/${sellId}`, {
          withCredentials: true  // クロスオリジンリクエストにクッキーを含める
      }); // sell情報を再読み込み
        setMangaDetail(response.data); // データの再取得
        setCancelDrawerOpen(false); // ドロワー下げる。
        showSnackbar("交換申請が取り消されました", 'success'); // 成功メッセージをセット
        setIsSubmitting(false);
    }
  };


  // Handle errors by rendering the ErrorDisplay component
  if (error) {
    return <><CustomToolbar title='詳細ページ'/><ErrorDisplay message={error} /></>;
  }

  // タグの描画関数
  const renderStatusTag = () => {
    if (!mangaDetail) return null;

    let tagText = '';
    let bgColor = '';

    switch (mangaDetail.sellStatus) {
      case SellStatus.Suspended:
        tagText = '公開停止中';
        bgColor = 'rgba(125, 125, 125, 0.9)';  // 灰色
        break;
      case SellStatus.Establish:
        tagText = '交換成立';
        bgColor = 'rgba(255, 9, 0, 0.9)';  // 赤色
        break;
      case SellStatus.Draft:
        tagText = '下書き';
        bgColor = 'rgba(125, 125, 125, 0.9)';  // 灰色
        break;
      default:
        return null;
    }

    return (
      <Box 
        sx={{
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '150px', 
          height: '150px',
          backgroundColor: bgColor,  
          color: 'white', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',  // 左上の直角三角形
          zIndex: 100  
        }}
      >
        <Typography
          sx={{
            transform: 'rotate(-45deg)',  
            position: 'relative',
            top: '-15px',  
            left: '-15px',  
            fontWeight: 'bold',
            fontSize: '1.3rem',
          }}
        >
          {tagText}
        </Typography>
      </Box>
    );
  };

  // Handle the loading state
  if (!mangaDetail) {
    return <LoadingComponent />;
  }

  const renderActionButton = () => {
    switch(mangaDetail.requestButtonStatus) {
      case 1:
        return <ActionButton label="交換を希望する" onClick={handleExchangeRequest} />;
      case 2:
        return <Button variant="contained" disabled
                  sx={{ mx: 2, maxWidth: '640px', width: '100%', background: '#D83022',
                  boxShadow: 'none',
                  color: '#f5f5f5',
                  fontWeight:'bold'
                  }}
              >
                  交換成立
              </Button>
      case 3:
        return <Button variant="contained" color='error' onClick={handleCancelRequest}
                  sx={{ mx: 2, maxWidth: '640px', width: '100%', background: '#D83022',
                  boxShadow: 'none',
                  fontWeight:'bold'
                  }}
              >
                  交換申請をキャンセルする
              </Button>
      case 4:
        return <Button variant="outlined"
                  sx={{ mx: 2, maxWidth: '640px', width: '100%',
                  boxShadow: 'none',
                  
                  fontWeight:'bold'
                  }}
                  onClick={() => navigate(`/sell/${sellId}`)}
              >
                  出品を編集する
              </Button>
      default:
        return null
    }
  };

  const showMessage = (message: string | null, severity: 'success' | 'error') => {
    setMessage(message);
    setSeverity(severity);
    setTimeout(() => {
        setMessage(null);
    }, 8000); // 3秒後にメッセージを消す
};

  return  (
    <>
      <Box sx={{ p: 0, margin:0 }}>
        {/* 戻るボタン */}      
        <BackButton handleBack={handleBack} />
        
        <Box sx={{ flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: 10 }}>
          
              {/* Image Carousel Integration */}
              <Box sx={{ position: 'relative' }}>
                {/* Image Carousel Integration */}
                <ImageCarousel 
                  imageUrls={mangaDetail.imageUrls} 
                  title={mangaDetail.title}
                  onImageClick={handleImageClick}
                />
                {/* タグを画像の上に表示 */}
                {renderStatusTag()}
              </Box>
              <ImageModal
                isOpen={isImageModalOpen}
                images={mangaDetail.imageUrls}
                currentIndex={currentImageIndex}
                onClose={handleCloseModal}
              />

            <Grid item xs={12} md={6}style={{ padding: 0, margin:0 }}>
            
              <MangaDetailInfo
                title={mangaDetail.title}
                numberOfBooks={mangaDetail.numberOfBooks}
                bookState={mangaDetail.bookState}
                sellTime={mangaDetail.sellTime}
                replyCount={mangaDetail.replyCount}
                isLiked={mangaDetail.isLiked}
                likeCount={mangaDetail.likeCount}
              />

              <Paper elevation={0} sx={{ pt: 3, pb: 1, pl: 2.0, pr: 2.0, border: 'none' }}>
                <Typography variant="h6" component="span" sx={{pt:2, color: "#0F9ED5", fontWeight:`bold`, fontStyle:'italic' }}>
                  want<Box component="span" sx={{ color: 'orange' }}>!!</Box><Box component="span" sx={{pl:1.0, color: '#757575', fontSize:'16px', fontWeight:'bold', fontStyle:'normal'}}>この人が欲しい漫画</Box>
                </Typography>
                <Box sx={{pb:1.3}}><Divider sx={{pt:1.3}}/></Box>
                {mangaDetail.wishTitles.length > 0 ? (
                  <WishListDisplay wishTitles={mangaDetail.wishTitles} shouldTruncate={false}/>
                ):(
                  <Typography variant='subtitle2' sx={{color:theme.palette.text.secondary}}>欲しい漫画が設定されていせん</Typography>
                )
                }

                {/* 出品物の説明 */}
                <Typography variant="body1" sx={{pt:4, color: '#757575', fontWeight:'bold'}}>
                  {`出品物の説明`}
                </Typography>
                <Box sx={{pb:1.3}}><Divider sx={{pt:1.3}}/></Box>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line'}}>
                  {mangaDetail.sellMessage}
                </Typography>
                
                {/* 出品物の情報 */}
                <Grid container spacing={0.5} alignItems="center">
                  <Grid item xs={12}>
                    <Typography variant="body1" sx={{pt:4, color: '#757575', fontWeight:'bold' }}>
                      {`出品物の情報`}
                    </Typography>
                    <Box sx={{pb:1.3}}><Divider sx={{pt:1.3}}/></Box>
                  </Grid>
                </Grid>
                <ShippingInfo sendPrefecture={mangaDetail.sendPrefecture} sendDay={mangaDetail.sendDay} sellTime={mangaDetail.sellTime} />
                
                {/* 出品者アバター */}
                <Grid item xs={12}>
                    <Typography variant="body1" sx={{ pt:4, color: '#757575', fontWeight:'bold',  }}>
                      {`出品者`}
                    </Typography>
                    <Box sx={{pb:1.3}}><Divider sx={{pt:1.3}}/></Box>
                  </Grid>
                <SellerInfo 
                  profileIcon={mangaDetail.profileIcon} 
                  userName={mangaDetail.userName} 
                  hasIdVerificationImage={mangaDetail.hasIdVerificationImage} 
                />

                {/* 最新コメント表示 */}
                <Typography variant="body1" sx={{pt:4, color: '#757575', fontWeight:'bold' }}>
                  コメント({mangaDetail.replyCount})
                </Typography>
                
                <Box sx={{pb:1.3}}><Divider sx={{pt:1.3}}/></Box>
                
                    <RecentCommentsDisplay replies={mangaDetail.replies} />
                
                  <Box sx={{py:2, position: 'relative', bottom: 0,right: 0, display: 'flex', justifyContent: 'center',  boxShadow: 'none' , maxWidth: '640px',width: '100%', left: '50%',transform: 'translateX(-50%)', }}>
                    <Button variant="outlined" 
                      onClick={handleCommentNavigate}
                      sx={{ maxWidth: '640px', width: '100%', 
                      boxShadow: 'none',
                      color: 'red',
                      borderColor:'red',
                      fontWeight:'bold',
                      borderWidth:'1.2px'                   
                      }}
                    >
                      コメントする
                    </Button>
                  </Box>
              

                <Box sx={{pb:5}}></Box>
              </Paper>
            </Grid>
          
        </Box>
        <Box sx={{py:2, position: 'fixed', bottom: 0,right: 0, display: 'flex', justifyContent: 'center', background: 'white', boxShadow: 'none' , maxWidth: '640px',width: '100%', left: '50%',transform: 'translateX(-50%)', }}>
          {renderActionButton()}
        </Box>
        <ExchangeRequestModal isOpen={drawerOpen} onClose={handleExchangeRequest} setMessage={showMessage} wishTitles={mangaDetail.wishTitles} onExchangeRequest={fetchMangaDetails} />
        {message && (
            <Alert severity={severity} sx={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '600px', zIndex: 9999 }}>
                {message}
            </Alert>
        )} 
        <Drawer
          anchor='bottom'
          open={cancelDrawerOpen}
          onClose={() => {
            setCancelDrawerOpen(false);
          }}
          ModalProps={{
            keepMounted: true,  // Keep the component mounted after it's been displayed once
            BackdropProps: {
              invisible: true
            }
          }}
          sx={{
            '& .MuiDrawer-paper': {
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              height: '30vh',
              width: '100vw', // 画面の幅にフルで広げる
              maxWidth: '640px',  // 最大幅を640pxに設定
              mx: 'auto',
              zIndex: 30000,
              display: 'flex', // Flexboxレイアウトを使用
              alignItems: 'center', // 垂直方向の中央に配置
              justifyContent: 'center', // 水平方向の中央に配置
            }
          }}
        >
          <IconButton 
            onClick={() => setCancelDrawerOpen(false)} 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              left: 8 
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography sx={{px:2, pt:3, pb: 1.5, color: '#454545', fontSize: '0.9rem', fontWeight:'bold' }}>
            この漫画への交換申請がキャンセルされます
          </Typography>
          <Typography sx={{px:2, pb: 5, color: '#454545', fontSize: '0.9rem' }}>
            ※ キャンセル後も、この出品に交換申請することができます
          </Typography>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', boxShadow: 'none' }}>
            <Button variant="contained" color='error' onClick={withdrawRequests}
                sx={{ mx: 2, maxWidth: '640px', width: '100%', background: '#D83022',
                boxShadow: 'none',
                fontWeight:'bold'
                }}
            >
                {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '交換申請をキャンセルする'}
            </Button>
          </Box>
        </Drawer>
      </Box>
      <MyBookModal 
        isOpen={isMyBookModalOpen}
        onClose={() => setIsMyBookModalOpen(false)}
        openWishlistTab={openWishlistDrawer}
      />
    </>
  );
};

export default MangaDetail;
