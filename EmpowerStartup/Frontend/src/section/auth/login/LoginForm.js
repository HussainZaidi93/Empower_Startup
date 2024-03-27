import { useState } from 'react';
import { Stack, IconButton, InputAdornment, TextField, Link } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../../components/iconify';
import { Form, Formik } from 'formik';
import { Email } from '@mui/icons-material';
import * as Yup from 'yup';
// ----------------------------------------------------------------------

export default function LoginForm({ onUserLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };
  const ValidationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string().required('Password is required'),

  });
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(true);
          onUserLogin(values, actions);
        }}
      >
        {({ values, errors, isSubmitting, handleSubmit, getFieldProps, touched, setFieldValue }) => {
          return (
            <Form>
              <Stack spacing={3}>
                <TextField
                  id="email"
                  name="email"
                  label="Email Address"
                  sx={{ width: '100%' }}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  {...getFieldProps('email')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  sx={{ width: '100%' }}
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
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}></Stack>
              <LoadingButton
                sx={{
                  width: '100%',
                  backgroundColor: '#04B17C',
                  color: 'white',
                  borderRadius: '30px',
                  marginBottom: '2rem',
                  '&:hover': { backgroundColor: '#04B17C' },
                }}
                // loading={isSubmitting}
                size="large"
                onClick={handleSubmit}
              >
                Login
              </LoadingButton>
            </Form>
          );
        }}
      </Formik>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2, mx: 2 }}>
        <Link variant="subtitle2" underline="hover" href="forgetPassword">
          Forgot password?
        </Link>
      </Stack>
    </>
  );
}
