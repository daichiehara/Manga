import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomToolbar from '../components/common/CustumToolbar';
import LoadingComponent from '../components/common/LoadingComponent';
import { Helmet, HelmetProvider } from 'react-helmet-async';


interface SellDraftDto {
  sellId: number;
  title: string | null;
  imageUrl: string | null;
}

const DraftList: React.FC = () => {
  const [drafts, setDrafts] = useState<SellDraftDto[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<SellDraftDto[]>('https://localhost:7103/api/Sells/Drafts', {
        withCredentials: true
      });
      setDrafts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching drafts:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const description = `[トカエル]このページでは、下書きとして保存された出品を管理できます。`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>下書きリスト</title>
        <meta name="description" content={description} />
        <meta property="og:title" content="下書きリスト" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="下書きリスト" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
      </Helmet>
      <CustomToolbar title='下書き一覧' />
      {loading && <LoadingComponent />}
      <Box sx={{pt: { xs: '3.5rem', sm: '4rem' }}}>
        {drafts.length === 0 ? (
            <Typography>下書きはありません。</Typography>
        ) : (
          <Grid container>
          {drafts.map((draft, index) => (
            <Grid item xs={12} key={draft.sellId} style={{ 
              borderBottom: index !== drafts.length - 1 ? '1px solid #e0e0e0' : '' 
            }}>
              <Card elevation={0} sx={{ display: 'flex', alignItems: 'center' }}>
                <CardActionArea onClick={() => navigate(`/sell/${draft.sellId}`)}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      sx={{
                        width: 70,    // 幅を70pxに設定
                        height: 70,   // 高さを70pxに設定
                        margin: 2,
                        borderRadius: '5px',
                        objectFit: 'cover',  // 画像が枠内に収まるように調整
                      }}
                      image={draft.imageUrl ?? 'https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/NoImage.webp'}
                      alt={draft.title ?? '-'}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" sx={{fontWeight: 580}}>
                      {draft.title ?? '-'}
                      </Typography>
                    </CardContent>
                    <ArrowForwardIosIcon color='secondary' sx={{ mr: 2, ml: 'auto', fontSize: '24px',}} />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        )}
      </Box>
    </HelmetProvider>
  );
};

export default DraftList;