import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import { homeIcon1, homeIcon2, homeIcon3, homeIcon4, homeImg1, homeImg2, homeImg3, homeImg4, homeImg5, homeImg6, homeImg7 } from '../images';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';

function HomePage(props) {
  const navigate = useNavigate();
  return (
    <div>
      <Grid container sx={{ backgroundColor: '#0685BB', marginTop: '1rem', height: '640px' }}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Box display="flex" flexDirection="column" margin="7rem">
            <Typography variant="h5">
              <span style={{ color: 'white' }}>Building Future </span>{' '}
              <span style={{ color: '#04B17C' }}>Sucess Stories </span>
            </Typography>
            <Typography variant="h4">
              <span style={{ color: 'white' }}>Join the </span> <span style={{ color: '#04B17C' }}>Journey </span>{' '}
              <span style={{ color: 'white' }}>of Entrepreneurial Excellence</span>
            </Typography>
            <Typography variant="subtitle1" sx={{ marginTop: '30px' }}>
              <span style={{ color: 'white' }}>
                {' '}
                Be the change maker. Donate and support aspiring entrepreneurs, building a brighter future.
              </span>
            </Typography>
            <div style={{ display: 'flex' }}>
              <Button
                onClick={() => navigate("/register")}
                sx={{
                  backgroundColor: '#04B17C',
                  border: '2px solid #04B17C',
                  borderRadius: '30px',
                  color: 'white',
                  fontSize: '16px',
                  padding: '`10px',
                  '&:hover': {
                    backgroundColor: '#04B17C',
                    color: 'white',
                  },
                  width: '17ch',
                  marginTop: '5rem',
                }}
                size="large"
              >
                Apply for Startup
              </Button>
              <a
                href="/landingpage/donations"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  marginTop: '5.7rem',
                  fontWeight: 'bold',
                  marginLeft: '1rem',
                }}
              >
                Donate Now
              </a>
            </div>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <div style={{ display: 'flex', marginLeft: '7rem', marginTop: '5px', justifyContent: 'center' }}>
            <Box display="flex" flexDirection="column">
              <img
                src={homeImg1}
                alt=""
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  marginTop: '5px',
                }}
              />
              <img
                src={homeImg2}
                alt=""
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  marginTop: '5px',
                }}
              />
              <div style={{ display: 'flex' }}>
                <img
                  src={homeImg3}
                  alt=""
                  style={{
                    maxWidth: '50%',
                    height: 'auto',
                    marginTop: '5px',
                  }}
                />
                <img
                  src={homeImg4}
                  alt=""
                  style={{
                    maxWidth: '50%',
                    height: 'auto',
                    marginTop: '5px',
                    marginLeft: '5px',
                  }}
                />
              </div>
            </Box>
            <Box display="flex" flexDirection="column">
              <img
                src={homeImg5}
                alt=""
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  marginTop: '5px',
                  marginLeft: '4px',
                }}
              />
              <div style={{ display: 'flex',marginRight:'14px' }}>
                <img
                  src={homeImg6}
                  alt=""
                  style={{
                    maxWidth: '50%',
                    height: 'auto',
                    marginTop: '5px',
                    marginLeft: '5px',
                  }}
                />
                <img
                  src={homeImg7}
                  alt=""
                  style={{
                    maxWidth: '50%',
                    height: 'auto',
                    marginTop: '5px',
                    marginLeft: '5px',
                  }}
                />
              </div>
            </Box>
          </div>
        </Grid>
      </Grid>
      <div style={{ margin: '0 auto', maxWidth: '1200px', padding: '0 2rem' }}>
        <br />
        <div>
          <Typography variant="h5" sx={{ marginTop: '3rem', textAlign: 'center' }}>
            How We Work
          </Typography>
        </div>
        <Grid container spacing={2} sx={{ marginTop: '2rem' }}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Paper style={{ padding: '10px', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <div>
                <img
                  src={homeIcon1}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid',
                    borderRadius: '20%',
                    marginRight: '10px',
                  }}
                  alt=""
                />
                <div>
                  <Typography variant="h5">Apply for Startup</Typography>
                  <Typography variant="body2">Apply for startup by clicking Signup button</Typography>
                </div>
              </div>

            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Paper style={{ padding: '10px', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <div>
                <img
                  src={homeIcon2}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid',
                    borderRadius: '20%',
                    marginRight: '10px',
                  }}
                  alt=""
                />
                <div>
                  <Typography variant="h5">Review Application</Typography>
                  <Typography variant="body2">Startup application will be reviwed and approved by admin</Typography>
                </div>
              </div>

            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Paper style={{ padding: '10px', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <div>
                <img
                  src={homeIcon3}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid',
                    borderRadius: '20%',
                    marginRight: '10px',
                  }}
                  alt=""
                />
                <div>
                  <Typography variant="h5">Supplier/Aduit</Typography>
                  <Typography variant="body2">You will be able to order your supply and strat business under our auditor's supervision </Typography>
                </div>
              </div>

            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Paper style={{ padding: '10px', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <div>
                <img
                  src={homeIcon4}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid',
                    borderRadius: '20%',
                    marginRight: '10px',
                  }}
                  alt=""
                />
                <div>
                  <Typography variant="h5">Donations</Typography>
                  <Typography variant="body2">Donate to Etartup Empowerments</Typography>
                </div>
              </div>

            </Paper>
          </Grid>
        </Grid>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
