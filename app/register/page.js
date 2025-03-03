"use client";

import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Container, TextField, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const validationSchema = yup.object({
  userName: yup
    .string('Enter your email')
    .required('Username is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

export default function RegisterPage() {

  const {register} = useAuth()
  const formik = useFormik({
    initialValues: {
      userName: 'Test',
      password: '12345678',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
        register(values)
    },
  });

  return (
    <Container maxWidth="xs">
    <Typography component="h1" variant="h5">
      Sign Up
    </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="userName"
          name="userName"
          label="User Name"
          value={formik.values.userName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.userName && Boolean(formik.errors.userName)}
          helperText={formik.touched.userName && formik.errors.userName}
          sx={{mt : 3}}
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{mt : 3}}
        />
        <Button color="primary" variant="contained" fullWidth type="submit" sx={{mt : 3}}>
          Submit
        </Button>
      </form>
    </Container>
  );
};

