import { Typography, Grid, Avatar, Stack } from '@mui/material';
import { Link } from "react-router-dom";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

interface SellerInfoProps {
  userId: string;
  profileIcon: string;
  userName: string;
  hasIdVerificationImage: boolean;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ userId, profileIcon, userName, hasIdVerificationImage }) => {
  return (
    <Grid container alignItems="center"  sx={{ mt: 1 }}>
      <Link to={`/profile/${userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Avatar とユーザー名と本人確認の縦並び */}
        <Grid item>
          <Stack direction="column" alignItems="center">
            {/* Avatar とユーザー名の横並び */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={profileIcon} alt={userName} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {userName}
              </Typography>
            </Stack>

            {/* 本人確認アイコンとテキスト */}
            {hasIdVerificationImage ? (
              <Stack direction='row' alignItems="center" spacing={0}>
                <VerifiedUserIcon color="primary" sx={{ fontSize: '1.2rem' , ml:'82px', mr:'4px'}} />
                <Typography variant="body2" sx={{ color: 'black' }}>
                  本人確認済
                </Typography>
              </Stack>
            ) : (
              <Stack direction="row"  alignItems="center">
                <VerifiedUserOutlinedIcon color="disabled" sx={{ fontSize: '1.2rem' , ml:'82px', mr:'4px'}} />
                <Typography variant="body2" sx={{ color: 'black' }}>
                  本人確認前
                </Typography>
              </Stack>
            )}
          </Stack>
        </Grid>
       </Link> 
    </Grid>
  );
};

export default SellerInfo;
