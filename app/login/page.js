"use client";

import { FormEvent } from 'react'
import { Form, useFormik } from 'formik'
import * as yup from 'yup';
import { Button, Container, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const validationSchema = yup.object({
  userName: yup.string().required('Required'),
  password: yup.string().required('Required'),
});

export default function LoginPage() {
  const router = useRouter()

  const {login} = useAuth()

 const formik = useFormik({
    initialValues : {
        userName : "Test 1",
        password : "12345678"
    },
    validationSchema : validationSchema,
    onSubmit : (values) => {
      login(values)
    }
 })
 
  return (
    <Container maxWidth="xs">
      
        <Typography component="h1" variant="h5">
          Sign in
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
              />
              <Button color="primary" variant="contained" fullWidth type="submit">
                Submit
              </Button>
            </form>
    </Container>

  )
}