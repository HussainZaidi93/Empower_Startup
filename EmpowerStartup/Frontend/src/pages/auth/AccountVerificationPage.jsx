import { Helmet } from 'react-helmet-async';

import { styled } from '@mui/material/styles';
import { Container, Typography, Button, TextField } from '@mui/material';

import Logo from 'src/components/logo/Logo';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Post } from 'src/actions/API/apiActions';
import { Get_VerifyEmail_URL } from 'src/constants/apiURLs';
import { useSnackbar } from 'notistack';
import { Box } from '@mui/system';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 550,
  margin: 'auto',
  minHeight: '40vh',
  display: 'flex',
  fontSize: '20px',
  textAlign: 'center',
  fontWeight: 'bolder',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function AccountVerificationPage() {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [authToken, setAuthToken] = useState(null);

  const handleVerifyUser = () => {
    try {
      Post(
        {
          authToken: authToken,
        },
        Get_VerifyEmail_URL,
        (res) => {
          setIsVerified(true);
          enqueueSnackbar('Your email is verified succesfully. Continue to login your account.', {
            variant: 'success',
          });
        },
        (err) => {
          setIsVerified(false);
          enqueueSnackbar(
            'Either Email is verified or the TOKEN is invalid. Contact with your admin to resolve the issue',
            { variant: 'error' }
          );
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong , Try again!', { variant: 'error' });
    }
  };
  return (
    <>
      <Helmet>
        <title> Verification Status | Startup Empowerment </title>
      </Helmet>

      <Box display="flex" justifyContent="center" marginBottom="2rem">
        <Logo
          sx={{
            position: 'fixed',
          }}
        />
      </Box>

      <StyledRoot>
        <Container maxWidth="sm">
          <StyledContent>
            {isVerified ? (
              <>
                <Typography variant="h5">
                  Your Email is verified successfully. Continue to login your account
                </Typography>
                <br />
                <Button color="primary" variant="outlined" onClick={() => navigate('/login')}>
                  Continue to login
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h5">Enter verification code you have received at you provided email.</Typography>
                <br />
                <TextField
                  id="authToken"
                  name="authToken"
                  onChange={(e) => setAuthToken(e.target.value)}
                  label="Enter Verification Token"
                />
                <br />
                {authToken && (
                  <Button
                    sx={{
                      backgroundColor: '#04B17C',
                      color: 'white',
                      padding: '10px',
                      '&:hover': {
                        backgroundColor: '#04B17C',
                      },
                      width: '20ch',
                      marginLeft: '10rem',
                    }}
                    size="small"
                    onClick={() => handleVerifyUser()}
                  >
                    Verify your account
                  </Button>
                )}
                {/* {isVerified &&
                  setTimeout(() => {
                    navigate('/login', 3000);
                  })} */}
              </>
            )}
            <br />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
