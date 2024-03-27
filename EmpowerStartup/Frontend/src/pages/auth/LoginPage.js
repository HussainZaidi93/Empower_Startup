import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Container } from '@mui/material';
import { Login } from 'src/sections/auth';

// sections

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));
const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: '70%',
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | Startup Empowerment </title>
      </Helmet>
      <StyledRoot>
        <Container maxWidth="lg">
          <StyledContent>
            <Login />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
