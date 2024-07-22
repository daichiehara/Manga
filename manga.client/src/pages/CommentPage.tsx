import { useParams, useNavigate } from 'react-router-dom';
import CustomToolbar from '../components/common/CustumToolbar';
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';
import { Box, TextField, Button, Card, CardContent, Typography, Avatar } from '@mui/material';

// APIレスポンスの型定義
interface ReplyDto {
  replyId: number;
  message: string | null;
  created: string;
  nickName: string | null;
  profileIcon: string | null;
  isDeleted: boolean;
}

interface ReplyForSellDto {
  replies: ReplyDto[];
  isCurrentUserSeller: boolean;
}

const Comment: React.FC<{ reply: ReplyDto }> = React.memo(({ reply }) => (
  <Card style={{ marginTop: '1rem' }}>
    <CardContent>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={reply.profileIcon || undefined} />
        <Typography variant="h6" style={{ marginLeft: '0.5rem' }}>
          {reply.nickName || '削除されたユーザー'}
        </Typography>
      </div>
      <Typography variant="body1">{reply.message || 'このコメントは削除されました。'}</Typography>
      <Typography variant="caption" color="textSecondary">
        {new Date(reply.created).toLocaleString()}
      </Typography>
    </CardContent>
  </Card>
));

const CommentPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 前のページに戻る
  };

  // AuthContextから認証状態を安全に取得
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext ? authContext.authState.isAuthenticated : false;

  const [replies, setReplies] = useState<ReplyDto[]>([]); // 取得したコメントを保持するステート
  const [newReply, setNewReply] = useState<string>(''); // 新しいコメントの内容を保持するステート
  const [isCurrentUserSeller, setIsCurrentUserSeller] = useState<boolean>(false); // 現在のユーザーが出品者かどうかを保持するステート
  const { sellId } = useParams(); // sellIdをルートパラメータから取得

  // コンポーネントがマウントされた時にコメントを取得する
  useEffect(() => {
    if (sellId) {
      fetchReplies();
    }
  }, [sellId]);

  // APIからコメントを取得する関数（useCallbackを使用して再生成を防ぐ）
  const fetchReplies = useCallback(async () => {
    try {
      const response = await axios.get<ReplyForSellDto>(`https://localhost:7103/api/replies/${sellId}`, {
        withCredentials: true, // クロスオリジンリクエストにクッキーを含める
      });
      setReplies(response.data.replies || []); // 取得したデータが存在しない場合に空配列をセット
      setIsCurrentUserSeller(response.data.isCurrentUserSeller);
    } catch (error) {
      console.error('Error fetching replies:', error);
      setReplies([]); // エラー時に空配列をセット
    }
  }, [sellId]);

  // 新しいコメントを投稿する関数（useCallbackを使用して再生成を防ぐ）
  const handlePostReply = useCallback(async () => {
    const parsedSellId = parseInt(sellId!, 10);

    if (isNaN(parsedSellId)) {
      console.error('Invalid SellId');
      return;
    }

    if (!newReply.trim()) {
      console.error('Message cannot be empty');
      return;
    }

    try {
      await axios.post('https://localhost:7103/api/replies', { sellId: parsedSellId, message: newReply }, {
        withCredentials: true, // クロスオリジンリクエストにクッキーを含める
      });
      setNewReply(''); // コメントを投稿した後に入力フィールドをリセット
      fetchReplies(); // コメントを再取得してリストを更新
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  }, [newReply, sellId, fetchReplies]);

  // コメントリストのメモ化
  const renderedReplies = useMemo(() => (
    replies.map((reply) => <Comment key={reply.replyId} reply={reply} />)
  ), [replies]);

  return (
    <>
      {/* 見出しのToolbar */}
      <CustomToolbar title="コメント" />

      {/* コメントの表示 */}
      <div>
        {renderedReplies}
      </div>

      {/* コメント入力 */}
      <Box sx={{ p: '1rem' }}>
        {isAuthenticated ? (
          <Box sx={{ mt: '4rem' }}>
            <TextField
              label="コメントを追加"
              multiline
              rows={4}
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              variant="outlined"
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handlePostReply}
              disabled={!newReply.trim()} // 入力フィールドが空の場合はボタンを無効にする
              style={{ marginTop: '1rem' }}
            >
              コメントを投稿
            </Button>
          </Box>
        ) : (
          <Typography variant="body1" color="textSecondary">
            コメントを投稿するにはログインしてください。
          </Typography>
        )}
      </Box>
    </>
  );
};

export default CommentPage;
