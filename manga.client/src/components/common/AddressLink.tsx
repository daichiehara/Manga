import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// 住所データの型定義
interface ChangeAddressDto {
    sei: string;
    mei: string;
    postalCode: string;
    prefecture: string;
    address1: string;
    address2: string;
}

// AddressLinkコンポーネントの定義
const AddressLink: React.FC = () => {
    // 住所データを格納するステートを定義
    const [address, setAddress] = useState<ChangeAddressDto | null>(null);

    // サーバーから住所データを取得する関数
    const fetchAddress = async () => {
        try {
            // APIエンドポイントから住所データを取得
            const response = await axios.get<ChangeAddressDto>('https://localhost:7103/api/Users/GetAddress', {
                withCredentials: true, // クロスオリジンリクエストにクッキーを含める
            });
            // 取得したデータをステートに保存
            setAddress(response.data);
        } catch (error) {
            console.error('住所データの取得に失敗しました:', error);
        }
    };

    // コンポーネントのマウント時に住所データを取得
    useEffect(() => {
        fetchAddress();
    }, []);

    return (
        <>
            {/* 配送先のタイトル表示 */}
            <Typography variant="body1" sx={{ color: '#757575', fontWeight: 'bold' }}>
                配送先
            </Typography>
            <Grid container>
                <Grid item xs sx={{ maxWidth: '100%' }}>
                    <Box sx={{ pl: 0.8, py: 2 }}>
                        {/* 住所データが存在する場合に表示 */}
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
                {/* 住所更新ページへのリンク */}
                <Link to="/mypage/addressupdate" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <Grid item display="flex" justifyContent="flex-end" alignItems="center">
                        <Typography variant='subtitle2' sx={{ color: '#757575', }}></Typography>
                        <ArrowForwardIosIcon sx={{ color: '#757575', }} />
                    </Grid>
                </Link>
            </Grid>
        </>
    );
};

export default AddressLink;
