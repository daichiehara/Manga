import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';  // Autoplayを追加
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // useNavigateのインポート

// Swiper CSS
import 'swiper/css';  // 基本のCSS
import 'swiper/css/pagination';  // ページネーション用のCSS

interface ImageSliderProps {
  images: { url: string, path: string }[]; // 画像URLとアプリ内のパスのリスト
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const navigate = useNavigate(); // useNavigateフックの利用

  const handleImageClick = (path: string) => {
    navigate(path); // クリックした画像に対応するアプリ内のパスに遷移
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
      <Swiper
        modules={[Pagination, Autoplay]}  // Autoplayモジュールを追加
        spaceBetween={10}
        slidesPerView={1} // 一度に表示するスライド数
        pagination={{ clickable: true }} // ページネーションの有効化
        loop={true} // ループ動作
        autoplay={{ delay: 6000, disableOnInteraction: false }} // 6秒ごとに自動スライド
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            {/* 画像の角を丸くし、クリックでnavigate */}
            <img 
              src={image.url} 
              alt={`slide-${index}`} 
              style={{ width: '100%', borderRadius: '15px', cursor: 'pointer' }} 
              onClick={() => handleImageClick(image.path)} // クリックでアプリ内のページに遷移
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default ImageSlider;
