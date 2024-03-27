import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
import Iconify from 'src/components/iconify';
import { Register } from 'src/sections/auth/register';

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

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Register | SE </title>
      </Helmet>

      <StyledRoot>
        <Container maxWidth="lg">
          <StyledContent>
            <Register />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
