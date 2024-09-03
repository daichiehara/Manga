import React, { useState, useCallback } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from '../../hooks/useSnackbar';
import CheckModal from './CheckModal';
import { API_BASE_URL } from '../../apiName';

enum ReportType {
  Sell = 1,
  Reply = 2,
}

interface ReportDialogProps {
  id: number; // 通報対象のID (出品 or コメント)
  reportType: ReportType; // 通報の種類 ('Sell' or 'Reply')
  open: boolean; // モーダルの開閉状態
  onClose: () => void; // モーダルを閉じるための関数
}

const ReportDialog: React.FC<ReportDialogProps> = ({ id, reportType, open, onClose }) => {
  const [message, setMessage] = useState('');
  const [checkModalOpen, setCheckModalOpen] = useState(false); // CheckModalの状態
  const [loading, setLoading] = useState(false); // ローディング状態
  const showSnackbar = useSnackbar();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value.slice(0, 400));
  }, []);

  const handleSubmit = useCallback(() => {
    // 通報を送信する前に確認用モーダルを開く
    setCheckModalOpen(true);
  }, []);

  const handleConfirmReport = useCallback(async () => {
    setLoading(true); // ローディング状態を開始
    try {
      const response = await axios.post(`${API_BASE_URL}/Reports/Report`, {
        id,
        message,
        reportType,
      }, { withCredentials: true });

      if (response.status !== 200) {
        throw new Error('通報に失敗しました');
      }

      showSnackbar('通報が正常に送信されました', 'success');
      setCheckModalOpen(false); // 確認モーダルを閉じる
      onClose(); // 通報ダイアログも閉じる
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('Validation Error: ', error.response.data); // エラーメッセージをログに出力
      } else {
        console.log('An unexpected error occurred:', error);
      }
      showSnackbar('通報の送信に失敗しました', 'error');
    } finally {
      setLoading(false); // ローディング状態を終了
    }
  }, [id, message, reportType, showSnackbar, onClose]);

  const handleCancelReport = () => {
    setCheckModalOpen(false); // 確認モーダルを閉じる
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{reportType === ReportType.Sell ? '出品を通報' : 'コメントを通報'}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            通報の理由を400文字以内で入力してください。
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            minRows={3}
            value={message}
            onChange={handleChange}
            placeholder="通報の理由を記入してください..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" disabled={loading}>
            キャンセル
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={!message.trim() || loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : '送信'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 確認用のCheckModal */}
      <CheckModal
        open={checkModalOpen}
        onClose={handleCancelReport}
        questionText="この通報を送信しますか？"
        agreeText={loading ? <CircularProgress size={24} color="inherit" /> : '送信'}
        onAgree={handleConfirmReport} // 実際に通報を送信する
      >
        <Typography variant="body2" color="textSecondary">
          通報内容が送信されると、取り消すことはできません。
        </Typography>
      </CheckModal>
    </>
  );
};

export default ReportDialog;
