import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import {
  workIcon1,
  workIcon2,
  workIcon3,
  workImage1,
  workImage2,
  workImage3,
  workImage4,
  workReview1,
  workReview2,
  workReview3,
  workReview4,
} from '../images';
import Footer from '../Footer';

function HowWeWorkPage(props) {
  return (
    <div>
      <div style={{ marginLeft: '7rem', marginRight: '5rem' }}>
        <Grid container spacing={2} marginTop="5rem">
          <Grid item xs={12} sm={12} ms={6} lg={6}>
            <Typography variant="h3">
              We <span style={{ color: '#44A3CC' }}>guide startups</span>{' '}
            </Typography>
            <Typography variant="h3"> through a seamless</Typography>
            <Typography variant="h3">
              {' '}
              <span style={{ color: '#44A3CC' }}>journey</span>
            </Typography>
            <Typography variant="subtitle2" sx={{ marginTop: '20px', width: '60%' }}>
              Embark on a seamless journey of entrepreneurial success with our expert guidance tailored specifically for
              startups. Let us navigate the path to success together, empowering your startup every step of the way.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} ms={5} lg={5}>
            <img
              src={workImage1}
              alt="donate"
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} marginTop="5rem">
          <Grid item xs={12} sm={12} ms={6} lg={6} >
            <Typography variant="subtitle">
              {' '}
              <span style={{ color: '#44A3CC' }}>Who we are</span>
            </Typography>
            <Typography variant="h5">Goal Focused</Typography>
            <Typography variant="subtitle2" sx={{ marginTop: '5px' }}>
              At Startup Empowerment, we're dedicated to keeping your vision clear and your goals in focus as we propel
              your startup towards success.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} ms={5} lg={5} sx={{ marginLeft: '3rem' }}>
            <Typography variant="h5" sx={{ marginTop: '26px' }}>
              Continous Improvement{' '}
            </Typography>
            <Typography variant="subtitle2" sx={{ marginTop: '5px' }}>
              We believe in the power of continuous improvement, constantly refining strategies and processes to ensure
              your startup thrives in an ever-evolving landscape
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} ms={12} lg={12}>
            <img
              src={workImage2}
              alt="donate"
              style={{
                height: '100%',
                width: '100%',
                marginTop: '40px',
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} marginTop="7rem">
          <Grid item xs={12} sm={12} ms={12} lg={12}>
            <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: '40px' }}>
              {' '}
              <span>
                The <span style={{ color: '#44A3CC' }}>Process</span> We Follow
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} ms={3} lg={3} sx={{ width: '20%' }}>
            <div style={{width:'320px'}}>
            <div style={{display:'flex'}}>
              <div style={{borderRadius :"50%" , color:"#44A3CC", backgroundColor :'#44A3CC', height:'20px', width :'20px'}}></div> 
              <p style={{color:"#44A3CC", marginTop:'-2px'}}>   - - - - - - - - - - - - - - - - - -  - - - --  - -  -  - - - - -  --  - - -  - - - -  - - </p>
            </div>
            <Typography variant="h6">
              {' '}
              <span style={{ color: '#44A3CC' }}>Starup Request</span>
            </Typography>
            <Typography variant="Subtitle1" sx={{paddingTop : '8px'}} >
                {' '}
                <span >In our startup empowerment flow process, we start by analyzing your request to craft tailored solutions, ensuring a strong foundation for your journey to success. </span>
            </Typography> 
            </div>
          </Grid>
          <br />
          <Grid item xs={12} sm={12} ms={3} lg={3} sx={{ width: '20%' }}>
            <div style={{width:'320px'}}>
            <div style={{display:'flex'}}>
              <div style={{borderRadius :"50%" , color:"#44A3CC", backgroundColor :'#44A3CC', height:'20px', width :'20px'}}></div> 
              <p style={{color:"#44A3CC", marginTop:'-2px'}}>   - - - - - - - - - - - - - - - - - -  - - - --  - -  -  - - - - -  --  - - -  - - - -  - - </p>
            </div>
            <Typography variant="h6">
              {' '}
              <span style={{ color: '#44A3CC' }}>Supplier Interaction</span>
            </Typography>
            <Typography variant="Subtitle1" sx={{paddingTop : '8px'}} >
                {' '}
                <span >Engage seamlessly with suppliers to foster collaboration and drive mutual growth through Startup Empowerment's innovative platform </span>
            </Typography> 
            </div>
          </Grid>
          <Grid item xs={12} sm={12} ms={3} lg={3} sx={{ width: '20%' }}>
            <div style={{width:'320px'}}>
            <div style={{display:'flex'}}>
              <div style={{borderRadius :"50%" , color:"#44A3CC", backgroundColor :'#44A3CC', height:'20px', width :'20px'}}></div> 
              <p style={{color:"#44A3CC", marginTop:'-2px'}}>   - - - - - - - - - - - - - - - - - -  - - - --  - -  -  - - - - -  --  - - -  - - - -  - - </p>
            </div>
            <Typography variant="h6">
              {' '}
              <span style={{ color: '#44A3CC' }}>Auditor Verification</span>
            </Typography>
            <Typography variant="Subtitle1" sx={{paddingTop : '8px'}} >
                {' '}
                <span >Ensure credibility and transparency with Auditor Verification, empowering startups with trusted validation and assurance for their stakeholders. </span>
            </Typography> 
            </div>
          </Grid>
          <Grid item xs={12} sm={12} ms={3} lg={3} sx={{ width: '20%' }}>
            <div style={{width:'320px'}}>
            <div style={{display:'flex'}}>
              <div style={{borderRadius :"50%" , color:"#44A3CC", backgroundColor :'#44A3CC', height:'20px', width :'20px'}}></div> 
              <p style={{color:"#44A3CC", marginTop:'-2px'}}>   - - - - - - - - - - - - - - - - - -  - - - --  - -  -  - - - - -  --  - - -  - - - -  - - </p>
            </div>
            <Typography variant="h6">
              {' '}
              <span style={{ color: '#44A3CC' }}>Donor Support</span>
            </Typography>
            <Typography variant="Subtitle1" sx={{paddingTop : '8px'}} >
                {' '}
                <span>Attract vital donor support through Startup Empowerment, propelling your startup's mission towards success </span>
            </Typography> 
            </div>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="space-between" sx={{ marginTop: '10rem' }}>
          <div>
            <Typography variant="h6">
              <span style={{ color: '#44A3CC' }}>Our Mission</span>
            </Typography>
            <Typography variant="h3">Inspire , Innovate , Donate</Typography>
            <Typography variant="subtitle1" sx={{ marginTop: '10px', width: '60%' }}>
              At Startup Empowerment, we embody the spirit of Inspire, Innovate, Donate, driving forward with
              creativity, purpose, and a commitment to giving back to the community.
            </Typography>
          </div>
          <div>
            <img
              src={workImage3}
              alt="donate"
              style={{
                height: '80%',
                width: '80%',
              }}
            />
          </div>
        </Box>

        <Box display="flex" justifyContent="space-between" sx={{ marginTop: '8rem' }}>
          <div>
            <img
              src={workImage4}
              alt="donate"
              style={{
                height: '100%',
                width: '120%',
              }}
            />
          </div>
          <div style={{ marginLeft: '410px' }}>
            <Typography variant="h6">
              <span style={{ color: '#44A3CC' }}>Our Vision</span>
            </Typography>
            <Typography variant="h3">Laser Focus</Typography>
            <Typography variant="subtitle1" sx={{ marginTop: '10px', width: '60%' }}>
              Our vision is laser-focused: to revolutionize the startup landscape through unwavering dedication and a
              relentless pursuit of excellence. With clarity and precision, we aim to empower startups to achieve their
              boldest dreams."
            </Typography>
          </div>
        </Box>

        <Box display="flex" justifyContent="center" marginTop="7rem">
          <Typography variant="h3">
            The <span style={{ color: '#44A3CC' }}>benefits</span> of working with us
          </Typography>
        </Box>
        <Grid container spacing={2} justifyContent="space-between" marginTop="4rem">
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <Card
              sx={{
                position: 'relative',
                border: '1px solid #ccc',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                backgroundColor: '#F4F6FC',
              }}
            >
              <img
                src={workIcon1}
                alt=""
                style={{
                  height: '50px',
                  width: '50px',
                  padding: '10px',
                }}
              />
              <CardContent>
                <Typography variant="h6">Holistic Support Ecosystem</Typography>
                <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
                  Our holistic support ecosystem nurtures startups at every stage, providing comprehensive guidance for
                  sustainable growth
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3}>
            <Card
              sx={{
                position: 'relative',
                border: '1px solid #ccc',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                height: '100%',
                backgroundColor: '#F4F6FC',
              }}
            >
              <img
                src={workIcon2}
                alt=""
                style={{
                  height: '50px',
                  width: '50px',
                  padding: '10px',
                }}
              />
              <CardContent>
                <Typography variant="h6">Quality Supplier Network</Typography>
                <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
                  Our quality supplier network ensures startups access top-notch resources for their journey towards
                  excellence.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <Card
              sx={{
                position: 'relative',
                border: '1px solid #ccc',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                height: '100%',
                backgroundColor: '#F4F6FC',
              }}
            >
              <img
                src={workIcon3}
                alt=""
                style={{
                  height: '50px',
                  width: '50px',
                  padding: '10px',
                }}
              />
              <CardContent>
                <Typography variant="h6">Strategic Donor Engagement</Typography>
                <Typography variant="subtitle1" sx={{ marginTop: '10px' }}>
                  Through strategic donor engagement, we foster impactful collaborations to fuel startup innovation and
                  growth.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center" marginTop="7rem">
          <Typography variant="h3">
            Meet Our <span style={{ color: '#44A3CC' }}>Team</span>
          </Typography>
        </Box>
        <Grid container spacing={2} marginTop="3rem" marginLeft='5rem'>
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <img
              src={workReview1}
              alt=""
              style={{
                height: '70%',
                width: '30%',
                // padding:'10px'
                borderRadius: '50%',
              }}
            />
            <Box display="flex" marginTop="10px">
              <Typography variant="h6" sx={{ marginLeft: '20px' }}>
                John Doe
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <img
              src={workReview3}
              alt=""
              style={{
                height: '70%',
                width: '30%',
                // padding:'10px'
                borderRadius: '50%',
              }}
            />
            <Box display="flex" marginTop="10px">
              <Typography variant="h6" sx={{ marginLeft: '20px' }}>
                Sara Hardin
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <img
              src={workReview2}
              alt=""
              style={{
                height: '70%',
                width: '30%',
                // padding:'10px'
                borderRadius: '50%',
              }}
            />
            <Box display="flex" marginTop="10px">
              <Typography variant="h6" sx={{ marginLeft: '20px' }}>
                Johny Zakhem
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <img
              src={workReview4}
              alt=""
              style={{
                height: '70%',
                width: '30%',
                // padding:'10px'
                borderRadius: '50%',
              }}
            />
            <Box display="flex" marginTop="10px">
              <Typography variant="h6" sx={{ marginLeft: '20px' }}>
                Edison Lee
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
      </div>
      <Footer/>
    </div>
  );
}

export default HowWeWorkPage;
