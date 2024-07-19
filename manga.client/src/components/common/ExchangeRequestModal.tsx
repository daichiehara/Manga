import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Alert, Modal, Grid, Typography, Divider, Button, FormGroup, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import NavigateToLoginBox from '../login/NavigateToLoginBox';
import AddIcon from '@mui/icons-material/Add';
import AddressLink from './AddressLink';
import {useTheme} from '@mui/material/styles';
import { SnackbarContext } from '../context/SnackbarContext';

interface ExchangeRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    setMessage: (message: string | null, severity: 'success' | 'error') => void; // メッセージ表示用の関数を受け取る
    wishTitles: { title: string; isOwned: boolean }[];
}

interface ChangeAddressDto {
    sei: string;
    mei: string;
    postalCode: string;
    prefecture: string;
    address1: string;
    address2: string;
}

interface MangaDetail {
    wishTitles: { title: string; isOwned: boolean }[];
}

interface MpMySell {
    sellId: number;
    message: string;
    sellStatus: number;
}

const ExchangeRequestModal: React.FC<ExchangeRequestModalProps> = React.memo(({ isOpen, onClose, setMessage , wishTitles }) => {
    const { sellId } = useParams();
    const { authState } = useContext(AuthContext);
    const [triggerFetch, setTriggerFetch] = useState(false);
    const [isAddressValid, setIsAddressValid] = useState(false); // 住所の有効性を管理
    const [address, setAddress] = useState<ChangeAddressDto | null>(null);
    const [addressWarningMessage, setAddressWarningMessage] = useState<string | null>(null);
    const [sellWarningMessage, setSellWarningMessage] = useState<string | null>(null);
    const [toMainDetailMessage, setToMainDetailMessage] = useState<string | null>(null);
    const [mangaDetail, setMangaDetail] = useState<MangaDetail | null>(null);
    const [mpmysell, setmpmysell] = useState<MpMySell[]>([]);
    const [selectedSellIds, setSelectedSellIds] = useState<number[]>([]); // 選択されたsellIdを管理
    const contentRef = useRef<HTMLDivElement>(null);
    const [finalCheckModalOpen, setFinalCheckModalOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // 送信中状態を管理
    const handleFinalCheckModalOpen = () => setFinalCheckModalOpen(true);
    const handleFinalCheckModalClose = () => setFinalCheckModalOpen(false);
    const { showSnackbar } = useContext(SnackbarContext);


    const fetchAddress = async () => {
        try {
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
            setSelectedSellIds(response.data.filter(item => item.sellStatus === 1).map(item => item.sellId)); // 初期状態でsellStatusが1のものを選択
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

    const handleCheckboxChange = (sellId: number) => {
        setSelectedSellIds((prevSelected) => 
            prevSelected.includes(sellId) 
            ? prevSelected.filter(id => id !== sellId) 
            : [...prevSelected, sellId]
        );
    };

    const handleFinalCheckModal = async () => {
        if (!isAddressValid) {
            setAddressWarningMessage("住所を登録してください。");
            return;
        } else if (mpmysell.filter(item => item.sellStatus === 1).length === 0) {
            setSellWarningMessage("最低1つ出品してください。");
        } else {
            handleFinalCheckModalOpen();
        }
    };

    const handleExchangeFinalRequest = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('https://localhost:7103/api/Requests', {
                responderSellId: sellId,
                requesterSellIds: selectedSellIds,
            }, {
                withCredentials: true
            });
            console.log('Exchange request sent:', response.data);
            onClose(); // モーダルを閉じる
            handleFinalCheckModalClose();
            setToMainDetailMessage("交換申請が送られました");
            
            showSnackbar("交換申請が成功しました", 'success'); // 成功メッセージをセット

        } catch (error) {
            showSnackbar("交換申請に失敗しました", 'error'); // 失敗メッセージをセット
            console.error('Error sending exchange request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const allSellIds = mpmysell.filter(item => item.sellStatus === 1).map(item => item.sellId);
            setSelectedSellIds(allSellIds);
        } else {
            setSelectedSellIds([]);
        }
    };

    const allChecked = selectedSellIds.length === mpmysell.filter(item => item.sellStatus === 1).length;

    const handleAddressFetch = (isValid: boolean) => {
        setIsAddressValid(isValid);
    };

    // 認証されている場合の表示
    const renderAuthenticatedContent = () => (
        <>
            <Box display="flex" alignItems="center" sx={{ my: 2, position: 'relative' }}>
                <Button onClick={onClose} sx={{ p: 0, position: 'absolute', left: 0 }}>
                    <CloseIcon sx={{fontSize:'1.9rem', color: '#494949' }} />
                </Button>
                <Typography variant="h6" sx={{ color: '#494949', fontWeight: 'bold', width: '100%', textAlign: 'center', fontSize:'1.1rem' }}>
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
                    zIndex: 30000,
                }}
                role="presentation"
            >
                <Box sx={{ pb: 1.3 }}><Divider sx={{ pt: 1.3 }} /></Box>
                <Typography variant="body1" sx={{ color: '#656565', fontWeight: 'bold', pb: 1 }}>
                    交換に出す漫画を選ぶ（複数選択可）
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', py:0.5}}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Link to="/sell" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                            <AddIcon sx={{ color: '#0F9ED5' }} />
                            <Typography variant='subtitle1' sx={{ color: '#0F9ED5' }}>
                                出品する
                            </Typography>
                        </Link>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <FormControlLabel
                            sx={{ mr: 2 }}
                            control={
                                <Checkbox
                                    checked={allChecked}
                                    onChange={handleSelectAllChange}
                                    disableRipple
                                    sx={{
                                        '& .MuiSvgIcon-root': { fontSize: '1.0rem', color:'red' }  // ここでチェックボックスのサイズを変更
                                    }}
                                />
                            }
                            label={
                                <Typography variant='body2' sx={{fontSize:'0.85rem'}}>
                                    すべて選択
                                </Typography>
                            }
                        />
                    </Box>
                </Box>
                    
                <Box sx={{ pl: 0.8, mt: 0, mb: 0.5, mr: 1.5 }}>
                {mpmysell.filter(item => item.sellStatus === 1).map((item, index) => {
                        const isWishTitle = wishTitles.some(wish => wish.isOwned && wish.title === item.message);
                        return (
                            <FormGroup key={index}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedSellIds.includes(item.sellId)}
                                            onChange={() => handleCheckboxChange(item.sellId)}
                                            disableRipple
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: '1.2rem', color:'red' }  // ここでチェックボックスのサイズを変更
                                            }}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography sx={{ fontWeight: isWishTitle ? 'bold' : 'normal' }} >
                                                {item.message}
                                            </Typography>
                                            {isWishTitle && (
                                                <Box display="flex" alignItems="center">
                                                    {/* <RocketLaunchIcon sx={{ fontSize: '1.4rem', color: '#0F9ED5', ml: 1 }} /> */}
                                                    <Typography sx={{ ml: 1.5, fontWeight: 'bold', fontStyle: 'italic', fontSize: '0.9rem', color: '#0F9ED5' }}>
                                                        want
                                                        <Box component="span" sx={{ color: 'orange' }}>!!</Box>
                                                    </Typography>
                                                </Box>
                                            )}
                                            
                                        </Box>
                                    }
                                />
                            </FormGroup>
                        );
                    })}
                </Box>

                <Grid container alignItems="center" sx={{ mt: 1, p: 1, mb: 1, background: '#F2F2F2', color: '#444444', fontSize: '0.8rem', borderRadius: '4px', }}>
                    <Grid item>
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 0.1 }}>
                        <Typography variant="subtitle2" sx={{mr:1, mb:0.2, color: "#0F9ED5", fontWeight:`bold`, fontStyle:'italic'}}>
                            want<Box component="span" sx={{ color: 'orange' }}>!!</Box>
                        </Typography>
                    </Box>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="body2" sx={{ color: '#444444', fontSize: '0.8rem' }}>
                            出品者の欲しい漫画です。選択で交換成功率アップ!!
                        </Typography>
                    </Grid>
                </Grid>
                    
                <Grid container alignItems="center" sx={{ mt: 1, p: 1, mb: 1, background: '#F2F2F2', color: '#444444', fontSize: '0.8rem', borderRadius: '4px', }}>
                    <Grid item>
                        <EmojiObjectsOutlinedIcon sx={{ ml: 1, mr: 2, display: 'flex', justifyContent: 'center', fontSize: '1.7rem', color: 'orange' }} />
                    </Grid>
                    <Grid item xs>
                        <Typography variant="body2" sx={{ color: '#444444', fontSize: '0.8rem' }}>
                            交換されるタイトルは1つです。複数選択して成功率アップ!!
                        </Typography>
                    </Grid>
                </Grid>

                {isOpen && <AddressLink onAddressFetch={handleAddressFetch} />}
                
                {sellWarningMessage && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        {sellWarningMessage}
                    </Alert>
                )}
                {addressWarningMessage && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        {addressWarningMessage}
                    </Alert>
                )}


                <Box sx={{ py: 2, position: 'relative', bottom: 0, right: 0, display: 'flex', justifyContent: 'center', maxWidth: '640px', width: '100%', left: '50%', transform: 'translateX(-50%)', }}>
                    <Button variant="contained" disableElevation sx={{ background: 'red', maxWidth: '640px', width: '100%', color: 'white', border: '1px solid red', borderRadius: '4px', boxShadow: 'none' ,'&:hover': {
                        background: 'red', // ホバー時の背景色
                        boxShadow: 'none', // ホバー時の影
                    },}}
                        onClick={handleFinalCheckModal}
                    >
                        交換を希望する
                    </Button>
                </Box>

                <Modal
                    open={finalCheckModalOpen}
                    onClose={handleFinalCheckModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{zIndex:100000, position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90vw', // 画面の幅を90%に設定
                        maxWidth: '640px',  // 最大幅を640pxに設定
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 0,}}
                    >
                        <Typography sx={{px:2, pt:3, pb: 1.5, color: '#454545', fontSize: '0.8rem' }}>
                            選択された漫画で交換を希望することが伝えられます。相手が承認した場合、<Box component="span" sx={{ color: "red" }}>交換が決定します。</Box>交換が決定する前ならば、キャンセルが可能です。
                        </Typography>
                        <Typography sx={{px:2, py: 1.5, color: '#454545', fontSize: '0.8rem' }}>
                            <Link to="/terms-of-service" style={{ color: '#0F9ED5', textDecoration: 'underline'  }}>
                                利用規約
                            </Link>
                            に同意の上、ボタンを押してください。
                        </Typography>
                        <Box sx={{px:1,}}>
                            <Box sx={{ pt: 2, pb:3, position: 'relative', bottom: 0, right: 0, display: 'flex', justifyContent: 'center', maxWidth: '640px', width: '100%', left: '50%', transform: 'translateX(-50%)', }}>
                                <Button variant="contained" disableElevation sx={{ background: 'red', maxWidth: '640px', width: '100%', color: 'white', border: '1px solid red', borderRadius: '4px', boxShadow: 'none' ,'&:hover': {
                                    background: 'red', // ホバー時の背景色
                                    boxShadow: 'none', // ホバー時の影
                                },}}
                                    onClick={handleExchangeFinalRequest}
                                >
                                    {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : '交換を希望する'}
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Modal>
                {/* Add the Recent Comments s
                <Box sx={{ border: '0.5px solid #A2A2A2A2', borderRadius: '4px', padding: '16px', }}>
                    <Typography variant="body2" sx={{ mb: 1.5, color: '#454545', }}>
                        交換に出すためには、出品する必要があります。
                    </Typography>

                    <Box sx={{ py: 2, position: 'relative', bottom: 0, right: 0, display: 'flex', justifyContent: 'center', maxWidth: '640px', width: '100%', left: '50%', transform: 'translateX(-50%)', }}>
                        <Button variant="contained" disableElevation sx={{ background: 'white', maxWidth: '640px', width: '100%', color: 'red', border: '1px solid red', borderRadius: '4px', boxShadow: 'none' }}
                            onClick={handleExchangeFinalRequest}
                        >
                            今すぐ出品する
                        </Button>
                    </Box>
                </Box>
                ection */}
            </Box>
        </>
    );

    // 未認証時の表示
    const renderUnauthenticatedContent = () => (
        <>
        <Box display="flex" alignItems="center" sx={{ my: 2, position: 'relative' }}>
            <Button onClick={onClose} sx={{ p: 0, position: 'absolute', left: 0 }}>
                <CloseIcon sx={{ color: '#494949' }} />
            </Button>
            <Typography variant="subtitle1" sx={{ color: '#494949', fontWeight: 'bold', width: '100%', textAlign: 'center' }}>
                交換を希望する
            </Typography>
        </Box>
            <NavigateToLoginBox height='70vh'/>
        </>
    );

    return (
        <SwipeableDrawer
            swipeAreaWidth={0}
            disableSwipeToOpen={false}
            disableScrollLock // スクロールロックを無効にする
            disableDiscovery // 
            disableBackdropTransition //
            anchor='bottom' // モーダルを下部に配置
            open={isOpen} // モーダルの開閉状態
            onClose={() => {
                onClose();
                // モーダルが閉じたときにtriggerFetchをリセット
                setTriggerFetch(false);
            }}
            onOpen={() => { }}
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
                    height: '90vh',
                    width: '100vw', // 画面の幅にフルで広げる
                    maxWidth: '640px',  // 最大幅を640pxに設定
                    mx: 'auto',
                    zIndex: 30000,
                }
            }}
        >
            {authState.isAuthenticated ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
        </SwipeableDrawer>
    );
});

export default ExchangeRequestModal;
