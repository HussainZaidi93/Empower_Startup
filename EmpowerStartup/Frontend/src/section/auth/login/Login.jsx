import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Carousel from 'react-material-ui-carousel';

import Logo from 'src/components/logo';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { applyImage, donateImage, signUpImage } from 'src/images/signup';
import LoginForm from './LoginForm';
import { Post } from 'src/actions/API/apiActions';
import { Post_Login_URL } from 'src/constants/apiURLs';
import { useSnackbar } from 'notistack';

export default function Login({ onSubmit }) {

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar()

  const handleUserLogin = (values, actions) => {

    console.log("sfgsfdgfdsgfsg values", values)
    try {
      Post(
        values,
        Post_Login_URL,
        resp => {
          const role = resp?.data?.responseData?.role;
          localStorage.setItem('role', role)
          localStorage.setItem('userId', resp?.data?.responseData?.id)
          switch (role) {
            case 'Admin':
              enqueueSnackbar('Login Successfull', { variant: 'success' });
              navigate('/admin-dashboard', { replace: true });
              break;
            case 'Supplier':
              enqueueSnackbar('Login Successfull', { variant: 'success' });
              navigate('/supplier-dashboard', { replace: true });
              break;
            case 'User':
              enqueueSnackbar('Login Successfull', { variant: 'success' });
              navigate('/innovator-dashboard', { replace: true });
              break;
            case 'Auditor':
              enqueueSnackbar('Login Successfull', { variant: 'success' });
              navigate('/auditor-dashboard', { replace: true });
              break;
            case 'Inspector':
              enqueueSnackbar('Login Successfull', { variant: 'success' });
              navigate('/inspection-dashboard', { replace: true });
              break;

            default:
              break;
          }
          // enqueueSnackbar("User login succesfully", { variant: 'success' })
        },
        error => {
          enqueueSnackbar("Cannot login user", { variant: 'error' })
        }
      )
    } catch (error) {

    }
  }
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
      <Card
        sx={{
          paddingLeft: '25px',
          width: '100%',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8} lg={8}>
            <Box display="flex" justifyContent="center" marginBottom="2rem" marginTop='1rem'>
              <Logo
                sx={{
                  position: 'fixed',
                }}
              />
            </Box>
            <br />
            <Typography variant="h4" sx={{ color: '#108FC6' }}>
              Login
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
              Don't have an account?
              <Link variant="subtitle2" sx={{ ml: 0.5 }} href="register">
                Sign up
              </Link>
            </Typography>
            <br />
            <LoginForm onUserLogin={handleUserLogin} />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <div style={{ backgroundColor: '#0685BB' }}>
              <Carousel
                indicatorIconButtonProps={{
                  style: {
                    paddingTop: '10px',
                    color: '#04B17C',
                    marginTop: '100%',
                  },
                }}
                activeIndicatorIconButtonProps={{
                  style: {
                    color: 'white',
                  },
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      height: '200px',
                      width: '200px',
                      margin: '0 auto', // Center the container horizontally
                    }}
                  >
                    <img
                      src={signUpImage}
                      alt="Sign up"
                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover', // Ensure the image fills the container
                        borderRadius: '50%', // To make it circular
                        marginTop: '100px'
                      }}
                    />
                  </div>
                  <div>
                    <Typography
                      variant="body2"
                      sx={{ padding: '10px', color: 'white', marginTop: '2rem' }}
                    >
                      {' '}
                      Ready to launch your startup? Join forces with Us to fuel your ambitions.
                      Begin your entrepreneurial odyssey today by applying below.
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <Button
                      onClick={() => navigate('/register')}
                      sx={{
                        backgroundColor: '#04B17C',
                        color: 'white',
                        padding: '10px',
                        '&:hover': {
                          backgroundColor: '#04B17C',
                        },
                        width: '13ch'
                      }}
                      size="small"
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      height: '200px',
                      width: '200px',
                      margin: '0 auto', // Center the container horizontally
                    }}
                  >
                    <img
                      src={donateImage}
                      alt="donate"

                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover', // Ensure the image fills the container
                        borderRadius: '50%', // To make it circular
                        marginTop: '100px'
                      }}
                    />
                  </div>
                  <div display="flex" justifyContent="center">
                    <Typography
                      variant="body2"
                      sx={{ padding: '10px', color: 'white', marginTop: '2rem' }}
                    >
                      {' '}
                      Empower the next generation of innovators by donating to Empower Startup. Your
                      support fuels dreams, drives innovation, and transforms aspirations into
                      reality.
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <Button
                      sx={{
                        backgroundColor: '#04B17C',
                        color: 'white',
                        padding: '10px',
                        '&:hover': {
                          backgroundColor: '#04B17C',
                        },
                        width: '13ch'
                      }}
                    >
                      Donate Now
                    </Button>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      height: '200px',
                      width: '200px',
                      margin: '0 auto', // Center the container horizontally

                    }}
                  >
                    <img
                      src={applyImage}
                      alt="apply now"
                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover', // Ensure the image fills the container
                        borderRadius: '50%', // To make it circular
                        marginTop: '100px'
                      }}
                    />
                  </div>
                  <div display="flex" justifyContent="center">
                    <Typography
                      variant="body2"
                      sx={{ padding: '10px', color: 'white', marginTop: '2rem' }}
                    >
                      {' '}
                      Ready to launch your startup? Join forces with Us to fuel your ambitions.
                      Begin your entrepreneurial odyssey today by applying below.
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                    <Button
                      sx={{
                        backgroundColor: '#04B17C',
                        color: 'white',
                        padding: '10px',
                        '&:hover': {
                          backgroundColor: '#04B17C',
                        },
                        width: '13ch'
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </Carousel>
            </div>
          </Grid>
        </Grid>
      </Card>
    </Stack>
    // </Box>
  );
}
