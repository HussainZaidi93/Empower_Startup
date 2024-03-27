import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import Footer from '../Footer';
import { useSnackbar } from 'notistack';
import { Post } from 'src/actions/API/apiActions';
import { Post_SendMessage_URL } from 'src/constants/apiURLs';
import { useNavigate } from 'react-router-dom';

function JoinUsPage(props) {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [subject, setSubject] = useState();
  const [text, setText] = useState();
  const [context, setContext] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSendMessage = () => {
    try {
      Post(
        {
          email: email,
          context: context,
          subject: subject,
          text: text,
        },
        Post_SendMessage_URL,
        (resp) => {
          enqueueSnackbar('Your message has been sent to admin', { variant: 'success' });
          navigate('/landingpage/home');
        },
        (error) => {
          enqueueSnackbar('Message could not be sent due to some issue', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  };
  return (
    <div>
      <Box display="flex" justifyContent="center" marginTop="4rem">
        <Typography variant="h2" sx={{ color: '#0685BB' }}>
          Contact Us
        </Typography>
      </Box>
      <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <Typography variant="subtitle1" sx={{ marginTop: '20px' }}>
          {' '}
          At Startup Empowerment, we value every interaction. Whether you're seeking partnership opportunities or simply
          want to connect, drop us a message below
        </Typography>
      </div>

      <>
        <Grid container spacing={2} sx={{ width: '60%' }} justifyContent="center" marginLeft="24rem">
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <TextField
              label="Name"
              variant="outlined"
              id="name"
              name="name"
              size="medium"
              value={name}
              sx={{ marginBottom: '20px' }}
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <TextField
              label="Email"
              variant="outlined"
              id="email"
              name="email"
              size="medium"
              value={email}
              sx={{ marginBottom: '20px' }}
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <TextField
              label="Provide Context"
              variant="outlined"
              id="context"
              name="context"
              size="medium"
              value={context}
              sx={{ marginBottom: '20px' }}
              fullWidth
              onChange={(e) => setContext(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              label="Provide Subject"
              variant="outlined"
              id="subject"
              name="subject"
              size="medium"
              value={subject}
              sx={{ marginBottom: '20px' }}
              fullWidth
              onChange={(e) => setSubject(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              label="Message"
              variant="outlined"
              placeholder="Write your question here"
              multiline
              rows={6}
              id="subject"
              name="subject"
              size="medium"
              value={text}
              sx={{ marginBottom: '20px' }}
              fullWidth
              onChange={(e) => setText(e.target.value)}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center">
          <Button
            sx={{
              backgroundColor: '#FFFFFF', // Change background color to white
              color: '#04B17C', // Change text color to green
              padding: '10px',
              '&:hover': {
                backgroundColor: '#04B17C', // Change hover background color to green
                color: '#FFFFFF', // Change hover text color to white
              },
              marginTop: '1rem',
              width: '20ch',
              border: '2px solid #04B17C',
              borderRadius: '10px',
            }}
            size="small"
            onClick={() => handleSendMessage()}
            disabled={!name || !email || !subject || !text || !context}
          >
            Send Message
          </Button>
        </Box>
      </>

      <Footer />
    </div>
  );
}

export default JoinUsPage;
