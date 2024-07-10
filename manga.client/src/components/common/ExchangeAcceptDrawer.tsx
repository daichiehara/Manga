import React, { useState, useEffect, MouseEvent, useCallback } from 'react';
import { SwipeableDrawer, Box, Typography, Button, CircularProgress, Card, CardContent, CardMedia, CardActionArea, Chip, IconButton } from '@mui/material';
import axios from 'axios';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';

interface RequestedGetDto {
  responderSellId: number;
  responderSellTitle: string;
  responderSellImageUrl: string;
  requesterSells: SellInfoDto[];
}

interface SellInfoDto {
  sellId: number;
  title: string;
  imageUrl: string;
}

interface ExchangeAcceptDrawerProps {
  open: boolean;
  onClose: () => void;
  sellId: number | null;
  selectedRequesterSell: SellInfoDto | null;
  onRequesterSellSelect: (sell: SellInfoDto | null) => void;
}

const ExchangeAcceptDrawer: React.FC<ExchangeAcceptDrawerProps> = React.memo(({ 
  open, 
  onClose, 
  sellId, 
  selectedRequesterSell, 
  onRequesterSellSelect 
}) => {
  const [selectedExchange, setSelectedExchange] = useState<RequestedGetDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && sellId !== null) {
      fetchExchangeRequest(sellId);
    }
  }, [open, sellId]);

  const fetchExchangeRequest = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://localhost:7103/api/Requests/${id}`, {
        withCredentials: true
      });
      setSelectedExchange(response.data);
    } catch (error) {
      console.error('交換リクエストデータの取得に失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExchangeConfirm = async () => {
    if (selectedRequesterSell === null) return;
    console.log(`交換確認: ResponderSellId=${selectedExchange?.responderSellId}, RequesterSellId=${selectedRequesterSell.sellId}`);
    onClose();
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
          maxHeight: '90%',
          width: '100%',
          maxWidth: '640px',
          margin: 'auto',
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          交換を受け入れる
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : selectedExchange ? (
          <>
            <Card sx={{ mb: 3, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <CardActionArea onClick={() => navigateToItemDetail(selectedExchange.responderSellId)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 2,
                      m: 2,
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
              <CompareArrowsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
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
                mr: '-24px', // Drawerの右側のパディングを相殺
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
                    }}
                  >
                          <CardActionArea 
                            onClick={() => onRequesterSellSelect(sell)}
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
                                {sell.title}
                              </Typography>
                            </CardContent>
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
                      </Box>
                    </Box>
          </Box>
        <Box 
          sx={{ 
            mb: 3, 
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleExchangeConfirm}
              disabled={selectedRequesterSell === null}
              fullWidth
              sx={{ mt: 2, py: 1.5, borderRadius: 2 }}
            >
              交換を確定
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