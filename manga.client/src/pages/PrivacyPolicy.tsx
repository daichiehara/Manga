import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';

const PrivacyPolicy: React.FC = () => {
    const description = `${SERVICE_NAME}のプライバシーポリシー`

    return (
        <HelmetProvider>
            <Helmet>
                <title>{SERVICE_NAME} - プライバシーポリシー</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={`${SERVICE_NAME} - プライバシーポリシー`} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${SERVICE_NAME} - プライバシーポリシー`} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
            </Helmet>
            <Box>
                <CustomTocaeruToolbar showBackButton showSubtitle subtitle={'プライバシーポリシー'} />
                <Typography variant="body1" paragraph>
                    ここにプライバシーポリシーの内容を記載します。
                </Typography>
                <Typography variant="body1" paragraph>
                    詳細なプライバシーポリシーの内容を追加してください。
                </Typography>
            </Box>
        </HelmetProvider>
    );
};

export default PrivacyPolicy;
