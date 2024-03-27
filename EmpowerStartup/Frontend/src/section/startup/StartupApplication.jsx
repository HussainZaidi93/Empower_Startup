import * as React from 'react';
import Box from '@mui/material/Box';
import { useCallback, useEffect, useState } from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import Typography from '@mui/material/Typography';
import {
  Alert,
  Autocomplete,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { AttachFile } from '@mui/icons-material';
import { Post_GetAllStartupTypes_URL, Post_UploadImage_URL } from 'src/constants/apiURLs';
import { Post } from 'src/actions/API/apiActions';
import * as Yup from 'yup';

const steps = ['Basic info', 'Startup info', 'Documentation'];

export default function StartupApplication({ onSubmit }) {
  const initialValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    country: '',
    city: '',
    address: '',
    gender: 'female',
    dob: '',
    startupType: '',
    shortDescription: ' ',
    detailedDescription: ' ',
    experience: '',
    startupTypeId: '',
  };
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  //states for images
  const [cnicFront, setCnicFront] = useState();
  const [cnincFrontPreview, setCnincFrontPreview] = useState(null);
  const [cnicBack, setCnicBack] = useState();
  const [cnicBackPreview, setCnicBackPreview] = useState(null);
  const [electricityBill, setElectricityBill] = useState();
  const [electricityBillPreview, setElectricityBillPreview] = useState(null);
  const [utilityBill, setUtilityBill] = useState();
  const [utilityBillPreview, setUtilityBillPreview] = useState(null);
  const [recentImage, setRecentImage] = useState();
  const [recentImagePreview, setRecentImagePreview] = useState(null);
  const [startupTypes, setStartupTypes] = useState([]);

  const getAllStartupTypes = useCallback(() => {
    try {
      Post(
        {},
        Post_GetAllStartupTypes_URL,
        (resp) => {
          console.log('ffee', resp.data);
          setStartupTypes(resp?.data.data);
          // enqueueSnackbar('Startup types loaded', {variant : 'success'})
        },
        (error) => {
          enqueueSnackbar('Failed to load startup types', { variant: 'error' });
        }
      );
    } catch (error) {
      enqueueSnackbar('Something went wrong at server', { variant: 'error' });
    }
  }, []);

  useEffect(() => {
    getAllStartupTypes();
  }, [getAllStartupTypes]);
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCNICImageChange = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCnincFrontPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch(Post_UploadImage_URL, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          const imageName = responseData.serverFileName;
          setCnicFront(imageName);
        } else {
          enqueueSnackbar('Cannot upload images', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  const handleCnicBackImage = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCnicBackPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch(Post_UploadImage_URL, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          const imageName = responseData.serverFileName;
          setCnicBack(imageName);
        } else {
          // Handle error
          enqueueSnackbar('Cannot upload images', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  const handlElectricityBill = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setElectricityBillPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch(Post_UploadImage_URL, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          const imageName = responseData.serverFileName; // Replace 'imageName' with the actual key in your API response
          setElectricityBill(imageName);
        } else {
          // Handle error
          enqueueSnackbar('Cannot upload images', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  const handleUtilityBill = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUtilityBillPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch(Post_UploadImage_URL, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          const imageName = responseData.serverFileName; // Replace 'imageName' with the actual key in your API response
          setUtilityBill(imageName);
        } else {
          // Handle error
          enqueueSnackbar('Cannot upload images', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleRecentImageChange = async (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecentImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch(Post_UploadImage_URL, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          const imageName = responseData.serverFileName; // Replace 'imageName' with the actual key in your API response
          setRecentImage(imageName);
        } else {
          // Handle error
          enqueueSnackbar('Cannot upload images', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  const userId = localStorage.getItem('userId');

  const ValidationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required')
      .matches(/^[a-zA-Z\s]+$/, 'First Name should only contain alphabets and spaces'),
    lastName: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Last name should only contain letters and spaces')
      .required('Last name is required'),
    middleName: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Startup name should only contain letters and spaces')
      .required('Startup name is required'),
    country: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Country should only contain letters and spaces')
      .required('Country is required'),
    city: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'City should only contain letters and spaces')
      .required('City is required'),
    address: Yup.string().required('Address is required'),
    dob: Yup.string().required('Date of birth is required'),
    startupTypeId: Yup.string().required('Startup type is required'),
    shortDescription: Yup.string()
      .required('Provide a short description.')
      .min(50, 'Short description must be at least 50 characters long'),
    detailedDescription: Yup.string()
      .required('Provide a detailed description.')
      .min(100, 'Details description must be at least 100 characters long'),
  });

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" marginBottom="2rem" flexDirection="column">
        <Typography variant="h4" sx={{ color: '#0685BB', marginBottom: '1rem' }}>
          Fill Startup Application
        </Typography>
        <Typography variant="subtitle1">
          This application form is deisgned to gather essential information about the startup's needs, goals and
          visions, enabling the NGO to effectively support and facilitate its growth.
        </Typography>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps} sx={{ color: '#55BEEB' }}>
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <br />
        </Grid>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={ValidationSchema}
          onSubmit={(values, actions) => {
            actions.setSubmitting(true);
            values.cnicFront = cnicFront;
            values.cnicBack = cnicBack;
            values.elctircityBill = electricityBill;
            values.utilityBill = utilityBill;
            values.recentImage = recentImage;
            values.userId = userId;
            onSubmit(values, actions);
          }}
        >
          {({ errors, touched, handleSubmit, values, setFieldValue, getFieldProps }) => {
            return (
              <Form>
                {console.log('rerewrewrew', errors)}
                <Grid container spacing={2} p={5}>
                  {console.log('values', errors, values)}
                  {activeStep === 0 && (
                    <>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField
                          label="First Name"
                          variant="outlined"
                          id="firstName"
                          size="small"
                          name="firstName"
                          value={values.firstName}
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={Boolean(touched.firstName && errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                          {...getFieldProps('firstName')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField
                          label="Last Name"
                          variant="outlined"
                          id="lastName"
                          name="lastName"
                          value={values.lastName}
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={Boolean(touched.lastName && errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                          {...getFieldProps('lastName')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField
                          label="Startup Name"
                          variant="outlined"
                          id="middleName"
                          name="middleName"
                          value={values.middleName}
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={Boolean(touched.middleName && errors.middleName)}
                          helperText={touched.middleName && errors.middleName}
                          {...getFieldProps('middleName')}
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField
                          label="Country"
                          variant="outlined"
                          id="country"
                          name="country"
                          value={values.country}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          size="small"
                          fullWidth
                          error={Boolean(touched.country && errors.country)}
                          helperText={touched.country && errors.country}
                          {...getFieldProps('country')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField
                          label="City"
                          variant="outlined"
                          id="city"
                          name="city"
                          value={values.city}
                          size="small"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          error={Boolean(touched.city && errors.city)}
                          helperText={touched.city && errors.city}
                          {...getFieldProps('city')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField
                          label="Address"
                          variant="outlined"
                          id="address"
                          size="small"
                          name="address"
                          value={values.address}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={Boolean(touched.address && errors.address)}
                          helperText={touched.address && errors.address}
                          fullWidth
                          {...getFieldProps('address')}
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <FormControl>
                          <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            defaultValue="female"
                            name="row-radio-buttons-group"
                            onChange={(e) => setFieldValue('gender', e.target.value)}
                          >
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Non-binary" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField
                          label="Date of birth"
                          variant="outlined"
                          id="dob"
                          type="date"
                          name="dob"
                          value={values.dob}
                          size="small"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          error={Boolean(touched.dob && errors.dob)}
                          helperText={touched.dob && errors.dob}
                          {...getFieldProps('dob')}
                        />
                      </Grid>
                      <Button
                        fullWidth
                        sx={{
                          m: 1,
                          backgroundColor: '#04B17C',
                          marginLeft: '90%',
                          color: 'white',
                          borderRadius: '30px',
                          marginBottom: '2rem',
                          '&:hover': {
                            backgroundColor: '#04B17C',
                          },
                        }}
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Autocomplete
                          id="startupType"
                          fullWidth
                          size="small"
                          sx={{ m: 1, marginTop: '20px', width: '55ch' }}
                          options={startupTypes}
                          getOptionLabel={(option) => option?.startupName}
                          onChange={(event, newValue) => {
                            console.log('jhgsdfsdfdsf', newValue);
                            if (newValue) {
                              setFieldValue('startupType', newValue?.startupName);
                              setFieldValue('startupTypeId', newValue?._id);
                            } else {
                              setFieldValue('startupTypeId', '');
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Startup"
                              variant="outlined"
                              name="startupType"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              error={Boolean(touched.startupType && errors.startupType)}
                              helperText={touched.startupType && errors.startupType}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField
                          label="Describe your startup(short)"
                          variant="outlined"
                          id="shortDescription"
                          size="small"
                          multiline
                          rows={4}
                          name="shortDescription"
                          value={values.shortDescription}
                          sx={{ m: 1, width: '55ch' }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={Boolean(touched.shortDescription && errors.shortDescription)}
                          helperText={touched.shortDescription && errors.shortDescription}
                          {...getFieldProps('shortDescription')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField
                          label="Describe your startup(detailed)"
                          variant="outlined"
                          id="detailedDescription"
                          size="small"
                          multiline
                          name="detailedDescription"
                          value={values.detailedDescription}
                          rows={4}
                          sx={{ m: 1, width: '55ch' }}
                          error={Boolean(touched.detailedDescription && errors.detailedDescription)}
                          helperText={touched.detailedDescription && errors.detailedDescription}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...getFieldProps('detailedDescription')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TextField
                          label="Previous Experience(if any)"
                          variant="outlined"
                          id="experience"
                          name="experience"
                          value={values.experience}
                          size="small"
                          multiline
                          rows={2}
                          sx={{ m: 1, width: '55ch' }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          {...getFieldProps('experience')}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box display="flex" justifyContent="space-around" flexWrap={true}>
                          <Button
                            onClick={handleBack}
                            fullWidth
                            sx={{
                              backgroundColor: '#04B17C',
                              color: 'white',
                              borderRadius: '30px',
                              marginBottom: '2rem',
                              '&:hover': {
                                backgroundColor: '#04B17C',
                              },
                            }}
                          >
                            Back
                          </Button>
                          <Button
                            fullWidth
                            sx={{
                              backgroundColor: '#04B17C',
                              color: 'white',
                              borderRadius: '30px',
                              marginBottom: '2rem',
                              marginLeft: '2rem',
                              '&:hover': {
                                backgroundColor: '#04B17C',
                              },
                            }}
                            onClick={handleNext}
                          >
                            Next
                          </Button>
                        </Box>
                      </Grid>
                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="image-cnic"
                          type="file"
                          onChange={handleCNICImageChange}
                        />
                        <label htmlFor="image-cnic">
                          <TextField
                            variant="outlined"
                            fullWidth
                            disabled
                            value={cnincFrontPreview ? 'Image Selected' : 'Upload CNIC Front side'}
                            InputProps={{
                              endAdornment: (
                                <IconButton color="primary" component="span">
                                  <AttachFile />
                                </IconButton>
                              ),
                            }}
                          />
                        </label>
                        {cnincFrontPreview && (
                          <Card sx={{ maxWidth: 400 }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={cnincFrontPreview}
                              alt="Uploaded Image Preview"
                            />
                            <CardContent>
                              <Typography variant="body2" color="text.secondary">
                                CNIC Front side Preview
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="cnic-back"
                          type="file"
                          onChange={handleCnicBackImage}
                        />
                        <label htmlFor="cnic-back">
                          <TextField
                            variant="outlined"
                            fullWidth
                            disabled
                            value={cnicBackPreview ? 'Image Selected' : 'Upload CNIC Back side'}
                            InputProps={{
                              endAdornment: (
                                <IconButton color="primary" component="span">
                                  <AttachFile />
                                </IconButton>
                              ),
                            }}
                          />
                        </label>
                        {cnicBackPreview && (
                          <Card sx={{ maxWidth: 400 }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={cnicBackPreview}
                              alt="Uploaded Image Preview"
                            />
                            <CardContent>
                              <Typography variant="body2" color="text.secondary">
                                CNIC back side Preview
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="electricity"
                          type="file"
                          onChange={handlElectricityBill}
                        />
                        <label htmlFor="electricity">
                          <TextField
                            variant="outlined"
                            fullWidth
                            disabled
                            value={electricityBillPreview ? 'Image Selected' : 'Upload Electricity Bill Image'}
                            InputProps={{
                              endAdornment: (
                                <IconButton color="primary" component="span">
                                  <AttachFile />
                                </IconButton>
                              ),
                            }}
                          />
                        </label>
                        {electricityBillPreview && (
                          <Card sx={{ maxWidth: 400 }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={electricityBillPreview}
                              alt="Uploaded Image Preview"
                            />
                            <CardContent>
                              <Typography variant="body2" color="text.secondary">
                                Electricity Bill Preview
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="utility-image"
                          type="file"
                          onChange={handleUtilityBill}
                        />
                        <label htmlFor="utility-image">
                          <TextField
                            variant="outlined"
                            fullWidth
                            disabled
                            value={utilityBillPreview ? 'Image Selected' : 'Upload Utility Bill Image'}
                            InputProps={{
                              endAdornment: (
                                <IconButton color="primary" component="span">
                                  <AttachFile />
                                </IconButton>
                              ),
                            }}
                          />
                        </label>
                        {utilityBillPreview && (
                          <Card sx={{ maxWidth: 400 }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={utilityBillPreview}
                              alt="Uploaded Image Preview"
                            />
                            <CardContent>
                              <Typography variant="body2" color="text.secondary">
                                Utility Bill Preview
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="recent-image"
                          type="file"
                          onChange={handleRecentImageChange}
                        />
                        <label htmlFor="recent-image">
                          <TextField
                            variant="outlined"
                            fullWidth
                            disabled
                            value={recentImagePreview ? 'Image Selected' : 'Upload recent image'}
                            InputProps={{
                              endAdornment: (
                                <IconButton color="primary" component="span">
                                  <AttachFile />
                                </IconButton>
                              ),
                            }}
                          />
                        </label>
                        {recentImagePreview && (
                          <Card sx={{ maxWidth: 400 }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={recentImagePreview}
                              alt="Uploaded Image Preview"
                            />
                            <CardContent>
                              <Typography variant="body2" color="text.secondary">
                                Recent Image Preview
                              </Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Grid>
                      {!(
                        cnincFrontPreview &&
                        cnicBackPreview &&
                        electricityBillPreview &&
                        utilityBillPreview &&
                        recentImagePreview
                      ) && <Alert severity="error">All documents are required</Alert>}
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Box display="flex" justifyContent="space-around" flexWrap={true}>
                          <Button
                            onClick={handleBack}
                            fullWidth
                            sx={{
                              backgroundColor: '#04B17C',
                              color: 'white',
                              borderRadius: '30px',
                              marginBottom: '2rem',
                              '&:hover': {
                                backgroundColor: '#04B17C',
                              },
                            }}
                          >
                            Back
                          </Button>
                          {cnincFrontPreview &&
                            cnicBackPreview &&
                            electricityBillPreview &&
                            utilityBillPreview &&
                            recentImagePreview && (
                              <Button
                                fullWidth
                                sx={{
                                  backgroundColor: '#04B17C',
                                  color: 'white',
                                  borderRadius: '30px',
                                  marginBottom: '2rem',
                                  marginLeft: '2rem',
                                  '&:hover': {
                                    backgroundColor: '#04B17C',
                                  },
                                }}
                                onClick={() => {
                                  if (Object.keys(errors)?.length > 0) {
                                    enqueueSnackbar('Please fill all required fields', { variant: 'error' });
                                  } else {
                                    handleSubmit();
                                  }
                                }}
                              >
                                Submit
                              </Button>
                            )}
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Grid>
    </>
  );
}
