import React from 'react';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CustomLink from './CustomLink';

const GooglePolicyText: React.FC = () => {
  const theme = useTheme();

  return (
    <Typography variant='body2' sx={{ color: theme.palette.text.secondary }}>
      このサイトはreCAPTCHAで保護されており、Googleの
      <CustomLink
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
      >
        プライバシーポリシー
      </CustomLink>
      と
      <CustomLink
        href="https://policies.google.com/terms"
        target="_blank"
        rel="noopener noreferrer"
      >
        利用規約
      </CustomLink>
      が適用されます。
    </Typography>
  );
};

export default GooglePolicyText;
