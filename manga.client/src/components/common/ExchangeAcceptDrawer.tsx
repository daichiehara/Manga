import React, { useState, useEffect, MouseEvent } from 'react';
import { SwipeableDrawer, Box, Typography, Button, CircularProgress, Card, CardContent, CardMedia, CardActionArea, Chip, IconButton } from '@mui/material';
import axios from 'axios';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
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
}

const ExchangeAcceptDrawer: React.FC<ExchangeAcceptDrawerProps> = ({ open, onClose, sellId }) => {
  const [selectedExchange, setSelectedExchange] = useState<RequestedGetDto | null>(null);
  const [selectedRequesterSell, setSelectedRequesterSell] = useState<SellInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  

  useEffect(() => {
    if (open && sellId !== null) {
      setSelectedRequesterSell(null); // Drawerが開かれるたびに選択をリセット
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

  const handleRequesterSellSelect = (sell: SellInfoDto) => {
    setSelectedRequesterSell(sell);
  };

  const handleExchangeConfirm = async () => {
    if (selectedRequesterSell === null) return;
    // ここで交換確認のAPIを呼び出す
    console.log(`交換確認: ResponderSellId=${selectedExchange?.responderSellId}, RequesterSellId=${selectedRequesterSell.sellId}`);
    onClose();
  };

  const navigateToItemDetail = (itemId: number, event?: MouseEvent<HTMLButtonElement>) => {
    if (event) {
      event.stopPropagation();
    }
    navigate(`/item/${itemId}`);
    onClose();
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={() => {
        setSelectedRequesterSell(null); // Drawerが閉じられるときも選択をリセット
        onClose();
      }}
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
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                      {selectedExchange.responderSellTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      あなたの出品
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
                display: 'flex',
                overflow: 'auto',
                mb: 3,
                pb: 2, // スクロールバー用の余白
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                {selectedExchange.requesterSells.map((sell) => (
                  <Card 
                    key={sell.sellId} 
                    sx={{ 
                      width: 150,
                      flexShrink: 0, // カードのサイズを固定
                      border: selectedRequesterSell?.sellId === sell.sellId ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                      position: 'relative'
                    }}
                  >
                    <CardActionArea onClick={() => handleRequesterSellSelect(sell)}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={sell.imageUrl}
                        alt={sell.title}
                      />
                      <CardContent>
                        <Typography variant="body2" component="div" noWrap>
                          {sell.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(255,255,255,0.7)' }}
                      onClick={(e) => navigateToItemDetail(sell.sellId, e)}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Card>
                ))}
              </Box>
            </Box>
            {selectedRequesterSell && (
              <Chip 
                label={`選択中: ${selectedRequesterSell.title}`}
                color="primary"
                onDelete={() => setSelectedRequesterSell(null)}
                sx={{ mb: 3 }}
              />
            )}
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
};

export default ExchangeAcceptDrawer;