import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const EmailConfirmation: React.FC = () => {
  const [status, setStatus] = useState<'success' | 'error'>('error');
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');
    const message = searchParams.get('message');

    if (status === 'success') {
      setStatus('success');
      setMessage('Your email has been successfully confirmed.');
    } else {
      setStatus('error');
      setMessage(message || 'An error occurred during email confirmation.');
    }
  }, [location]);

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        {status === 'success' ? (
          <>
            <Typography variant="h5" gutterBottom>
              Email Confirmed!
            </Typography>
            <Typography variant="body1" paragraph>
              {message}
            </Typography>
            <Button variant="contained" color="primary" href="/login">
              Go to Login
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              Confirmation Error
            </Typography>
            <Typography variant="body1" paragraph>
              {message}
            </Typography>
            <Button variant="contained" color="primary" href="/contact">
              Contact Support
            </Button>
          </>
        )}
      </StyledPaper>
    </Container>
  );
};

export default EmailConfirmation;