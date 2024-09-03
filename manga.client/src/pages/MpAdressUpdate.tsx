// MpAdressUpadate

import React, { useEffect, useState, useContext } from 'react';
import { Typography, Box, Grid, Divider, TextField, Button, CircularProgress, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CustomToolbar from '../components/common/CustumToolbar';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { useCustomNavigate } from '../hooks/useCustomNavigate';
import { SnackbarContext } from '../components/context/SnackbarContext';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';
import { API_BASE_URL } from '../apiName';

interface ChangeAddressDto {
  sei: string;
  mei: string;
  postalCode: string;
  prefecture: string;
  address1: string;
  address2: string;
}

const MpAdressUpdate: React.FC = () => {

  window.scrollTo({top:0, behavior: "instant"});
  const { control, handleSubmit, reset, getValues, setValue } = useForm<ChangeAddressDto>({
    defaultValues: {
      sei: '',
      mei: '',
      postalCode: '',
      prefecture: '',
      address1: '',
      address2: '',
    },
  });
  const prefectures = [
    '北海道', '青森県', '岩手県', '宮城県', '秋田県', 
    '山形県', '福島県', '茨城県', '栃木県', '群馬県', 
    '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', 
    '富山県', '石川県', '福井県', '山梨県', '長野県', 
    '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', 
    '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', 
    '鳥取県', '島根県', '岡山県', '広島県', '山口県', 
    '徳島県', '香川県', '愛媛県', '高知県', '福岡県', 
    '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', 
    '鹿児島県', '沖縄県'
  ];

  const [postalCodeError, setPostalCodeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const customNavigate = useCustomNavigate();
  const { showSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get<ChangeAddressDto>(`${API_BASE_URL}/Users/GetAddress`, {
          withCredentials: true,
        });
        const { sei, mei, postalCode, prefecture, address1, address2 } = response.data;
        reset({
          sei: sei ?? '',
          mei: mei ?? '',
          postalCode: postalCode ?? '',
          prefecture: prefecture ?? '',
          address1: address1 ?? '',
          address2: address2 ?? '',
        });
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };

    fetchAddress();
  }, [reset]);

  const handleAutoFillAddress = async () => {
    setIsAutoFilling(true);
    setPostalCodeError('');
    const postalCode = getValues('postalCode');
    if (postalCode) {
      const halfWidthPostalCode = postalCode.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      );
      const formattedPostalCode = halfWidthPostalCode.replace(/[^0-9]/g, '');
      if (formattedPostalCode.length === 7) {
        try {
          const response = await axios.get(
            `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${formattedPostalCode}`
          );
          if (response.data.status === 200 && response.data.results) {
            const { address1, address2, address3 } = response.data.results[0];
            setValue('prefecture', address1);
            setValue('address1', address2 + address3);
            setValue('postalCode', formattedPostalCode);
          } else {
            setPostalCodeError('無効な郵便番号です');
          }
        } catch (error) {
          console.error('Error fetching address:', error);
          setPostalCodeError('住所の取得中にエラーが発生しました');
        }
      } else {
        setPostalCodeError('郵便番号は7桁の数字で入力してください');
      }
    }
    setIsAutoFilling(false);
  };

  const onSubmit = async (data: ChangeAddressDto) => {
    // 郵便番号を半角にして数字を取り出す
    const postalCode = data.postalCode;
    const halfWidthPostalCode = postalCode.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    );
    const formattedPostalCode = halfWidthPostalCode.replace(/[^0-9]/g, '');
    setValue('postalCode', formattedPostalCode);

    // 確認ダイアログを開く
    setIsConfirmationOpen(true);
  };
  const handleConfirmSubmit = async () => {
    setIsLoading(true);
    setIsConfirmationOpen(false);

    const data = getValues();
    const formattedPostalCode = data.postalCode.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    ).replace(/[^0-9]/g, '');

    try {
      await axios.put(`${API_BASE_URL}/Users/UpdateAddress`, {
        ...data,
        postalCode: formattedPostalCode,
      }, {
        withCredentials: true,
      });
      console.log('更新されました。');
      customNavigate();
      showSnackbar('正常に更新されました。', 'success');
    } catch (error) {
      console.error('Error updating address:', error);
      showSnackbar('更新に失敗しました。', 'error');
    }

    setIsLoading(false);
  };

  const handleConfirmCancel = () => {
    setIsConfirmationOpen(false);
  };

  const description = `[${SERVICE_NAME}] 住所の登録・更新を行います。`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{SERVICE_NAME} - 住所の登録・更新</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${SERVICE_NAME} - 住所の登録・更新`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${SERVICE_NAME} - 住所の登録・更新`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
      </Helmet>
      <CustomToolbar title='住所の登録・更新' />
      <Box pt={11} px={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='sei'
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField {...field} label='姓' fullWidth required />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='mei'
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField {...field} label='名' fullWidth required />
                )}
              />
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid container spacing={2} px={2} mt={1} alignItems="center">
              <Grid item xs={8}>
                <Controller
                  name='postalCode'
                  control={control}
                  defaultValue=''
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField {...field} label='郵便番号' fullWidth required />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
              <Button variant='contained' color='secondary' onClick={handleAutoFillAddress} disabled={isAutoFilling}>
                {isAutoFilling ? (
                  <CircularProgress size={24}/>
                ) : (
                  '自動入力'
                )}
              </Button>
              </Grid>
            </Grid>
            <Typography variant='body2' color="error" px={2} mt={1}>
              {postalCodeError}
            </Typography>
            <Grid item xs={12}>
              <Controller
                name='prefecture'
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field }) => (
                  <Select {...field} fullWidth required>
                    {prefectures.map((prefecture) => (
                      <MenuItem key={prefecture} value={prefecture}>
                        {prefecture}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='address1'
                control={control}
                defaultValue=''
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField {...field} label='市区町村・地名・丁目・番地' fullWidth required />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='address2'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField {...field} label='建物名・部屋番号など' fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" size='large' fullWidth disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : '更新する'}
            </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Dialog open={isConfirmationOpen} onClose={handleConfirmCancel} disableScrollLock>
      <DialogTitle>確認</DialogTitle>
      <DialogContent>
        <Typography>以下の内容で登録します。よろしいですか？</Typography>
        <Box mt={2}>
          <Typography>姓 : {getValues('sei')}</Typography>
          <Typography>名 : {getValues('mei')}</Typography>
          <Typography>郵便番号 : {getValues('postalCode')}</Typography>
          <Typography>都道府県 : {getValues('prefecture')}</Typography>
          <Typography>住所1 : {getValues('address1')}</Typography>
          <Typography>住所2 : {getValues('address2')}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirmCancel} color="primary">
          キャンセル
        </Button>
        <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
          登録
        </Button>
      </DialogActions>
    </Dialog>
    </HelmetProvider>
  );
};

export default MpAdressUpdate;