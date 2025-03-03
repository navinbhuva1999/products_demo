"use client";

import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, TextField, Typography, Paper, Alert, Link, IconButton, InputAdornment } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const validationSchema = yup.object({
  userName: yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});

export default function Register() {
  const router = useRouter();
  const { register, authState, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const formik = useFormik({
    initialValues: {
      userName: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await register(values);
    },
  });

  const handleClickShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>

        {authState.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {authState.error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="userName"
            name="userName"
            label="Username"
            margin="normal"
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userName && Boolean(formik.errors.userName)}
            helperText={formik.touched.userName && formik.errors.userName}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type={showPassword.password ? 'text' : 'password'}
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword('password')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword.password ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type={showPassword.confirmPassword ? 'text' : 'password'}
            margin="normal"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => handleClickShowPassword('confirmPassword')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </form>

        <Typography variant="body2">
          Already have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              clearError();
              router.push('/login');
            }}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

