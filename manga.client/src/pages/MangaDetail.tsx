import { useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Paper} from '@mui/material';
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
    wishTitles: { title: string }[];
    sendPrefecture: string;
    sendDay: string;
    hasIdVerificationImage: boolean;
    replies: Reply[]; 
  }  

const MangaDetail = () => {
  const { sellId } = useParams();
  const [mangaDetail, setMangaDetail] = useState<MangaDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };
  console.log(sellId);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleExchangeRequest = () => {
    // Implementation of the exchange request logic
  };  

  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5227/api/Sells/${sellId}`);
        const data = await response.json();
        setMangaDetail(data);
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

  return (
    <Box sx={{ p: 0, margin:0 }}>
      {/* 戻るボタン */}
      <BackButton handleBack={handleBack} />
      <Box sx={{ flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: 10 }}>
        <Grid container spacing={0} style={{ padding: 0, margin:0, marginBottom: 0}}>
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
              <Typography variant="body1" gutterBottom sx={{pt:1.5, pb:1, color: '#757575', fontWeight:'bold', borderTop: '2px solid #D9D9D9'}}>
                この人が欲しい漫画
              </Typography>
              {mangaDetail && (
                <WishListDisplay wishTitles={mangaDetail.wishTitles} />
              )}

              <Typography variant="body1" gutterBottom sx={{mt:1, pt:1.5, color: '#757575', fontWeight:'bold', borderTop: '2px solid #D9D9D9'}}>
                {`出品物の説明`}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {mangaDetail.sellMessage}
              </Typography>
              
              <Grid container spacing={0.5} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom sx={{pt:5, pb:1, color: '#757575', fontWeight:'bold',  borderBottom: '2px solid #D9D9D9' }}>
                    {`出品物の情報`}
                  </Typography>
                </Grid>
              </Grid>
              <ShippingInfo sendPrefecture={mangaDetail.sendPrefecture} sendDay={mangaDetail.sendDay} />
              <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom sx={{mb:3, pt:5, pb:1, color: '#757575', fontWeight:'bold',  borderBottom: '2px solid #D9D9D9' }}>
                    {`出品者`}
                  </Typography>
                </Grid>
              <SellerInfo 
                profileIcon={mangaDetail.profileIcon} 
                userName={mangaDetail.userName} 
                hasIdVerificationImage={mangaDetail.hasIdVerificationImage} 
              />

              {/* Add the Recent Comments section */}
              {mangaDetail.replies && <RecentCommentsDisplay replies={mangaDetail.replies} />}

            </Paper>
          </Grid>
        </Grid>
      </Box>
      <ActionButton label="交換を希望する" onClick={handleExchangeRequest} />
    </Box>
  );
};

export default MangaDetail;
