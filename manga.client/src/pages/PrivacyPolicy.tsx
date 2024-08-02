import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';

const PrivacyPolicy: React.FC = () => {
  return (
    <Box>
        <CustomTocaeruToolbar showBackButton showSubtitle subtitle={'プライバシーポリシー'} />
        <Typography variant="body1" paragraph>
            ここにプライバシーポリシーの内容を記載します。
        </Typography>
        <Typography variant="body1" paragraph>
            詳細なプライバシーポリシーの内容を追加してください。
        </Typography>
    </Box>
  );
};

export default PrivacyPolicy;
