import { useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Paper, Button, Divider} from '@mui/material';
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
import RecentCommentsDisplay from '../components/item/RecentCommentsDisplay'; 
import { Reply } from '../components/item/RecentCommentsDisplay'; // Reply インターフェイスのインポート
import { useSnackbar } from '../hooks/useSnackbar';
import ExchangeRequestModal from '../components/common/ExchangeRequestModal';
import axios from 'axios';

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

interface MangaDetail {
    title: string;
    numberOfBooks: number;
    bookState: string;
    sellTime: string;
    imageUrls: string[];
    profileIcon: string;
    userName: string;
    sellMessage: string;
    wishTitles: { title: string; isOwned: boolean }[];
    sendPrefecture: string;
    sendDay: string;
    hasIdVerificationImage: boolean;
    replies: Reply[]; 
    requestButtonStatus :number;
}  

const MangaDetail = () => {
  const { sellId } = useParams();
  const [mangaDetail, setMangaDetail] = useState<MangaDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  useSnackbar();

  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleExchangeRequest = () => {
    // Implementation of the exchange request logic
    setDrawerOpen(!drawerOpen);
  };  

  const handleCancelRequest = () => {
    // Implementation of the cancel request logic
  }; 
  

  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7103/api/Sells/${sellId}`, {
        withCredentials: true  // クロスオリジンリクエストにクッキーを含める
      });
        setMangaDetail(response.data);
      } catch (error) {
        setError('漫画の詳細の読み込みに失敗しました。');
        console.error('漫画の詳細情報の取得に失敗:', error);
      }
    };

    fetchMangaDetails();
  }, [sellId]);

  // Handle errors by rendering the ErrorDisplay component
  if (error) {
    return <ErrorDisplay message={error} />;
  }

  // Handle the loading state
  if (!mangaDetail) {
    return <LoadingComponent />;
  }

  const renderActionButton = () => {
    switch(mangaDetail.requestButtonStatus) {
      case 1:
        return <ActionButton label="交換を希望する" onClick={handleExchangeRequest} />;
      case 2:
        return <Button variant="contained" disabled>交換済み</Button>;
      case 3:
        return <Button variant="contained" color="error" onClick={handleCancelRequest}>交換申請をキャンセルする</Button>;
      case 4:
        return <Button variant="contained" disabled>自分の出品</Button>;
      default:
        return null;
    }
  };

  return  (
    <Box sx={{ p: 0, margin:0 }}>
      {/* 戻るボタン */}
      {!drawerOpen && <BackButton handleBack={handleBack} />}
      <Box sx={{ flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: 10 }}>
        
            {/* Image Carousel Integration */}
            <ImageCarousel 
              imageUrls={mangaDetail.imageUrls} 
              title={mangaDetail.title}
              onImageClick={handleImageClick}
            />
            <ImageModal
              isOpen={isModalOpen}
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
            />

            <Paper elevation={0} sx={{ pt: 0.5, pb: 1, pl: 2.0, pr: 2.0, border: 'none' }}>
              
              <Typography variant="body1" sx={{pt:2, color: '#757575', fontWeight:'bold'}}>
                この人が欲しい漫画
              </Typography>
              <Box sx={{pb:1.3}}><Divider sx={{pt:1.3}}/></Box>
              {mangaDetail && (
                <WishListDisplay wishTitles={mangaDetail.wishTitles} shouldTruncate={false}/>
              )}
              <Typography variant="body1" sx={{pt:4, color: '#757575', fontWeight:'bold'}}>
                {`出品物の説明`}
              </Typography>
              <Box sx={{pb:1.3}}><Divider sx={{pt:1.3}}/></Box>
              <Typography variant="body1" sx={{ }}>
                {mangaDetail.sellMessage}
              </Typography>
              
              <Grid container spacing={0.5} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{pt:4, color: '#757575', fontWeight:'bold' }}>
                    {`出品物の情報`}
                  </Typography>
                  <Box sx={{pb:1.3}}><Divider sx={{pt:1.3}}/></Box>
                </Grid>
              </Grid>
              <ShippingInfo sendPrefecture={mangaDetail.sendPrefecture} sendDay={mangaDetail.sendDay} />
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

              {/* Add the Recent Comments section */}
              <Typography variant="body1" sx={{pt:4, color: '#757575', fontWeight:'bold' }}>
                {`コメント`}
              </Typography>
              <Box sx={{pb:1.3}}><Divider sx={{pt:1.3}}/></Box>
              {mangaDetail.replies && <RecentCommentsDisplay replies={mangaDetail.replies} />}

              <Box sx={{pb:5}}></Box>
            </Paper>
          </Grid>
        
      </Box>
      <Box sx={{py:2, position: 'fixed', bottom: 0,right: 0, display: 'flex', justifyContent: 'center', background: 'white', boxShadow: '0px 8px 12px 10px rgba(0, 0, 0, 0.25)' , maxWidth: '640px',width: '100%', left: '50%',transform: 'translateX(-50%)', }}>
        {renderActionButton()}
      </Box>
      <ExchangeRequestModal isOpen={drawerOpen} onClose={handleExchangeRequest} />
    </Box>
  );
};

export default MangaDetail;
