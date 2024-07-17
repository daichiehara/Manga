import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Typography, Divider, Button, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useTheme} from '@mui/material/styles';

// 住所データの型定義
interface ChangeAddressDto {
    sei: string;
    mei: string;
    postalCode: string;
    prefecture: string;
    address1: string;
    address2: string;
}

interface AddressLinkProps {
    onAddressFetch: (isValid: boolean) => void;
}

// AddressLinkコンポーネントの定義
const AddressLink: React.FC<AddressLinkProps> = ({ onAddressFetch }) => {

    const [address, setAddress] = useState<ChangeAddressDto | null>(null);
    const [warningMessage, setWarningMessage] = useState<string | null>(null);
    const theme = useTheme();

    const fetchAddress = async () => {
        try {
            const response = await axios.get<ChangeAddressDto>('https://localhost:7103/api/Users/GetAddress', {
                withCredentials: true,
            });
            setAddress(response.data);
            const isValid = !!(response.data.address1 && response.data.postalCode && response.data.prefecture);
            setWarningMessage(isValid ? null : "住所を登録してください");
            onAddressFetch(isValid); // 親コンポーネントに住所の有効性を通知
        } catch (error) {
            console.error('Error fetching address:', error);
            onAddressFetch(false); // フェッチエラー時は無効とする
        }
    };

    // コンポーネントのマウント時に住所データを取得
    useEffect(() => {
        fetchAddress();
    }, []);

    return (
        <>
            {/* 配送先のタイトル表示 */}
            <Box sx={{ pb: 1.3 }}><Divider sx={{ pt: 1.3 }} /></Box>

                <Typography variant="body1" sx={{ color: '#757575', fontWeight: 'bold' }}>
                    配送先
                </Typography>
                <Link to="/mypage/addressupdate" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                {warningMessage ? (
                    <Grid container>
                        <Grid item xs sx={{ maxWidth: '100%' }}>
                            
                        </Grid>
                        <Grid item display="flex" justifyContent="flex-end" alignItems="center" sx={{ flexGrow: 1 }}>
                        <Box sx={{ pl: 0.8, py: 2 }}>
                                {/* 住所データが存在する場合に表示 */}
                                {warningMessage && (
                                    <Typography variant="body2" sx={{pr:1, display:'flex', justifyContent:'flex-end', color: theme.palette.text.secondary, textAlign: 'center'}}>
                                        {warningMessage}
                                    </Typography>
                                )}
                            </Box>
                            <Typography variant='subtitle2' sx={{ color: '#757575', }}></Typography>
                            <ArrowForwardIosIcon sx={{ color: '#757575', }} />
                        </Grid>    
                    </Grid>
                ) : ( 
                    <Grid container>
                        <Grid item xs={9} sx={{ width:'90%' }}>
                            <Box sx={{ pl: 0.8, py: 2}}>
                                {/* 住所データが存在する場合に表示 */}
                                {address && (
                                    <Typography variant="body2" sx={{ color: '#757575' }}>
                                        {address.sei} {address.mei}<br />
                                        〒{address.postalCode}<br />
                                        {address.prefecture} {address.address1}<br />
                                        {address.address2}
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={3} display="flex" justifyContent="flex-end" alignItems="center" sx={{width:'20px', flexGrow: 1 }}>
                            <Typography variant='subtitle2' sx={{ color: '#757575', }}></Typography>
                            <ArrowForwardIosIcon sx={{ color: '#757575', }} />
                        </Grid>    
                    </Grid>
                )}
                
                
                </Link>

            <Box sx={{ pb: 1.3 }}><Divider sx={{ pt: 1.3 }} /></Box>
        </>
    );
};

export default AddressLink;
