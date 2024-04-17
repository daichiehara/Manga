import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperClass from 'swiper';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Typography from '@mui/material/Typography';

interface ImageCarouselProps {
    imageUrls: string[];
    title: string;
    onImageClick: (index: number) => void;
    
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ imageUrls, title, onImageClick }) => {
  const swiperRef = useRef<SwiperClass | null>(null); // null 初期化を追加
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (swiper: SwiperClass) => {
      setCurrentSlide(swiper.realIndex);
  };

  // Swiper インスタンスを ref に割り当てる正しい方法
  const handleSwiper = (swiper: SwiperClass) => {
      swiperRef.current = swiper;
  };

    return (
      <div style={{ display: 'flex', justifyContent: 'center',  padding: 0, margin:0, marginBottom: 0, overflow: 'hidden', backgroundColor:`#F2F2F2`,position:`relative`}}>
        {/* カスタムナビゲーションボタン */}
        <IconButton
          sx={{
            position: 'absolute',
            top: '50%',  // 画像の縦の中央
            left: 0,  // 左端
            zIndex: 1000,
            transform: 'translateY(-50%)',  // Y軸に沿って完全に中央へ移動
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeftIcon sx={{ color: 'white', fontSize: '2rem' }} />
        </IconButton>
        <IconButton
          sx={{
            position: 'absolute',
            top: '50%',  // 画像の縦の中央
            right: 0,  // 左端
            zIndex: 1000,
            transform: 'translateY(-50%)',  // Y軸に沿って完全に中央へ移動
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRightIcon sx={{ color: 'white', fontSize: '2rem' }}/>
        </IconButton>
        <Swiper
            spaceBetween={10}
            slidesPerView={1}
            onSlideChange={handleSlideChange}
            onSwiper={(swiper) => {swiperRef.current = swiper;}}
        >
            {imageUrls.map((url, index) => (
            <SwiperSlide key={index}style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }} onClick={() => onImageClick(index)}>
                <img src={url} alt={`${title} Volume ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', height: '30rem', objectFit: 'contain', background: '#f5f5f5'}} />
                
            </SwiperSlide>
            ))}
        </Swiper>
        {/* 現在のスライドインデックスを表示 */}
        <Typography 
          variant="subtitle1" 
          align="center" 
          sx={{
            display: 'flex', 
            position: 'absolute', 
            zIndex: 1000, 
            justifyContent: 'center', 
            alignItems: 'center', 
            top: '98%',  // 親コンテナの下端に配置
            left: '50%',
            transform: 'translate(-50%, -100%)', // X軸では中央、Y軸では完全に下端に合わせる
            color: 'white',
            background: 'rgba(0, 0, 0, 0.4)', 
            borderRadius: '4px', // 角を丸くする
            py: 0.3, // 縦方向の余白
            px: 1, // 横方向の余白
          }}
        >
          {`${currentSlide + 1} / ${imageUrls.length}`}
        </Typography>
    </div>
    );
};

export default ImageCarousel;
