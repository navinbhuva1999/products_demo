"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Paper, Alert, Link, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Login() {
  const router = useRouter();
  const { login, authState, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    userName: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  const formik = useFormik({
    initialValues: {
      userName: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await login(values);
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

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
          Login
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
            type={showPassword ? 'text' : 'password'}
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
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
            Login
          </Button>
        </form>

        <Typography variant="body2">
          Don't have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              clearError();
              router.push('/register');
            }}
          >
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}