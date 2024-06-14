import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import CustomToolbar from '../components/common/CustumToolbar';
import ImageList from '../components/common/SellImageList';
import BookAutocomplete from '../components/common/BookAutocomplete';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
  FormControl,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
  AlertTitle,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../components/common/LoadingComponent';

import { prefectures } from '../components/common/Prefectures';

interface FormData {
  title: string;
  sendPrefecture: number;
  sendDay: number | null;
  bookState: number | null;
  numberOfBooks: number;
  sellMessage: string;
  sellStatus: number;
  sellImages: FileList | null;
}

const SellForm: React.FC = () => {
  const { control, handleSubmit, setError, clearErrors, setValue } = useForm<FormData>();
  const [selectedBookState, setSelectedBookState] = useState<number | null>(null);
  const [selectedSendDay, setSelectedSendDay] = useState<number | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const isDraftRef = useRef<boolean>(false);
  const [sellImageError, setSellImageError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSellLoading, setIsSellLoading] = useState(false);
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { sellId } = useParams<{ sellId?: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draftData, setDraftData] = useState<any>(null);

  const handleCapturedImagesChange = (images: string[]) => {
    setCapturedImages(images);
  };

  const sendDayOptions = [
    { label: '1～2日で発送', value: 1 },
    { label: '2～3日で発送', value: 2 },
    { label: '4～7日で発送', value: 3 },
  ];

  const bookStateOptions = [
    { label: '新品、未使用', value: 1 },
    { label: '未使用に近い', value: 2 },
    { label: '目立った傷や汚れなし', value: 3 },
    { label: 'やや傷や汚れあり', value: 4 },
    { label: '傷や汚れあり', value: 5 },
  ];

  const handleBookStateChange = (value: number) => {
    setSelectedBookState(value);
  };

  const handleSendDayChange = (value: number) => {
    setSelectedSendDay(value);
  };

  const validateForm = (data: FormData) => {
    clearErrors();
    setSellImageError('');
    if (isDraftRef.current) {
      return true;
    }

    let isValid = true;
    const validationErrors: { name: keyof FormData; type: string; message: string }[] = [];

    if (!data.title) {
      validationErrors.push({ name: 'title', type: 'required', message: '作品タイトルを入力してください' });
    }

    if (!data.numberOfBooks || data.numberOfBooks < 1) {
      validationErrors.push({ name: 'numberOfBooks', type: 'min', message: '1以上の値を入力してください' });
    }

    if (!data.bookState) {
      validationErrors.push({ name: 'bookState', type: 'required', message: '商品の状態を選択してください' });
    }

    if (!data.sellMessage) {
        validationErrors.push({ name: 'sellMessage', type: 'required', message: '商品の説明を入力してください' });
    }

    if (!data.sendPrefecture || data.sendPrefecture === 0) {
      validationErrors.push({ name: 'sendPrefecture', type: 'validate', message: '発送元の地域を選択してください' });
    }

    if (!data.sendDay) {
      validationErrors.push({ name: 'sendDay', type: 'required', message: '発送までの日数を選択してください' });
    }

    if (capturedImages.length === 0) {
        setSellImageError('少なくとも1枚の画像を追加してください');
    }

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => setError(error.name, { type: error.type, message: error.message }));
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (data: FormData) => {
    if (!validateForm(data)) {
      setIsLoading(false);
      setIsSellLoading(false);
      setIsDraftLoading(false);
      return;
    }
  
    const sellImages = await Promise.all(
      capturedImages.map(async (image, index) => {
        if (image.startsWith('http')) {
          // 既存の画像の場合
          return {
            imageUrl: image,
            order: index + 1,
          };
        } else {
          // 新しい画像の場合
          const response = await fetch(image);
          const blob = await response.blob();
          return {
            imageBlob: new File([blob], `image${index}.webp`, { type: 'image/webp' }),
            order: index + 1,
          };
        }
      })
    );
  
    const formData = new FormData();
    formData.append('title', data.title || ''); // Optional field
    if (data.sendPrefecture !== 0) {
        formData.append('sendPrefecture', data.sendPrefecture?.toString() || ''); // Optional field
    }
    formData.append('sendDay', data.sendDay?.toString() || ''); // Optional field
    formData.append('bookState', data.bookState?.toString() || ''); // Optional field
    formData.append('numberOfBooks', data.numberOfBooks?.toString() || ''); // Optional field
    formData.append('sellMessage', data.sellMessage || ''); // Optional field
    formData.append('sellStatus', data.sellStatus.toString()); // Required field
  
    sellImages.forEach((image, index) => {
      if (image.imageBlob) {
        formData.append(`sellImages[${index}].ImageBlob`, image.imageBlob);
      }
      if (image.imageUrl) {
        formData.append(`sellImages[${index}].ImageUrl`, image.imageUrl);
      }
      formData.append(`sellImages[${index}].Order`, image.order.toString());
    });
  
    // デバッグ用: フォームデータの内容を出力
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  
    try {
      const url = sellId
        ? `https://localhost:7103/api/Sells/${sellId}`
        : 'https://localhost:7103/api/Sells';
      const method = sellId ? 'put' : 'post';

      const response = await axios[method](url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
    
      console.log('Form submitted successfully:', response.data);

      let snackMessage = '';

      if (!sellId) {
        snackMessage = '下書きに保存されました。';
      } else {
        if (response.data.status === 2) {
          if (draftData?.sellStatus !== 2) {
            snackMessage = '出品を非公開にしました。';
          } else {
            snackMessage = '変更を保存しました。'
          }
        } else if (response.data.status === 4) {
          snackMessage = '変更を保存しました。';
        }
      }
    
      if (response.data.status === 1) {
        navigate(`/item/${response.data.id}`, { state: { snackOpen: true, snackMessage: '出品に成功しました。' } });
      } else if (response.data.status === 2 || response.data.status === 4) {
        navigate('/main-sell', { state: { snackOpen: true, snackMessage } });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error submitting form:', error.response?.data);
      } else {
        console.error('Error submitting form:', error);
      }
    }
  };
  
  useEffect(() => {
    if(!sellId) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isDraft) {
      setIsLoading(true);
      setIsDraftLoading(true);
      
      if (draftData?.sellStatus === 2) {
        handleSubmit((data) => onSubmit({ ...data, sellStatus: 2 }))();
      } else if (draftData?.sellStatus === 1){
        handleSubmit((data) => onSubmit({ ...data, sellStatus: 2 }))();
      } else {
        handleSubmit((data) => onSubmit({ ...data, sellStatus: 4 }))();
      }
    }
  }, [isDraft, handleSubmit]);

  useEffect(() => {
    setSellImageError('');
  }, [capturedImages]);

  const handleSaveAsDraft = () => {
    isDraftRef.current = true;
    setIsDraft(true);
  };

  const handleSell = () => {
    isDraftRef.current = false;
    setIsDraft(false);
    setIsLoading(true);
    setIsSellLoading(true);
    handleSubmit((data) => onSubmit({ ...data, sellStatus: 1 }))();
  };

  useEffect(() => {
    if (sellId) {
      fetchDraftData(parseInt(sellId, 10));
    }
  }, [sellId]);
  
  const fetchDraftData = async (sellId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://localhost:7103/api/Sells/EditDraft/${sellId}`, {
        withCredentials: true,
      });
      const data = response.data;
      setDraftData(data);
  
      if (data) {
        // フォームフィールドに下書きデータを設定
        setValue('title', data.title ?? '');
        setValue('sendPrefecture', data.sendPrefecture ?? 0);
        setValue('sendDay', data.sendDay ?? null);
        setValue('bookState', data.bookState ?? null);
        setSelectedBookState(data.bookState ?? null);
        setSelectedSendDay(data.sendDay ?? null);
        setValue('numberOfBooks', data.numberOfBooks ?? '');
        setValue('sellMessage', data.sellMessage ?? '');
        setValue('sellStatus', data.sellStatus);
  
        // 画像データの設定
        if (data.sellImages && data.sellImages.length > 0) {
          const imageUrls = data.sellImages.map((image: any) => image.imageUrl);
          setCapturedImages(imageUrls);
        }
      }
  
    } catch (error) {
      console.error('Error fetching draft data:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  const handleDeleteDraft = () => {
    setIsDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    setIsDialogOpen(false);
    try {
      setIsLoading(true);
      await axios.delete(`https://localhost:7103/api/Sells/${sellId}`, {
        withCredentials: true,
      });
      console.log('Draft deleted successfully');

      let snackMessage = '';
      if (draftData?.sellStatus === 4) {
        snackMessage = '下書きを削除しました。'
      } else {
        snackMessage = '出品を削除しました。'
      }
      navigate('/main-sell', { state: { snackOpen: true, snackMessage } });
    } catch (error) {
      console.error('Error deleting draft:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelDelete = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <CustomToolbar title="出品情報を入力" />
      {loading && <LoadingComponent />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ pt: '4rem', mb: 3 }}>
            <ImageList
                capturedImages={capturedImages}
                onCapturedImagesChange={handleCapturedImagesChange}
            />
            {sellImageError && (
                <Typography variant='body2' color="error" px={2}>
                    {sellImageError}
                </Typography>
            )}
        </Box>
        <Grid container sx={{ px: 2 }}>
          <Grid item xs={12} mb={2}>
            <Typography variant="body2" fontWeight={'bold'} color={'secondary'} mb={1}>
              作品タイトル
            </Typography>
            <Controller
    name="title"
    control={control}
    defaultValue=""
    render={({ field: { ref, onChange, value, ...rest }, fieldState: { error } }) => (
      <BookAutocomplete
        {...rest}
        inputValue={value}
        onInputChange={(_, newInputValue) => {
          onChange(newInputValue);
        }}
        error={!!error}
        helperText={error?.message}
      />
    )}
  />
          </Grid>
          <Grid item xs={12} mb={2}>
            <Typography variant="body2" fontWeight={'bold'} color={'secondary'} mb={1}>
              巻数
            </Typography>
            <Controller
            name="numberOfBooks"
            control={control}
            render={({ field: { ref, onChange, value, ...rest }, fieldState: { error } }) => (
              <>
                <TextField
                  {...rest}
                  inputRef={ref}
                  value={value ?? ''}
                  onChange={onChange}
                  fullWidth
                  type="number"
                  error={!!error}
                  placeholder="例) 42"
                />
                {error && <Typography color="error" variant="caption">{error.message}</Typography>}
              </>
            )}
          />
            <Alert severity="info" sx={{ mb: 2, mt: 2 }}>
              <AlertTitle sx={{ m: 0 }}>確認事項</AlertTitle>
              <List sx={{ listStyleType: 'decimal', pl: 2, py: 0 }}>
                <ListItem sx={{ display: 'list-item', px: 0, py: 0 }}>
                  <ListItemText
                    primary="出品には、その作品の発売済みの全巻が必要です。"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ display: 'list-item', px: 0, py: 0 }}>
                  <ListItemText
                    primary="不足している巻がないことを確認してください。"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </Alert>
          </Grid>
          <Grid item xs={12} mb={2}>
            <Controller
              name="bookState"
              control={control}
              defaultValue={null}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <Typography variant="body2" fontWeight={'bold'} color={'secondary'} mb={1}>
                    商品の状態
                  </Typography>
                  <Box>
                    {bookStateOptions.map((option) => (
                      <Chip
                        key={option.value}
                        label={option.label}
                        onClick={() => {
                          handleBookStateChange(option.value);
                          field.onChange(option.value);
                        }}
                        color={selectedBookState === option.value ? 'primary' : 'default'}
                        variant="outlined"
                        style={{ marginRight: 8, marginBottom: 8 }}
                      />
                    ))}
                  </Box>
                  {error && <Typography variant='body2' color="error">{error.message}</Typography>}
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12} mb={3}>
            <Typography variant="body2" fontWeight={'bold'} color={'secondary'} mb={1}>
              商品の説明
            </Typography>
            <Controller
              name="sellMessage"
              control={control}
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="例) 商品の説明です。"
                    error={!!error}
                    helperText={error ? error.message : ''}
                  />
                </>
              )}
            />
          </Grid>
          <Grid item xs={12} mb={2}>
            <Divider />
          </Grid>
          <Grid item xs={12} mb={2}>
            <Typography fontWeight={'bold'} mb={2}>
              配送について
            </Typography>
            <Typography variant="body2" fontWeight={'bold'} color={'secondary'} mb={1}>
              配送元の地域
            </Typography>
            <Controller
              name="sendPrefecture"
              control={control}
              defaultValue={0}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <Select {...field} MenuProps={{ disableScrollLock: true }}>
                    {prefectures.map((prefecture) => (
                      <MenuItem key={prefecture.value} value={prefecture.value}>
                        {prefecture.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {error && <Typography variant='body2' color="error">{error.message}</Typography>}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} mb={2}>
            <Controller
              name="sendDay"
              control={control}
              defaultValue={null}
              render={({ field, fieldState: { error } }) => (
                <Box>
                  <Typography variant="body2" fontWeight={'bold'} color={'secondary'} mb={1}>
                    発送までの日数
                  </Typography>
                  <Box>
                    {sendDayOptions.map((option) => (
                      <Chip
                        key={option.value}
                        label={option.label}
                        onClick={() => {
                          handleSendDayChange(option.value);
                          field.onChange(option.value);
                        }}
                        color={selectedSendDay === option.value ? 'primary' : 'default'}
                        variant="outlined"
                        style={{ marginRight: 8, marginBottom: 8 }}
                      />
                    ))}
                  </Box>
                  {error && <Typography color="error">{error.message}</Typography>}
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12} mb={3}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleSell}
              disabled={isLoading}
            >
              {isSellLoading ? <CircularProgress size={24} /> : 
              <>
                {!sellId && '出品する'}
                {draftData?.sellStatus === 1 && '変更する'}
                {draftData?.sellStatus === 2 && '出品を再開する'}
                {draftData?.sellStatus === 4 && '出品する'}
              </>}
            </Button>
          </Grid>
          <Grid item xs={12} mb={3}>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleSaveAsDraft}
              disabled={isLoading}
            >
              {isDraftLoading ? <CircularProgress size={24} /> : 
              <>
                {!sellId && '下書きに保存する'}
                {draftData?.sellStatus === 1 && 'この出品を非公開にする'}
                {draftData?.sellStatus === 2 && '変更する'}
                {draftData?.sellStatus === 4 && '上書き保存する'}
              </>}
            </Button>
          </Grid>
          {sellId && (
            <Grid item xs={12} mb={2}>
              <Button
                type="button"
                variant="text"
                color="error"
                fullWidth
                onClick={handleDeleteDraft}
                disabled={isLoading}
              >
                {draftData?.sellStatus === 4 ? 'この下書きを削除する' : 'この出品を削除する'}
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
      <Dialog open={isDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>{draftData?.sellStatus === 4 ? '下書きの削除' : '出品の削除'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {draftData?.sellStatus === 4 ? 'この下書きを削除しますか？' : 'この出品を削除しますか？'}
            この操作は元に戻せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SellForm;
