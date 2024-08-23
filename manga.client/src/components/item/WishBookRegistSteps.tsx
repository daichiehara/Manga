import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
// 注意４番目はOwnedBookREgistStep.tsxで使う画像と同じ
const steps = [
  {
    stepNumber: 1,
    image: 'https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/wishStep1.webp', // 仮の画像のパス
    description: '出品したけど出来れば今読みたい漫画と交換してもらいたい',
  },
  {
    stepNumber: 2,
    image: 'https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/wishStep2.webp', // 仮の画像のパス
    description: '欲しい漫画を登録しよう！',
  },
  {
    stepNumber: 3,
    image: 'https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/wishStep3.webp', // 仮の画像のパス
    description: 'いくつでも登録できます！',
  },
  {
    stepNumber: 4,
    image: 'https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/ownedStep4.webp', // 仮の画像のパス
    description: 'あなたの出品したすべての漫画に表示されるようになります',
  }
];

const WishBookRegistSteps: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#0F9ED5', // 背景色
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mt: '16px',
        px: '0px',
        pt: '20px',
      }}
    >
      {steps.map((step, index) => (
        <Paper
          key={index}
          sx={{
            width: '80%',
            maxWidth: '400px',
            marginBottom: '20px',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // 左寄せ
            position: 'relative',
            boxShadow: 'none'
          }}
        >
          {/* 円形の番号 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0F9ED5', // アイコン背景色
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              color: '#fff',
              fontWeight: 'bold',
              position: 'absolute', // 絶対位置で番号を左上に配置
              top: '-15px',
              left: '-15px',
              border: '2px solid white', // 白いボーダーを追加
            }}
          >
            {step.stepNumber}
          </Box>

          {/* 画像と説明 */}
          <Box
            sx={{
              mt: 2,
              width: '100%',
              textAlign: 'center', // 画像とテキストを中央に配置
            }}
          >
            <img
              src={step.image}
              alt={`Step ${step.stepNumber}`}
              style={{ width: '100%', height: 'auto' }} // 自動調整される幅と高さ
            />
            <Typography sx={{ marginTop: 2, fontWeight: 'bold' }}>
              {step.description}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default WishBookRegistSteps;
