import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { advicePageImg1 } from '../images';
import Footer from '../Footer';

function StartupAdvicePage(props) {

  return (
    <>
      <div>
        <Box display="flex" justifyContent="center" alignItems="center" marginTop="6rem" flexDirection="column">
          <div>
            <Typography variant="h3" sx={{ width: '100%' }}>
              <span style={{ color: '#44A3CC' }}>Empowering Dreams</span> Nurturing
            </Typography>
          </div>
          <div>
            <Typography variant="h3" sx={{ width: '100%' }}>
              Startups Through Innovative Support
            </Typography>
          </div>
          <div>
            <Typography variant="h6" sx={{ width: '100%', marginTop: '20px' }}>
              John Doe Posted on 17th Feb 2024
            </Typography>
          </div>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} ms={12} lg={12}>
            <img
              src={advicePageImg1}
              alt="donate"
              style={{
                height: '100%',
                width: '85%',
                marginTop: '40px',
                marginLeft: '8rem',
                marginRight: '7rem',
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} ms={12} lg={12}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="subtitle1" sx={{ marginTop: '3rem', width: '60%' }}>
                {' '}
                In the dynamic landscape of enterpreneurship, the journey froma groundbreaking idea to a flourishing
                business is both the thrilling and challenging. Our NGO is dedicated to paving the way for startup
                ventures, providing esential support and fostering growth. Let's delve ino the journey that unfolds when
                ambitious inidivduals seek assistance on their entrepreneurial path.{' '}
              </Typography>
            </div>
          </Grid>
        </Grid>

      </div>

      <Footer />
    </>
  );
}

export default StartupAdvicePage;
