import { useNavigate } from 'react-router-dom';
import { Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { Get_ResetPasswordLink_URL } from 'src/constants/apiURLs';
import { Post } from 'src/actions/API/apiActions';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function ForgetPasswordForm() {
  const [email, setEmail] = useState(''); // This is the email that will be sent to the backend
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChangePassword = () => {
    if (email === '') {
      alert('Please enter your email address');
      return;
    } else if (!email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    } else if (!email.includes('.')) {
      alert('Please enter a valid email address');
      return;
    } else if (email.includes(' ')) {
      alert('Please enter a valid email address');
      return;
    } else {
      try {
        Post(
          {
            email: email,
          },
          Get_ResetPasswordLink_URL,
          (resp) => {
            enqueueSnackbar('Password reset link sent successfully', {
              variant: 'success',
            });
            navigate('/resetPassword');
          },
          (error) => {
            console.log('errr', error);
            enqueueSnackbar(error.message || 'Password can not be changed', { variant: 'error' });
          }
        );
      } catch (error) {
        enqueueSnackbar('Something went wrong at server', { variant: 'error' });
      }
    }
  };
  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          type="email"
          fullWidth
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </Stack>
      <br />
      <Button
        sx={{
          backgroundColor: 'white',
          border: '2px solid #04B17C',
          color: 'black',
          fontSize: '15px',
          padding: '7px',
          '&:hover': {
            backgroundColor: '#04B17C',
            color: 'white',
            cursor: 'pointer',
          },
        }}
        size="small"
        disabled={!email}
        onClick={() => handleChangePassword()}
      >
        Send Reset Link
      </Button>
    </>
  );
}
