import type React from "react"
import { ThemeProvider } from "@mui/material/styles"
import { Container, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Box, Divider } from "@mui/material"
import { EmojiEvents, HowToVote, DateRange, Announcement, Warning, ContactSupport } from "@mui/icons-material"
import CustomToolbar from '../components/common/CustumToolbar';
import Img1 from '../assets/images/present_campain_yellow.webp';
import Img2 from '../assets/images/Campaign_share_button.webp';
import Img3 from '../assets/images/Campaign_wantList.webp';

const CampaignPage: React.FC = () => {
  return (
    <>
      <CustomToolbar title='キャンペーン' />
      <Box sx={{ pt: { xs: '3.5rem', sm: '4rem' }, pb: 2, backgroundColor: '#FFF3E0' }}>
          <img
              src={Img1}
              alt="Id Verification"
              style={{ maxWidth: '100%' }}
          />
      </Box>
      <Container maxWidth="md" sx={{ pb: 4, backgroundColor: '#FFF3E0' }}>
        <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 4 }}>
          <Box my={4}>
            <Typography variant="h6" gutterBottom fontWeight={"bold"}>
              キャンペーン内容
            </Typography>
            <Typography variant="body1">欲しい漫画全巻セットを抽選でプレゼント！</Typography>
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 4 }}>
          <Box my={4}>
            <Typography variant="h6" gutterBottom fontWeight={"bold"}>
              参加方法
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <HowToVote />
                </ListItemIcon>
                <ListItemText primary="1. トカエルに漫画を出品する" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <HowToVote />
                </ListItemIcon>
                <ListItemText primary="2. 自分の出品の共有ボタンから「X(旧Twitter)」に共有する" />
              </ListItem>
              <img src={Img2} alt="説明画像" style={{ width: '50%', marginTop: '16px', display: 'block', margin: '0 auto' }} />
            </List>
            <Typography variant="body2" color="text.secondary">
              ※両方の条件を満たした方が対象となります
            </Typography>
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 4 }}>
          <Box my={4}>
            <Typography variant="h6" gutterBottom fontWeight={"bold"}>
              賞品
            </Typography>
            <Typography variant="body1" sx={{mb: 2}}>欲しい漫画リストに登録されている漫画をプレゼントします。</Typography>
            <img src={Img3} alt="説明画像" style={{ width: '50%', marginTop: '16px', display: 'block', margin: '0 auto' }} />
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 4 }}>
          <Box my={4}>
            <Typography variant="h6" gutterBottom fontWeight={"bold"}>
              応募期間
            </Typography>
            <Typography variant="body1">2025年2月2日〜2025年2月28日</Typography>
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 4 }}>
          <Box my={4}>
            <Typography variant="h6" gutterBottom fontWeight={"bold"}>
              当選発表
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <HowToVote />
                </ListItemIcon>
                <ListItemText primary="当選者の発表は、当選者へのメールをもって代えさせていただきます" />
              </ListItem>
            </List>
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 4 }}>
          <Box my={4}>
            <Typography variant="h6" gutterBottom fontWeight={"bold"}>
              注意事項
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Warning />
                </ListItemIcon>
                <ListItemText primary="漫画は新品または中古で、定価30,000円相当までとさせていただきます" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Warning />
                </ListItemIcon>
                <ListItemText primary="当選者には賞品をアプリ内に登録された住所にお送りいたします" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Warning />
                </ListItemIcon>
                <ListItemText primary="賞品の交換、返品、返金はできません" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Warning />
                </ListItemIcon>
                <ListItemText primary="その他キャンペーンに関するご質問はアプリ内の「ヘルプ・お問い合わせ」で承ります" />
              </ListItem>
            </List>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default CampaignPage;
