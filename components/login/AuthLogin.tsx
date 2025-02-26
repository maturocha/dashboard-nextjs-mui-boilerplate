"use client"

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from "next/link";

interface LoginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  loading?: boolean;
  message?: string;
}

const AuthLogin = ({ title, subtitle, loading, message }: LoginType) => {

  const router = useRouter();
  
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .email('Debe ser un email válido')
      .required('El email es obligatorio'),
    password: Yup.string()
      .required('La contraseña es obligatoria')
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const result = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false
      });

      console.log(result);

      if (result?.error) {
        // Manejar error
        console.error(result.error);
        setError(result.error);
      } else {
        // Redireccionar al dashboard o página principal
        router.push('/');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false} // Solo validará al enviar el formulario
        validateOnBlur={true} 
      >
        {({ values, handleChange, errors, touched, isSubmitting }) => (
          <Form autoComplete="off">
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  htmlFor="username"
                  mb={1}
                >
                  Email
                </Typography>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  error={touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                  placeholder="usuario@ejemplo.com"
                />
              </Box>

              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  component="label"
                  htmlFor="password"
                  mb={1}
                >
                  Contraseña
                </Typography>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handlePasswordVisibilityToggle}
                          edge="end"
                        >
                          {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box>
                {error && (
                  <Typography color="error" mb={2}>
                    {error}
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isSubmitting || loading}
              >
                {loading ? 'Cargando...' : 'Iniciar sesión'}
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>

    </Box>
  );
};

export default AuthLogin;
