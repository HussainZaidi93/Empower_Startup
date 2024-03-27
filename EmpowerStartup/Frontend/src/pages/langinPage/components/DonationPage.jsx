import { Box, Button, Card, CardContent, CardMedia, Grid, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { Post } from 'src/actions/API/apiActions';
import { Post_CreateDonator_URL, Post_GetAllArcticles_URL, baseURL } from 'src/constants/apiURLs';
import { useSnackbar } from 'notistack';
import Footer from '../Footer';
import * as Yup from 'yup';
import { number } from 'card-validator';

function DonationPage(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const initialValues = {
    name: ' ',
    email: '',
    country: '',
    city: '',
    address: '',
    paymentType: '',
    creditCardNumber: '',
    expirationDate: '',
    securityCode: '',
    donationAmount: '',
  };

  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    country: Yup.string().required('Country is required'),
    city: Yup.string().required('City is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    address: Yup.string().required('Address is required'),
    paymentType: Yup.string().required('Payment type is required'),
    creditCardNumber: Yup.string()
      .required('Credit card number is required')
      .test('valid-cc', 'Invalid credit card number', (value) => number(value).isValid), // Use 'number' method from card-validator
    expirationDate: Yup.string().required('Expiration date is required'),
    securityCode: Yup.string().required('Security code is required').min(3, 'Invalid security code').max(4, 'Invalid security code'),
    donationAmount: Yup.number().required('Amount to donate is required').positive().integer(),
  });

  const handleCreateDonation = (values, actions) => {
    try {
      Post(
        values,
        Post_CreateDonator_URL,
        (resp) => {
          actions.resetForm();
          enqueueSnackbar('Donation sent', { variant: 'success' });
        },
        (error) => {
          actions.setSubmitting(false);
          enqueueSnackbar('Can not send donation', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  };

  const getAllArticles = useCallback(() => {
    try {
      Post(
        {},
        Post_GetAllArcticles_URL,
        (resp) => {
          setArticles(resp?.data.articles);
          console.log('esrferet', resp);
        },
        (error) => {
          console.log('errr', error);
          enqueueSnackbar('Articles loaded ', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    getAllArticles();
  }, [getAllArticles]);

  const handleArticleClick = (articleId) => {
    console.log('Article ID:', articleId);
    setSelectedArticle(articleId);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'UTC',
    };

    return date.toLocaleDateString('en-US', options);
  }

  return (
    <div>
      <Box
        sx={{
          // backgroundImage: `url(${donationImg1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'rgba(10, 43, 57, 0.8)',
          height: '600px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ color: 'white', paddingTop: '15rem' }}>
          I aim to contribute to the future success of those who require it the most.
        </Typography>
      </Box>
      <br />
      <Box display="flex" justifyContent="center" marginTop='2rem'>
        <Typography variant='h3'>Our Projects</Typography>
      </Box>
      <br />
      <br/>
      <div>
        {!selectedArticle ? (
          <Grid container spacing={3} justifyContent="space-around">
            {articles?.map((article) => {
              return (
                <Grid key={article._id} item xs={12} sm={12} md={3} lg={3}>
                  <Card>
                    <CardMedia
                      component="img"
                      alt="Article Image"
                      height="300"
                      image={`${baseURL}/uploads/${article?.articleImage}`}
                    />
                    <CardContent>
                      <Typography variant="subtitle1">{formatDate(article?.Date)}</Typography>

                      <div onClick={() => handleArticleClick(article)} style={{ cursor: 'pointer' }}>
                        <Typography variant="h4">{article?.startupName}</Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <img
                src={`${baseURL}/uploads/${selectedArticle?.articleImage}`}
                alt="donate"
                style={{
                  height: '600px',
                  width: '85%',
                  marginTop: '40px',
                  marginLeft: '8rem',
                  marginRight: '7rem',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} marginLeft="9rem">
              <Typography variant="subtitle2">{formatDate(selectedArticle?.Date)}</Typography>
              <Typography variant="h4">{selectedArticle?.startupName}</Typography>
              <Typography variant="subtitle1">{selectedArticle?.articleContent}</Typography>
            </Grid>
          </Grid>
        )}
      </div>
      <br/>
      <br/>
      <Grid
        sx={{
          width: '45%',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '30px',
          backgroundColor: 'white',
        }}
        display="flex"
        justifyContent="center"
        marginLeft="35rem"
        marginRight="6rem"
      >
        <div>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={ValidationSchema}
            onSubmit={(values, actions) => handleCreateDonation(values, actions)}
          >
            {({ errors, values, touched, handleSubmit, isSubmitting, getFieldProps }) => (
              <Form>
                {console.log('errrr', errors)}
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Typography variant="h6"> Help bring us financial freedom to more people. Donate Now!</Typography>
                </Grid>
                <br />
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    id="name"
                    name="name"
                    size="small"
                    value={values.name}
                    sx={{ marginBottom: '20px' }}
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                    {...getFieldProps('name')}
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    id="email"
                    fullWidth
                    size="small"
                    value={values?.email}
                    sx={{ marginBottom: '20px' }}
                    name="email"
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    {...getFieldProps('email')}
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Country"
                    variant="outlined"
                    id="country"
                    size="small"
                    value={values?.country}
                    sx={{ marginBottom: '20px' }}
                    fullWidth
                    name="country"
                    error={Boolean(touched.country && errors.country)}
                    helperText={touched.country && errors.country}
                    {...getFieldProps('country')}
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="City"
                    variant="outlined"
                    id="city"
                    size="small"
                    value={values?.city}
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                    name="city"
                    error={Boolean(touched.city && errors.city)}
                    helperText={touched.city && errors.city}
                    {...getFieldProps('city')}
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Address"
                    variant="outlined"
                    id="address"
                    size="small"
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                    name="address"
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                    {...getFieldProps('address')}
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Payment Type"
                    variant="outlined"
                    id="paymentType"
                    size="small"
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                    name="paymentType"
                    error={Boolean(touched.paymentType && errors.paymentType)}
                    helperText={touched.paymentType && errors.paymentType}
                    {...getFieldProps('paymentType')}
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Credit Card Number"
                    variant="outlined"
                    id="creditCardNumber"
                    size="small"
                    type="number"
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                    name="creditCardNumber"
                    error={Boolean(touched.creditCardNumber && errors.creditCardNumber)}
                    helperText={touched.creditCardNumber && errors.creditCardNumber}
                    {...getFieldProps('creditCardNumber')}
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Expiration Date"
                    variant="outlined"
                    id="expirationDate"
                    type="date"
                    size="small"
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                    name="expirationDate"
                    error={Boolean(touched.expirationDate && errors.expirationDate)}
                    helperText={touched.expirationDate && errors.expirationDate}
                    {...getFieldProps('expirationDate')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Security code"
                    variant="outlined"
                    id="securityCode"
                    size="small"
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                    name="securityCode"
                    error={Boolean(touched.securityCode && errors.securityCode)}
                    helperText={touched.securityCode && errors.securityCode}
                    {...getFieldProps('securityCode')}
                  />
                </Grid>
                <br />
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Donation Amount"
                    variant="outlined"
                    id="donationAmount"
                    size="small"
                    fullWidth
                    type="number"
                    sx={{ marginBottom: '20px' }}
                    name="donationAmount"
                    error={Boolean(touched.donationAmount && errors.donationAmount)}
                    helperText={touched.donationAmount && errors.donationAmount}
                    {...getFieldProps('donationAmount')}
                  />
                </Grid>
                <br />
                <Box display="flex" justifyContent="center">
                  <Button
                    sx={{
                      width: '100%',
                      backgroundColor: '#04B17C',
                      color: 'white',
                      borderRadius: '30px',
                      marginBottom: '2rem',
                      '&:hover': { backgroundColor: '#04B17C' },
                    }}
                    loading={isSubmitting}
                    size="medium"
                    onClick={handleSubmit}
                  >
                    Donate
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </div>
      </Grid>
      <Footer />
    </div>
  );
}

export default DonationPage;
