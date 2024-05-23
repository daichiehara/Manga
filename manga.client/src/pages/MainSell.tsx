import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import CustomToolbar from '../components/common/CustumToolbar';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
  InputLabel,
  FormControl,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

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
  const { control, handleSubmit } = useForm<FormData>();
  const [selectedBookState, setSelectedBookState] = useState<number | null>(null);
  const [selectedSendDay, setSelectedSendDay] = useState<number | null>(null);

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

  const onSubmit = (data: FormData) => {
    // フォームの送信処理
    console.log(data);
  };

  return (
    <>
        <CustomToolbar title='出品情報を入力' />
            <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container sx={{pt: '6rem', px: 2}}>
                <Grid item xs={12} mb={2} >
                    <Controller
                    name="sellImages"
                    control={control}
                    defaultValue={null}
                    rules={{ required: '商品画像は必須です' }}
                    render={({ field: { onChange, onBlur, ref }, fieldState: { error } }) => (
                        <Box>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(event) => {
                            onChange(event.target.files);
                            }}
                            onBlur={onBlur}
                            ref={ref}
                        />
                        {error && <Typography color="error">{error.message}</Typography>}
                        </Box>
                    )}
                    />
                </Grid>
                <Grid item xs={12} mb={2}>
                <Typography variant='body2' fontWeight={'bold'} color={'secondary'} mb={1}>作品タイトル</Typography>
                <Controller
                    name="title"
                    control={control}
                    defaultValue=""
                    rules={{ required: '作品タイトルを入力してください' }}
                    render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        //label="作品タイトル"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                        placeholder='例) サザエさん'
                    />
                    )}
                />
                </Grid>
                <Grid item xs={12} mb={2}>
                <Typography variant='body2' fontWeight={'bold'} color={'secondary'} mb={1}>巻数</Typography>
                <Controller
                    name="numberOfBooks"
                    control={control}
                    //defaultValue={}
                    rules={{
                    required: '巻数は必須です',
                    min: { value: 1, message: '1以上の値を入力してください' },
                    }}
                    render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        //label="全巻巻数"
                        fullWidth
                        type="number"
                        error={!!error}
                        helperText={error?.message}
                        placeholder='例) 42'
                    />
                    )}
                />
                    <Box sx={{ mb: 2, mt: 2, color: 'error.main'}}>
                        <Typography variant='body2'>確認事項</Typography>
                        <List sx={{ listStyleType: 'decimal', pl: 3, py: 0 }}>
                            <ListItem sx={{ display: 'list-item', px: 0 }}>
                                <ListItemText primary="出品には、その作品の発売済みの全巻が必要です。" primaryTypographyProps={{ variant: 'body2' }} />
                            </ListItem>
                            <ListItem sx={{ display: 'list-item', px: 0 }}>
                                <ListItemText primary="不足している巻がないことを確認してください。" primaryTypographyProps={{ variant: 'body2' }} />
                            </ListItem>
                        </List>
                    </Box>
                </Grid>
                <Grid item xs={12} mb={2}>
                <Controller
                    name="bookState"
                    control={control}
                    defaultValue={null}
                    rules={{ required: '商品の状態を選択してください' }}
                    render={({ field, fieldState: { error } }) => (
                    <Box>
                        <Typography variant='body2' fontWeight={'bold'} color={'secondary'} mb={1}>商品の状態</Typography>
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
                            variant='outlined'
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
                <Typography variant='body2' fontWeight={'bold'} color={'secondary'} mb={1}>商品の説明</Typography>
                <Controller
                    name="sellMessage"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                    <TextField {...field} fullWidth multiline rows={4} placeholder='例) 商品の説明です。' />
                    )}
                />
                </Grid>
                <Grid item xs={12} mb={2}>
                    <hr />
                </Grid>
                <Grid item xs={12} mb={2}>
                    <Typography fontWeight={'bold'} mb={2}>配送について</Typography>
                    <Typography variant='body2' fontWeight={'bold'} color={'secondary'} mb={1}>配送元の地域</Typography>
                    <Controller
                    name="sendPrefecture"
                    control={control}
                    defaultValue={0}
                    rules={{
                        validate: (value) => {
                        if (value === 0) {
                            return '発送元の地域を選択してください';
                        }
                        return true;
                        },
                    }}
                    render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth error={!!error}>
                        <Select {...field} MenuProps={{ disableScrollLock: true }}>
                            {prefectures.map((prefecture) => (
                            <MenuItem key={prefecture.value} value={prefecture.value}>
                                {prefecture.label}
                            </MenuItem>
                            ))}
                        </Select>
                        {error && <Typography color="error">{error.message}</Typography>}
                        </FormControl>
                    )}
                    />
                </Grid>
                <Grid item xs={12} mb={2}>
                <Controller
                    name="sendDay"
                    control={control}
                    defaultValue={null}
                    rules={{ required: '発送までの日数を選択してください' }}
                    render={({ field, fieldState: { error } }) => (
                    <Box>
                        <Typography variant='body2' fontWeight={'bold'} color={'secondary'} mb={1}>発送までの日数</Typography>
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
                            variant='outlined'
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
                    <Button type="submit" variant="contained" color="primary" fullWidth size='large'>
                        出品する
                    </Button>
                </Grid>
                <Grid item xs={12} mb={2}>
                    <Button type="submit" variant="outlined" color="primary" fullWidth >
                        下書きに保存
                    </Button>
                </Grid>
            </Grid>
            </form>
    </>
    );
};

export default SellForm;