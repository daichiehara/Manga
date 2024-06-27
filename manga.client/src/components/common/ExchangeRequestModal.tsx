import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid, Typography, Paper, Divider, Button, FormGroup, FormControlLabel, Checkbox} from '@mui/material';


interface ExchangeRequestModalProps 
{
    isOpen: boolean;
    onClose: () => void;
}

interface ChangeAddressDto 
{
    sei: string;
    mei: string;
    postalCode: string;
    prefecture: string;
    address1: string;
    address2: string;
}

interface MangaDetail 
{
    wishTitles: { title: string; isOwned: boolean }[];
}  

interface MpMySell 
{
    sellId: number;
    message: string;
}


const ExchangeRequestModal: React.FC<ExchangeRequestModalProps> = React.memo(({ isOpen, onClose }) => {
    const { sellId } = useParams();
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [address, setAddress] = useState<ChangeAddressDto | null>(null);
    const [mangaDetail, setMangaDetail] = useState<MangaDetail | null>(null);
    const [mpmysell, setmpmysell] = useState<MpMySell[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);

    const fetchAddress = async () => {
        try 
        {
            const response = await axios.get<ChangeAddressDto>('https://localhost:7103/api/Users/GetAddress', {
                withCredentials: true,
            });
            setAddress(response.data);
        } catch (error) {
            console.error('Error fetching address:', error);
        }
    };

    const fetchMangaDetails = async () => {
        try {
            const response = await axios.get<MangaDetail>(`https://localhost:7103/api/Sells/${sellId}`, {
                withCredentials: true  // クロスオリジンリクエストにクッキーを含める
            });
            setMangaDetail(response.data);
        } catch (error) {
            console.error('漫画の詳細情報の取得に失敗:', error);
        }
    };

    const fetchmpmysell = async () => {
        try {
            const response = await axios.get<MpMySell[]>('https://localhost:7103/api/Sells/MySell', {
                withCredentials: true  // クロスオリジンリクエストにクッキーを含める
            });
            // 取得したデータで状態を更新
            setmpmysell(response.data);
        } catch (error) {
            console.error('出品データの取得に失敗:', error);
        }
    };

    useEffect(() => {
        fetchMangaDetails();
    }, [sellId]);

    useEffect(() => {
        if (isOpen) {
            setTriggerFetch(true);
            fetchAddress(); // モーダルが開いたときに住所を取得
            fetchmpmysell(); // モーダルが開いたときにマイセルを取得
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen && contentRef.current) {
            contentRef.current.scrollTop = 0; // モーダルが閉じたときにスクロール位置をリセット
        }
    }, [isOpen]);

    const handleExchangeFinalRequest = () => {
        // Implementation of the exchange request logic
    };

  return (
    <SwipeableDrawer
        disableScrollLock // スクロールロックを無効にする
        anchor='bottom' // モーダルを下部に配置
        open={isOpen} // モーダルの開閉状態
        onClose={() => {
          onClose();
          // モーダルが閉じたときにtriggerFetchをリセット
          setTriggerFetch(false);
        }}
        onOpen={() => {}}
        swipeAreaWidth={0}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,  // 一度表示された後もコンポーネントを保持
          BackdropProps: {
            style: {
              pointerEvents: 'none' // バックドロップをクリック不可にする
            }
          }
        }}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            width: '100vw', // 画面の幅にフルで広げる
            maxWidth: '640px',  // 最大幅を640pxに設定
            mx: 'auto',
            zIndex:30000,
          }
        }}
    >
        <Box display="flex" alignItems="center" sx={{my:2, position: 'relative' }}>
            <Button  onClick={onClose} sx={{p:0, position: 'absolute', left: 0, }}>
                <CloseIcon sx={{ color: '#494949' }} />
            </Button>
            <Typography variant="subtitle1" sx={{ color: '#494949', fontWeight: 'bold', width: '100%', textAlign: 'center' }}>
                交換を希望する
            </Typography>
        </Box>
        <Box
          ref={contentRef} // RefをBoxに割り当てる
          sx={{
            width: 'auto',  // コンテンツに合わせて幅を調整
            maxWidth: '640px',  // 最大幅を640pxに設定
            height: '90vh', // 高さを画面の90%に設定
            overflow: 'auto', // コンテンツが溢れた場合にスクロールを有効にする
            mb: 2,
            px: 3,
            zIndex:30000,
          }}
          role="presentation"
        >
            <Box sx={{pb:1.3}}><Divider sx={{pt:1.3}}/></Box>
            <Typography variant="body1" sx={{color: '#757575', fontWeight:'bold'}}>
                交換に出す漫画を選ぶ（複数選択可）
            </Typography>

            <Box sx={{mt:0, mb:1.5, mr:1.5}}>
                {mpmysell.map((item, index) => (
                    <FormGroup key={index}>
                        <FormControlLabel control={<Checkbox defaultChecked disableRipple/>} label={item.message} />
                    </FormGroup>
                ))}
            </Box>

            <Box sx={{pt:2, border: '1px solid #A2A2A2A2', borderRadius: '4px', }}>
                <Typography variant="body2" sx={{color: '#757575', fontWeight:'bold'}}>
                    ※ 交換されるタイトルは1つです。複数選択すると<Box component="span" sx={{color:"red"}}>交換される可能性は上がります。</Box>
                </Typography>
                <Typography variant="body2" sx={{color: '#757575', fontWeight:'bold'}}>
                    交換に出すためには、出品する必要があります。
                </Typography>
                <Box sx={{py:2, position: 'relative', bottom: 0,right: 0, display: 'flex', justifyContent: 'center',  maxWidth: '640px',width: '100%', left: '50%',transform: 'translateX(-50%)', }}>
                    <Button variant="contained" sx={{mx: 2, background:'white',maxWidth: '640px', width: '100%', color:'red',border: '1px solid red', borderRadius: '4px', boxShadow: 'none' }}
                        onClick={handleExchangeFinalRequest}
                    >
                        今すぐ出品へ!!
                    </Button>
                </Box>
            </Box>
            <Box sx={{pb:1.3}}><Divider sx={{pt:1.3}}/></Box>
            <Typography variant="body1" sx={{color: '#757575', fontWeight:'bold'}}>
                配送先
            </Typography>
            <Box sx={{ py: 2 }}>
                {address && (
                    <Typography variant="body2" sx={{ color: '#757575' }}>
                        {`${address.sei} ${address.mei}`}<br />
                        〒{address.postalCode}<br />
                        {address.prefecture} {address.address1}<br />
                        {address.address2}
                    </Typography>
                )}
            </Box>
            
            <Box sx={{pb:1.3}}><Divider sx={{pt:1.3}}/></Box>

            <Typography variant="body2" sx={{color: '#757575', fontWeight:'bold'}}>
                ※ この選択された漫画で交換を希望することが、相手に伝えられえます。相手が承認した場合、<Box component="span" sx={{color:"red"}}>交換が決定します。</Box>
            </Typography>
            <Typography variant="body2" sx={{color: '#757575', fontWeight:'bold'}}>
                ※ 交換が決定する前ならば、キャンセルが可能です。
            </Typography>


            <Box sx={{py:2, position: 'relative', bottom: 0,right: 0, display: 'flex', justifyContent: 'center',  maxWidth: '640px',width: '100%', left: '50%',transform: 'translateX(-50%)', }}>
                <Button variant="contained" sx={{mx: 2, background:'orange',maxWidth: '640px', width: '100%', boxShadow: 'none',color: '#353535',fontWeight:'bold'}}
                    onClick={handleExchangeFinalRequest}
                >
                    交換を希望する
                </Button>
            </Box>
        </Box>
    </SwipeableDrawer>
  );
});

export default ExchangeRequestModal;
