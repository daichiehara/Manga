import React, { useState, useEffect, MouseEvent, useCallback, useContext } from 'react';
import { SwipeableDrawer, Box, Typography, Button, CircularProgress, Card, CardContent, CardMedia, CardActionArea, Chip, IconButton, Alert } from '@mui/material';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import AddressLink from './AddressLink';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { SnackbarContext } from '../context/SnackbarContext';

interface RequestedGetDto {
  responderSellId: number;
  responderSellTitle: string;
  responderSellImageUrl: string;
  responderSellStatus: SellStatus;
  requesterSells: SellInfoDto[];
  deletedRequestCount: number;
}

enum SellStatus {
  Recruiting = 1,
  Suspended = 2,
  Established = 3,
  Draft = 4,
}

interface SellInfoDto {
  sellId: number;
  title: string;
  imageUrl: string;
  requestStatus: RequestStatus;
}

enum RequestStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Withdrawn = 4,
}

interface ExchangeAcceptDrawerProps {
  open: boolean;
  onClose: () => void;
  sellId: number | null;
  selectedRequesterSell: SellInfoDto | null;
  onRequesterSellSelect: (sell: SellInfoDto | null) => void;
  onFetchExchangeRequest: (id: number) => Promise<RequestedGetDto>;
  onExchangeConfirmed: () => void;
}

const truncateString = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};

const ExchangeAcceptDrawer: React.FC<ExchangeAcceptDrawerProps> = React.memo(({ 
  open, 
  onClose, 
  sellId, 
  selectedRequesterSell, 
  onRequesterSellSelect,
  onFetchExchangeRequest,
  onExchangeConfirmed
}) => {
  const [selectedExchange, setSelectedExchange] = useState<RequestedGetDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localSelectedRequesterSell, setLocalSelectedRequesterSell] = useState<SellInfoDto | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const [isConfirming, setIsConfirming] = useState(false);
  const { showSnackbar } = useContext(SnackbarContext);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const deletedRequestCount = selectedExchange?.deletedRequestCount || 0;
  const totalSellCount = (selectedExchange?.requesterSells.length || 0) + deletedRequestCount;
  const [isAddressValid, setIsAddressValid] = useState(false); // 住所の有効性を管理
  const getButtonText = (
    sellStatus: SellStatus | undefined,
    requesterSell: SellInfoDto | null | undefined
  ): string => {
    if (sellStatus === undefined) return '読み込み中...';
    if (sellStatus === SellStatus.Established) return '交換成立済み';
    
    if (requesterSell == null) return '交換する出品を選択してください';
    
    switch (sellStatus) {
      case SellStatus.Recruiting:
        return requesterSell.requestStatus === RequestStatus.Approved ? '交換成立済み' : '交換を確定';
      case SellStatus.Suspended:
      case SellStatus.Draft:
        return 'あなたの出品が公開停止中';
      default:
        return '交換を確定';
    }
  };

  const isButtonDisabled = (
    sellStatus: SellStatus | undefined,
    requesterSell: SellInfoDto | null | undefined
  ): boolean => {
    if (sellStatus === undefined) return true;
    if (sellStatus === SellStatus.Established) return true;
    
    if (requesterSell == null) return true;
    
    return sellStatus !== SellStatus.Recruiting || 
           requesterSell.requestStatus === RequestStatus.Approved || 
           isConfirming;
  };  

  useEffect(() => {
    if (open && sellId !== null) {
      fetchExchangeRequest(sellId);
    }
  }, [open, sellId]);

  useEffect(() => {
    setLocalSelectedRequesterSell(selectedRequesterSell);
  }, [selectedRequesterSell]);

  const fetchExchangeRequest = async (id: number) => {
    setIsLoading(true);
    try {
      const data = await onFetchExchangeRequest(id);
      setSelectedExchange(data);
      console.log('fetch requested id')
    } catch (error) {
      console.error('交換リクエストデータの取得に失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // エラーメッセージをクリアする関数
  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  // コンポーネントが開かれたときにエラーをクリア
  useEffect(() => {
    if (open) {
      clearError();
    }
  }, [open, clearError]);

  const confirmExchange = async (responderSellId: number, requesterSellId: number) => {
    try {
      const response = await axios.post('https://localhost:7103/api/Requests', {
        ResponderSellId: responderSellId,
        RequesterSellIds: [requesterSellId]
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data);
      }
      throw error;
    }
  };

  const handleExchangeConfirm = async () => {
    if (selectedExchange === null || localSelectedRequesterSell === null) return;
    if (!isAddressValid) {
      setErrorMessage("住所を登録してください。");
      return;
    }
    setIsConfirming(true);
    clearError();
    try {
      await confirmExchange(localSelectedRequesterSell.sellId, selectedExchange.responderSellId,);
      showSnackbar('交換が成立しました！', 'success');
      sessionStorage.removeItem('notificationState');
      onExchangeConfirmed();
      setLocalSelectedRequesterSell(null);  // ローカル状態をリセット
      onRequesterSellSelect(null);  // 親コンポーネントの状態をリセット
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('交換の確定に失敗しました。もう一度お試しください。');
      }
    } finally {
      setIsConfirming(false);
    }
  };

  const navigateToItemDetail = useCallback((itemId: number, event?: MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.stopPropagation();
    }
    const currentState = {
      selectedRequesterSells: selectedRequesterSell ? { [sellId!]: selectedRequesterSell } : {},
      drawerOpen: true,
      selectedSellId: sellId
    };
    sessionStorage.setItem('notificationState', JSON.stringify(currentState));
    navigate(`/item/${itemId}`);
  }, [navigate, sellId, selectedRequesterSell]);

  const handleAddressFetch = (isValid: boolean) => {
      setIsAddressValid(isValid);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen={false}
      disableBackdropTransition
      disableDiscovery
      swipeAreaWidth={0}
      disableScrollLock
      sx={{
        '& .MuiDrawer-paper': {
          maxHeight: '97%',
          width: '100%',
          maxWidth: '640px',
          margin: 'auto',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      }}
    >
      <Box display="flex" alignItems="center" sx={{ my: 2, position: 'relative' }}>
          <Button onClick={onClose} sx={{ p: 0, position: 'absolute', left: 0 }}>
              <CloseIcon sx={{fontSize:'1.9rem', color: theme.palette.info.main }} />
          </Button>
          <Typography variant="h6" sx={{ color: theme.palette.info.main, fontWeight: 'bold', width: '100%', textAlign: 'center', fontSize:'1.1rem' }}>
              交換申請を受け入れる
          </Typography>
      </Box>
      <Box sx={{ px: 3 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : selectedExchange ? (
          <>
            
            <Card variant='outlined' sx={{ mb: 3, position: 'relative', display: 'flex', alignItems: 'center' }} elevation={0}>
              <CardActionArea onClick={() => navigateToItemDetail(selectedExchange.responderSellId)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 2,
                      m: 1,
                    }}
                    image={selectedExchange.responderSellImageUrl}
                    alt={selectedExchange.responderSellTitle}
                  />
                  <CardContent sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                      あなたの出品
                    </Typography>
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                      {selectedExchange.responderSellTitle}
                    </Typography>
                  </CardContent>
                </Box>
              </CardActionArea>
              <IconButton
                size="small"
                sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.7)' }}
                onClick={(e) => navigateToItemDetail(selectedExchange.responderSellId, e)}
              >
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Card>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <SwapVertIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            交換したい漫画を選択
          </Typography>
          <Box 
            sx={{ 
              position: 'relative',
              mb: 1,
            }}
          >
            <Box 
              sx={{ 
                display: 'flex',
                overflow: 'auto',
                pb: 4,
                pr: 3, // 右側のパディングを削除
                pt: 1,
                mr: '-24px', // Drawerの右側のパディングを相殺
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                [theme.breakpoints.up('md')]: {
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,.2)',
                    borderRadius: '4px',
                  },
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(0,0,0,.2) transparent',
                }
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                {selectedExchange?.requesterSells.map((sell) => (
                  <Card 
                    key={sell.sellId} 
                    sx={{ 
                      width: 150,
                      flexShrink: 0,
                      position: 'relative',
                      transition: 'all 0.3s ease-in-out',
                      transform: selectedRequesterSell?.sellId === sell.sellId ? 'scale(1.05)' : 'none',
                      boxShadow: selectedRequesterSell?.sellId === sell.sellId 
                        ? '12px 12px 20px 0 rgba(0,0,0,0.2)' 
                        : '0 4px 8px 0 rgba(0,0,0,0.1)',
                      backgroundColor: selectedRequesterSell?.sellId === sell.sellId 
                        ? '#e3f2fd'
                        : 'white',
                      borderRadius: 2,
                      opacity: sell.requestStatus === RequestStatus.Approved ? 0.7 : 1,
                    }}
                  >
                          <CardActionArea 
                            onClick={() => sell.requestStatus === RequestStatus.Pending && onRequesterSellSelect(sell)}
                            disabled={sell.requestStatus !== RequestStatus.Pending}
                            sx={{
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="100"
                              image={sell.imageUrl}
                              alt={sell.title}
                            />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography 
                                variant="body2" 
                                component="div" 
                                noWrap
                                sx={{
                                  fontWeight: selectedRequesterSell?.sellId === sell.sellId ? 'bold' : 'normal',
                                  color: selectedRequesterSell?.sellId === sell.sellId ? '#1976d2' : 'inherit',
                                }}
                              >
                                {truncateString(sell.title, 10)}
                              </Typography>
                            </CardContent>
                            {sell.requestStatus === RequestStatus.Approved && (
                              <Typography variant="caption" color="success.main" fontWeight={'bold'}>
                                交換成立済み
                              </Typography>
                            )}
                            {sell.requestStatus === RequestStatus.Withdrawn && (
                              <Typography variant="caption" color="text.secondary" fontWeight={'bold'}>
                                リクエスト取り下げ済み
                              </Typography>
                            )}
                          </CardActionArea>
                          <IconButton
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 4, 
                              right: 4, 
                              backgroundColor: 'rgba(255,255,255,0.7)',
                            }}
                            onClick={(e) => navigateToItemDetail(sell.sellId, e)}
                          >
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                          {selectedRequesterSell?.sellId === sell.sellId && (
                            <CheckCircleIcon
                              sx={{
                                position: 'absolute',
                                top: 4,
                                left: 4,
                                color: '#1976d2',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                fontSize: 24,
                              }}
                            />
                          )}
                        </Card>
                      ))}
                      {Array.from({ length: deletedRequestCount }).map((_, index) => (
                        <Card 
                          key={`deleted-${index}`}
                          sx={{ width: 150, flexShrink: 0, opacity: 0.5 }}
                        >
                          <CardContent>
                            <Typography variant="body2" component="div">
                              削除済み
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                      </Box>
                    </Box>
          </Box>
          {open && <AddressLink onAddressFetch={handleAddressFetch} />}
        <Box 
          sx={{ 
            mb: 3, 
            mt: 2,
            height: 32, // Chipの高さ分のスペースを確保
            visibility: selectedRequesterSell ? 'visible' : 'hidden', // 選択されていない時は非表示にするが、スペースは確保
            opacity: selectedRequesterSell ? 1 : 0, // フェードエフェクトのため
            transition: 'opacity 0.3s ease-in-out', // スムーズな遷移のため
          }}
        >
          <Chip 
            label={selectedRequesterSell ? `選択中: ${selectedRequesterSell.title}` : ''}
            color="primary"
            onDelete={() => onRequesterSellSelect(null)}
          />
        </Box>
        <Typography sx={{fontSize: '0.8rem'}} color='secondary'>この申請を受け入れることで交換が決定します。<br />交換したい漫画の詳細情報をよく確認の上、選択してください。</Typography>
        {errorMessage && (
          <Alert severity="error" onClose={clearError} sx={{ mt: 2, mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleExchangeConfirm}
              disabled={isButtonDisabled(selectedExchange?.responderSellStatus, localSelectedRequesterSell)}
              fullWidth
              size='large'
              sx={{ mt: 2, mb: 3, py: 1.5, borderRadius: 2 }}
            >
              {isConfirming ? <CircularProgress size={24} /> : getButtonText(selectedExchange?.responderSellStatus, localSelectedRequesterSell)}
            </Button>
          </>
        ) : (
          <Typography>交換リクエストの詳細を取得できませんでした。</Typography>
        )}
      </Box>
    </SwipeableDrawer>
  );
});

export default ExchangeAcceptDrawer;