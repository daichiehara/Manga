import React from 'react';
import { Typography, Grid, Box,  } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';



interface AddressLinkProps {
  address: {
    sei: string;
    mei: string;
    postalCode: string;
    prefecture: string;
    address1: string;
    address2: string;
} | null;
}

const AddressLink: React.FC<AddressLinkProps> = ({ address }) => (
  <>
    <Typography variant="body1" sx={{ color: '#757575', fontWeight: 'bold' }}>
                配送先
            </Typography>
            <Grid container>
                <Grid item xs sx={{ maxWidth: '100%' }}>
                    <Box sx={{ pl: 0.8, py: 2 }}>
                        {address && (
                            <Typography variant="body2" sx={{ color: '#757575' }}>
                                {`${address.sei} ${address.mei}`}<br />
                                〒{address.postalCode}<br />
                                {address.prefecture} {address.address1}<br />
                                {address.address2}
                            </Typography>
                        )}
                    </Box>
                </Grid>
                <Link to="/mypage/addressupdate" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <Grid item display="flex" justifyContent="flex-end" alignItems="center">
                        <Typography variant='subtitle2' sx={{ color: '#757575', }}></Typography>
                        <ArrowForwardIosIcon sx={{ color: '#757575', }} />
                    </Grid>
                </Link>
            </Grid>
  </>
);

export default AddressLink;
