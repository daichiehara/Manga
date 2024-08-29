import { useParams } from 'react-router-dom';
import CustomToolbar from '../components/common/CustumToolbar';
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/context/AuthContext';
import { Box, TextField, Button, Divider, Typography } from '@mui/material';
import CommentList from '../components/comment/CommentList';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';

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

const CommentPage: React.FC = () => {
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

  const description = `[トカエル]このページでは、出品された漫画に対するコメントを閲覧・投稿できます。`;


  return (
    <HelmetProvider>
      <Helmet>
        <title>コメントページ - {SERVICE_NAME}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content="コメントページ" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="コメントページ" />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://manga-img-bucket.s3.ap-northeast-1.amazonaws.com/TocaeruLogo.webp" />
      </Helmet>
      {/* 見出しのToolbar */}
      <CustomToolbar title="コメント" />
      <Box sx={{ pt: '4rem' }}>
        {/* 注意事項 */}
        <Typography sx={{ fontSize:'0.7rem', p:'1rem', pt:'0.5rem', }}>
          相手のことを考え丁重なコメントを心がけましょう。不快な言葉づかいなどは利用制限や退会処分となることがあります。
        </Typography>
        <Divider />
        {/* コメントの表示 */}
        <CommentList replies={replies} />

        {/* コメント入力 */}
        <Box sx={{ position: 'fixed', bottom: 0, width: '100%',maxWidth: '640px', px: '0.7rem', py: '0.5rem', bgcolor: 'background.paper', justifyContent: 'center', alignItems: 'center',boxSizing: 'border-box', }}>
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%', maxWidth: '640px', boxSizing: 'border-box' }}>
              <TextField
                placeholder="コメントをする" // ここでlabelではなく、placeholderを使うと良い。
                multiline
                maxRows={4}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                variant="outlined"
                sx={{ flex: 1, mr: '0.7rem' }}
                size="medium"
                InputLabelProps={{
                  shrink: false,
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handlePostReply}
                disabled={!newReply.trim()}
                sx={{ height:'2.5rem', alignSelf: 'flex-end' }}
              >
                送信
              </Button>
            </Box>
          ) : (
            <Typography variant="body1" color="textSecondary">
              コメントを投稿するにはログインしてください。
            </Typography>
          )}
        </Box>
      </Box>
    </HelmetProvider>
  );
};

export default CommentPage;
