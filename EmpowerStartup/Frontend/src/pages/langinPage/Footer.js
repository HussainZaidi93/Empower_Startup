import { FacebookRounded, Instagram, LinkedIn, Twitter } from '@mui/icons-material';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';

function Footer(props) {
  return (
    <Grid container sx={{ backgroundColor: '#0685BB', marginTop: '6rem', height: '500px' }}>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Box marginLeft="8rem" marginTop="12rem">
          <Typography variant="h6" sx={{ color: 'white' }}>
            We are always open to diccuss your project and improve your online presence.
          </Typography>
        </Box>
        <Box sx={{ backgroundColor: '#04B17C', height: '130px', width: '600px' }} marginLeft="8rem" marginTop="9.3rem">
          <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ color: 'white', padding: '15px' }}>
                Email us at
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'white', paddingLeft: '10px' }}>
                empowerStartupgmail.com
              </Typography>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ color: 'white', padding: '15px' }}>
                Call Us
              </Typography>
              <Typography variant="subtitle1" sx={{ color: 'white', paddingLeft: '10px' }}>
                0927 6277 28528
              </Typography>
            </div>
          </div>
        </Box>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <Box marginLeft="8rem" marginTop="12rem">
          <Typography variant="h3" sx={{ color: 'white' }}>
            Lets Talk !
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'white', width : '80%', paddingTop:'10px' }}> Ready to elevate your startup with our empowering resources? Let's connect and explore how Startup Empowerment can be your catalyst for success.</Typography>
        </Box>
        <Box marginLeft="8rem" marginTop="4rem" sx={{ width: '200px' }} display="flex" justifyContent="space-around">
          <IconButton sx={{ color: 'white' }}>
            <FacebookRounded />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <Twitter />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <Instagram />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <LinkedIn />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Footer;
