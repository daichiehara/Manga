import React from 'react';
import { Box, Button, Typography, useTheme, useMediaQuery, Grid } from '@mui/material';
import CustomToolbar from '../components/common/CustumToolbar';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { VerifiedUser, CameraAlt } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';

const MpIdVerification: React.FC = () => {
    window.scrollTo({top:0, behavior: "instant"});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const description = `[${SERVICE_NAME}]スマホでマイナンバーカードを撮影してかんたん本人確認を行いましょう。本人確認バッジが表示され、交換申請が来やすくなる可能性があります。`;

    return (
        <>
            <Helmet>
                <title>かんたん本人確認 - {SERVICE_NAME}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={`かんたん本人確認 - ${SERVICE_NAME}`} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:title" content={`かんたん本人確認 - ${SERVICE_NAME}`} />
                <meta name="twitter:description" content={description} />
            </Helmet>
            <CustomToolbar title='かんたん本人確認' />
            <Box sx={{ pt: { xs: '3.5rem', sm: '4rem' }, pb: 2 }}>
                <img
                    src="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/IdVerification.jpg"
                    alt="Id Verification"
                    style={{ maxWidth: '100%', marginBottom: '2rem' }}
                />
            </Box>
            <Box textAlign={'center'}>
                <Box borderBottom={4}  borderColor={'#90EE90'} display="inline-block" mb={2}>
                    <Typography variant='h6' fontWeight={'bold'} textAlign={'center'}>かんたん本人確認の方法</Typography>
                </Box>
            </Box>
            <Box px={4} pb={12}>
            <Box border={3} borderColor="#90EE90" borderRadius={4} mb={2}>
                <Grid container alignItems="center">
                    <Grid item xs={1}></Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" component="div" gutterBottom fontWeight="bold" textAlign={'center'} >
                        スピード本人確認
                        </Typography>
                        <Typography variant="body2" component="div" textAlign={'center'}>
                        スマホでマイナンバーカードの表面を撮影
                        </Typography>
                    </Grid>
                    <Grid item xs={5} p={1}>
                        <img
                        src="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/m_01_white.png"
                        alt="Id Verification"
                        style={{ maxWidth: '100%' }}
                        />
                    </Grid>  
                </Grid>
            </Box>
            <Grid container alignItems="center" mb={4}>
                <Grid item xs={1} display="flex" justifyContent="center" alignItems="center">
                    <VerifiedUser sx={{ color: 'green' }}></VerifiedUser>
                </Grid>
                <Grid item xs={11} pl={1}>
                    <Typography variant='body2' color={'#707070'}>マイナンバー情報は本人確認にのみ利用され、トカエルによって安全に管理されます。</Typography>
                </Grid>
            </Grid>
            <Box textAlign={'center'}>
                <Box borderBottom={4}  borderColor={'#90EE90'} display="inline-block" mb={3}>
                    <Typography variant='h6' fontWeight={'bold'} textAlign={'center'}>かんたん本人確認でもっと安心に</Typography>
                </Box>
            </Box>
            <Box display="flex" alignItems="center">
                <Box
                component="img"
                src="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/CreatedIdVerification.png"
                alt="Created Id Verification"
                mr={2}
                sx={{
                    maxWidth: isMobile ? '30%' : '20%' ,
                }}
                />
                <Box>
                    <Typography variant="body1" gutterBottom fontWeight="bold" mb={1} >
                    「本人確認バッジ」の表示
                    </Typography>
                    <Typography variant="body2" gutterBottom color={'#707070'} >
                    交換申請が来やすくなったり受け入れられやすくなったりする可能性があります。
                    </Typography>
                </Box>
            </Box>
            </Box>
            <Box position="fixed" bottom={10} left={0} right={0} p={2} maxWidth={'600px'} mx={'auto'}>
                <Link to="/mypage/verification/camera">
                <Button
                    variant="contained"
                    color="primary"
                    size='large'
                    fullWidth
                    startIcon={<CameraAlt />}
                >
                    同意して撮影を開始
                </Button>
                </Link>
            </Box>
            <Box sx={{ mb: isMobile ? '3rem' : '10rem' }}></Box>
        </>
      );
};

export default MpIdVerification;
