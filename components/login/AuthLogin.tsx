"use client"

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

interface LoginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  loading?: boolean;
  message?: string;
}

const loginSchema = z.object({
  username: z.string()
    .email('Debe ser un email válido')
    .min(1, 'El email es obligatorio'),
  password: z.string()
    .min(1, 'La contraseña es obligatoria')
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AuthLogin = ({ title, subtitle, loading, message }: LoginType) => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const result = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false
      });

      if (result?.error) {
        console.error(result.error);
        setError(result.error);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Stack spacing={2}>
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
              {...register('username')}
              onFocus={() => setError('')}
              error={!!errors.username}
              helperText={errors.username?.message}
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
              type={passwordVisible ? 'text' : 'password'}
              {...register('password')}
              onFocus={() => setError('')}
              error={!!errors.password}
              helperText={errors.password?.message}
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
              <Typography color="error">
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
            {loading ? 'Cargando...' : 'Ingresar'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default AuthLogin;
