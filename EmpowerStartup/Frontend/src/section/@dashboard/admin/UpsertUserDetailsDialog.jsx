import { AttachFile, Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { Post_GetAllStartupTypes_URL, Post_UploadImage_URL } from 'src/constants/apiURLs';
import { Post } from 'src/actions/API/apiActions';

function UpsertUserDetailsDialog({ open, onClose, editUser, onSubmit, role }) {
  console.log("user", role)
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [supplierCategory, setSupplierCategory] = useState([]);
  const [startupTypeId, setStartupTypeId] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const initialValues = {
    id: editUser ? editUser?._id : '',
    firstName: editUser ? editUser.firstName : '',
    lastName: editUser ? editUser?.lastName : '',
    email: editUser ? editUser?.email : '',
    password: editUser ? editUser?.password : '',
    confirmPassword: editUser ? editUser?.password : '',
    phone: editUser ? editUser?.phone : '',
    cnic: editUser ? editUser?.cnic : '',
    location: editUser ? editUser?.location : '',
  };

  const ValidationSchema = Yup.object().shape({
    firstName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'First name should only contain letters and spaces')
    .required('First name is required'),
    lastName: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, 'Last name should only contain letters and spaces')
    .required('Last name is required'),
    cnic: Yup.string().required('CNIC is required'),
    phone: Yup.string()
    .matches(/^[0-9\s]+$/, 'Phone number should only contain digits')
    .required('Phone number is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    // profileImage: Yup.mixed().required('Profile image is required'), // Add validation for profileimage
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        // Assuming you have an API endpoint for uploading images
        const response = await fetch(Post_UploadImage_URL, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const responseData = await response.json();
          const imageName = responseData.serverFileName; // Replace 'imageName' with the actual key in your API response
          setProfileImage(imageName);
          // You can also set the image name to a state if needed
          // setImageName(imageName);
        } else {
          // Handle error
          enqueueSnackbar('Cannot upload images', { variant: 'error' });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };
  //function to get the start up name 
  function getStartupName(startupsData, userInfo) {
    // Find the startup with the corresponding startuptypeid
    const startup = startupsData.find(startup => startup?._id === userInfo?.startTypeId);

    // If startup is found, return its name, otherwise return null
    return startup ? startup.startupName : null;
  }

  const getAllStartupTypes = useCallback(() => {
    try {
      Post(
        {},
        Post_GetAllStartupTypes_URL,
        (resp) => {
          console.log('startups', resp.data.data)
          setSupplierCategory(resp?.data.data);
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

  const startupName = getStartupName(supplierCategory, editUser);

  useEffect(() => {
    getAllStartupTypes();
  }, [getAllStartupTypes]);

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">{editUser ? 'Update User Details' : `Add ${role ? role : 'User'}`}</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <br />
          {role === 'Supplier' && editUser &&
            <Box display='flex' justifyContent='flex-start'>
              <Typography variant='h6'>Supplier Category : {startupName ? startupName : 'Not provided'}</Typography>
            </Box>}
          <br />
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={ValidationSchema}
            onSubmit={(values, actions) => {
              actions.setSubmitting(true);
              values.isVarified = true;
              values.status = 'active';
              values.profileImage = profileImage;
              if (role === 'Supplier') {
                values.startTypeId = startupTypeId
              }
              onSubmit(values, actions);
            }}
          >
            {({ errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps }) => (
              <Form>
                {console.log('errrr', errors)}
                <Stack spacing={3}>

                  <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                    <TextField
                      label="First Name"
                      variant="outlined"
                      id="firstName"
                      name="firstName"
                      size="small"
                      value={values.firstName}
                      sx={{ width: '100%' }}
                      error={Boolean(touched.firstName && errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      {...getFieldProps('firstName')}
                    />
                    <TextField
                      label="Last Name"
                      variant="outlined"
                      id="lastName"
                      size="small"
                      value={values?.lastName}
                      name="lastName"
                      sx={{ width: '100%' }}
                      error={Boolean(touched.lastName && errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      {...getFieldProps('lastName')}
                    />
                  </Box>
                  <TextField
                    label="Email Address"
                    variant="outlined"
                    id="email"
                    size="small"
                    value={values?.email}
                    fullWidth
                    sx={{ width: '100%' }}
                    name="email"
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    {...getFieldProps('email')}
                  />
                  <TextField
                    label="Phone"
                    variant="outlined"
                    id="phone"
                    size="small"
                    value={values?.phone}
                    fullWidth
                    sx={{ width: '100%' }}
                    name="phone"
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      
                      // Remove all non-digit characters
                      value = value.replace(/\D/g, '');
                    
                      // If the value is longer than 11 characters, trim it
                      if (value.length > 11) {
                        value = value.substring(0, 11);
                      }
                    
                      // Update the field value
                      setFieldValue('phone', value);
                    }}
                  />

                  <TextField
                    id="cnic"
                    fullWidth
                    size="small"
                    name="cnic"
                    value={values.cnic}
                    label="CNIC"
                    error={Boolean(touched.cnic && errors.cnic)}
                    helperText={touched.cnic && errors.cnic}
                    onChange={(e) => {
                      const value = e.target.value;

                      // insert a dash after 5 digits, and after 13 digits
                      let formattedValue = value.replace(/\D/g, '').replace(/^(.{5})(.{7})(.*)$/, '$1-$2-$3');

                      // let formattedValue = value.replace(/\D/g, ''); // Remove non-digit characters

                      if (formattedValue.length > 15) {
                        formattedValue = formattedValue.substring(0, 15); // Limit the length to 13 characters
                      }

                      setFieldValue('cnic', formattedValue);
                    }}
                  />
                  <TextField
                    label="Location"
                    variant="outlined"
                    id="location"
                    size="small"
                    fullWidth
                    sx={{ width: '100%' }}
                    name="location"
                    error={Boolean(touched.location && errors.location)}
                    helperText={touched.location && errors.location}
                    {...getFieldProps('location')}
                  />

                  {role === 'Supplier' && !editUser && (
                    <Autocomplete
                      id="category"
                      fullWidth
                      size="small"
                      options={supplierCategory}
                      getOptionLabel={(option) => option.startupName}
                      onChange={(event, newValue) => {
                        console.log('category', newValue);
                        setStartupTypeId(newValue?._id);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Supply Category"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={Boolean(touched.category && errors.category)}
                          helperText={touched.category && errors.category}
                        />
                      )}
                    />
                  )}
                  <Box sx={{ width: '100%' }}>
                    {/* <UploadImage 
                        onSubmit={(fileName) => setFieldValue('profileImage', fileName)} /> */}
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload">
                      <TextField
                        variant="outlined"
                        fullWidth
                        disabled
                        value={imagePreview ? 'Image Selected' : 'Select profile image'}
                        InputProps={{
                          endAdornment: (
                            <IconButton color="primary" component="span">
                              <AttachFile />
                            </IconButton>
                          ),
                        }}
                      />
                    </label>
                    {imagePreview && (
                      <Card sx={{ maxWidth: 400 }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={imagePreview ? imagePreview : values.profileImage}
                          alt="Uploaded Image Preview"
                        />
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">
                            Uploaded Image Preview
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                  {!editUser && (
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                      <TextField
                        id="password"
                        size="small"
                        name="password"
                        value={values?.password}
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                        {...getFieldProps('password')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        id="confirmPassword"
                        size="small"
                        {...getFieldProps('confirmPassword')}
                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  )}
                </Stack>
                <br />
                <Box display="flex" justifyContent="center">
                  <LoadingButton
                    sx={{
                      width: '100%',
                      backgroundColor: '#04B17C',
                      color: 'white',
                      borderRadius: '30px',
                      marginBottom: '2rem',
                      '&:hover': { backgroundColor: '#04B17C' },
                    }}
                    loading={isSubmitting}
                    size="large"
                    onClick={handleSubmit}
                  >
                    {editUser ? 'Update  details' : `Add ${role ? role : 'User'}`}
                  </LoadingButton>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UpsertUserDetailsDialog;
