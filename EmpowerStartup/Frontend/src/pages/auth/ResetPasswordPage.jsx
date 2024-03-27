import { Helmet } from "react-helmet-async";
import { Box, Typography,Link, Container } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import useResponsive from "src/hooks/useResponsive";
import { styled } from '@mui/material/styles';
import { Post } from "src/actions/API/apiActions";
import { Post_ResetPassword_URL } from "src/constants/apiURLs";
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import { logoImage } from "src/images";
import ResetPasswordForm from "src/sections/auth/login/ResetPasswordForm";

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  }));
const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
  }));
  
  const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
  }));

export default function ResetPasswordPage() {
  const navigate=useNavigate();
  const mdUp = useResponsive('up', 'md');
  const {enqueueSnackbar}=useSnackbar()
  const handleResetPassword=(values,actions)=>{
    Post(
        values,
        Post_ResetPassword_URL,
        resp=>{
          actions.setSubmitting(false)
          enqueueSnackbar("Password Changed Successfully",{variant:"success"})
          navigate('/login', { replace: true });
          actions.resetForm()
        },
        error=>{
          enqueueSnackbar("Password Couldn't be Changed",{variant:"error"})
          navigate('/login', { replace: true });
        },
    )
  }
  return (
    <>
      <Helmet>
        <title> Login | CRM </title>
      </Helmet>

      <StyledRoot>
        {/* <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        /> */}
        <Box
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        >
          <Link to="/" component={RouterLink}>
            <img src={logoImage} alt="Logo" />
          </Link>
        </Box>

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi,
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Password Reset
            </Typography>
            <br />
            <ResetPasswordForm onSubmit={handleResetPassword}/>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
