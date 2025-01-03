import React, { useEffect } from 'react';
import { Typography, Avatar, Box, Stack, Grid } from '@mui/material';
import CustomToolbar from '../components/common/CustumToolbar';
import LoopIcon from '@mui/icons-material/Loop';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import { UserContext } from '../components/context/UserContext';
import SellSettingList from '../components/mypage/SellSettingList';
import SettingList from '../components/mypage/SettingList';
import PolicyList from '../components/mypage/PolicyList';
import LogoutList from '../components/mypage/LogoutList';
import NavigateToLoginBox from '../components/login/NavigateToLoginBox';
import MenuBar from '../components/menu/MenuBar';
import VerificationStatus from '../components/common/VerificationStatus';
import { useSnackbar } from '../hooks/useSnackbar';
import ForwardToInboxRoundedIcon from '@mui/icons-material/ForwardToInboxRounded';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';

const MainMyPage: React.FC = () => {
  const { userInfo } = useContext(UserContext);
  const { authState } = useContext(AuthContext);
  useSnackbar();

  const renderMainIcon = (
    to: string,
    Icon: React.ElementType,
    label: string,
    label2:string,
    bgColor: string = "grey.300"
  ) => (
    <Grid item xs={3} display="flex" alignItems="center" justifyContent="center" flexDirection="column" component={Link} to={to} sx={{ textDecoration: 'none' }}>
      <Box
        bgcolor={bgColor}
        borderRadius="50%"
        sx={{p:1, }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon sx={{ fontSize: `2.5rem`, color: `#7F7F7F` }} />
      </Box>
      {/* 固定の高さを設定 */}
      <Typography variant="body2" gutterBottom sx={{ pt: 2, pb: 1, fontWeight: 'bold', color: '#757575', minHeight: '3rem', textAlign: 'center' }}>
        {label}
        <br />
        {label2}
      </Typography>
    </Grid>
  );
  const description = `[トカエル]このページでは、ユーザーのプロフィールや出品・交換した漫画、設定などを管理できます。`;  

  return (
    <>
      <Helmet>
        <title>マイページ - {SERVICE_NAME}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content="マイページ" />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:title" content="マイページ" />
        <meta name="twitter:description" content={description} />
      </Helmet>
      <CustomToolbar title='マイページ' showBackButton={false} />
      {authState.isAuthenticated ? (
        userInfo ? (
          <Box px={2}>
            {/* プロフィール部分 */}
            <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ pt: 15, pb: 8 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1.8 }}>
                <Avatar src={userInfo.profileIcon} alt={userInfo.nickName} sx={{ width: '4rem', height: '4rem' }} />
              </Stack>
              <Typography variant="subtitle1" sx={{ pb: 1, fontWeight: 'bold' }}>
                {userInfo.nickName}
              </Typography>
              <VerificationStatus isVerified={userInfo.hasIdVerificationImage} />
            </Grid>

            {/* メインアイコン部分 */}
            <Grid container spacing={2} sx={{ pb: 3 }}>
              {renderMainIcon('/mypage/favolist', FavoriteBorderIcon, 'いいね一覧', '')}
              {renderMainIcon('/mypage/mysell', MenuBookIcon, '出品した', '漫画')}
              {renderMainIcon('/mypage/matchedsell', LoopIcon, '交換した', '漫画')}
              {renderMainIcon('/mypage/requestedsell', ForwardToInboxRoundedIcon, '交換申請' , 'した漫画')}
            </Grid>

            {/* その他のリスト */}
            <SellSettingList />
            <SettingList />
            <PolicyList />
            <LogoutList />
          </Box>
        ) : (
          <Typography variant="body1" align="center">
            データを取得中...
          </Typography>
        )
      ) : (
        <>
          <NavigateToLoginBox height='40vh' />
          <PolicyList />
        </>
      )}
      <MenuBar />
    </>
  );
};

export default MainMyPage;
