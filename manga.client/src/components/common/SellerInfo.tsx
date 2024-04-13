import { Typography, Grid, Avatar, Stack } from '@mui/material';
import BeenhereRoundedIcon from '@mui/icons-material/BeenhereRounded';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined'; 

interface SellerInfoProps {
    profileIcon: string;
    userName: string;
    hasIdVerificationImage: boolean;
  }
  
  const SellerInfo: React.FC<SellerInfoProps> = ({ profileIcon, userName, hasIdVerificationImage }) => {
    return (
        
        <Grid container spacing={0.5} sx={{py:2}}>
            
            <Grid item xs={2}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1.8 }}>
                    <Avatar src={profileIcon} alt={userName} />
                    
                </Stack>
            </Grid>
            <Grid item  sx={{pb:1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid container direction="column" alignItems="left">
                    
                    <Typography variant="subtitle1" sx={{pb:1, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        {userName}
                    </Typography>
                    {hasIdVerificationImage ? (
                        <Grid container spacing={0.5} alignItems="center"sx={{pt:1}}>
                            <BeenhereRoundedIcon color="primary" sx={{display: 'flex', justifyContent: 'center', alignItems: `center` }} />
                            <Typography variant="body1" sx={{pl:1, color: 'black'}}>
                                {`本人確認済`}
                            </Typography>
                        </Grid>
                    ) : (
                        <Grid container spacing={0.5} alignItems="center">
                            <BeenhereOutlinedIcon color="disabled" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem'}} />
                            <Typography variant="body1" sx={{pl:1, color: 'black'}}>
                                {`本人確認前`}
                            </Typography>
                        </Grid>
                        
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
  };
  
  export default SellerInfo;
  