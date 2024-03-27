import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Box } from '@mui/material';
import Logo from '../../components/logo';
import { ForgetPasswordForm } from '../../sections/auth/login';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '50vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ForgetPasswordPage() {

  return (
    <>
      <Helmet>
        <title> Recover Account | SE </title>
      </Helmet>
      <Box display="flex" justifyContent="center" marginBottom="2rem" marginTop="7rem">
        <Logo
          sx={{
            position: 'fixed',
          }}
        />
      </Box>

      <StyledRoot>

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h5" gutterBottom>
              Provide valid email to get the account reset link
            </Typography>
<br/>
            <ForgetPasswordForm />

            <Typography variant="body2" sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
              Back To &nbsp;
              <Link variant="subtitle2" href="login">
                Login
              </Link>
            </Typography>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
