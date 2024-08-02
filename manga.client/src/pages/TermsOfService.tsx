import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';

const TermsOfService: React.FC = () => {
  return (
    <Box>
        <CustomTocaeruToolbar showBackButton showSubtitle subtitle={'利用規約'}/>
        <Typography variant="body1" paragraph>
            ここに利用規約の内容を記載します。
        </Typography>
        <Typography variant="body1" paragraph>
            詳細な利用規約の内容を追加してください。
        </Typography>
    </Box>
  );
};

export default TermsOfService;
