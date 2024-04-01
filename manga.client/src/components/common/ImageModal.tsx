import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperClass from 'swiper';

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
}


const ImageModal: React.FC<ImageModalProps> = ({ isOpen, images, currentIndex, onClose }) => {
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);

  const handleSlideChange = (swiper: SwiperClass) => {
    // 更新する場合はここでcurrentIndexを更新するロジックを実装
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box sx={{ width: '100%', height: '100%', position: 'relative', backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1000}}
          onClick={onClose}
        >
          <CloseIcon sx={{ color: 'white' }} />
        </IconButton>

        <Swiper
          initialSlide={currentIndex}
          onSwiper={setSwiperRef}
          onSlideChange={handleSlideChange}
          style={{ width: '100%', height: '100%' }}
          zoom={true}
        >
          {images.map((url, index) => (
            <SwiperSlide key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="swiper-zoom-container">
                <img src={url} alt={`Image ${index}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Modal>
  );
};

export default ImageModal;
