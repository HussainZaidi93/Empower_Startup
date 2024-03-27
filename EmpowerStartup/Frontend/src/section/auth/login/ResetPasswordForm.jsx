import { LoadingButton } from '@mui/lab';
import { Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import Iconify from 'src/components/iconify/Iconify';
import * as Yup from 'yup';
export default function ResetPasswordForm({ onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: '',
    newPassword: '',
    confirmPassword: '',
  };
  const basicValidationSchema = Yup.object().shape({
    newPassword: Yup.string().required('New Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={basicValidationSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          onSubmit(values, actions);
        }}
      >
        {({ touched, errors, getFieldProps, handleSubmit, isSubmitting, setSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  fullWidth
                  name="email"
                  label="Email"
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  {...getFieldProps('email')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="newPassword"
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  sx={{ width: '100%' }}
                  error={Boolean(touched.newPassword && errors.newPassword)}
                  helperText={touched.newPassword && errors.newPassword}
                  {...getFieldProps('newPassword')}
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  sx={{ width: '100%' }}
                  error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  {...getFieldProps('confirmPassword')}
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
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  loading={isSubmitting}
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Reset Password
                </LoadingButton>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
