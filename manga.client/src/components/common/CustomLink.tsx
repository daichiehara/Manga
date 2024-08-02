import React from 'react';
import { Link, LinkProps } from '@mui/material';

interface CustomLinkProps extends LinkProps {
  children: React.ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({ children, ...props }) => {
  return (
    <Link
      {...props}
      sx={{
        color: '#0073CC',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      }}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
