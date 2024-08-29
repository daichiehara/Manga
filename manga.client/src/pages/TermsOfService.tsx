import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';

const TermsOfService: React.FC = () => {
    const description = `${SERVICE_NAME}の利用規約ページです。サービスを利用するための規則や条件が記載されています。`;

    return (
        <HelmetProvider>
            <Helmet>
                <title>{SERVICE_NAME} - 利用規約</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={`${SERVICE_NAME} - 利用規約`} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${SERVICE_NAME} - 利用規約`} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
            </Helmet>
            <Box>
                <CustomTocaeruToolbar showBackButton showSubtitle subtitle={'利用規約'}/>
                <Typography variant="body1" paragraph>
                    ここに利用規約の内容を記載します。
                </Typography>
                <Typography variant="body1" paragraph>
                    詳細な利用規約の内容を追加してください。
                </Typography>
            </Box>
        </HelmetProvider>
  );
};

export default TermsOfService;
