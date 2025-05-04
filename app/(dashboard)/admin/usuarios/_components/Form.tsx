'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Box
} from '@mui/material'
import { Role, api as roleApi } from '@/models/Role'
import { apiWrapper } from '@/utils/api/apiWrapper'
import { FormValues, schemaCreate, schemaUpdate } from '@/models/User'
import { useRouter } from 'next/navigation'
import CustomButton from '@/components/shared/CustomButton'

interface FormProps {
  values: FormValues
  isCreating?: boolean
  handleSubmit: (values: FormValues) => Promise<void>
}

export const UserForm = ({ values, isCreating = false, handleSubmit }: FormProps) => {
  const [roles, setRoles] = useState<Role[] | null>(null)
  const router = useRouter()

  const validationSchema = isCreating ? schemaCreate : schemaUpdate

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: values
  })

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await apiWrapper.get(roleApi.list)
        setRoles(response.data)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }

    fetchRoles()
  }, [])

  const onSubmit = async (data: FormValues) => {
    try {
      await handleSubmit(data)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleFormSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nombre"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl 
            fullWidth 
            error={!!errors.role_id}
            disabled={!roles}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
              '& .MuiInputLabel-outlined': {
                backgroundColor: 'white',
                px: 0.5,
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            }}
          >
            <InputLabel 
              id="role-label"
              sx={{
                '&.Mui-focused': {
                  color: 'primary.main',
                },
              }}
            >
              Rol *
            </InputLabel>
            <Select
              labelId="role-label"
              label="Rol *"
              {...register('role_id')}
              required
              disabled={!roles}
            >
              {roles && roles?.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {!roles && <CircularProgress size={20} sx={{ mt: 1 }} />}
            {errors.role_id && (
              <span className="text-red-500 text-sm mt-1">
                {errors.role_id.message}
              </span>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="tel"
            label="Celular"
            {...register('cel')}
            error={!!errors.cel}
            helperText={errors.cel?.message}
            inputProps={{
              'aria-label': 'Número de celular',
            }}
          />
        </Grid>

        {isCreating && (
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="password"
              label="Contraseña"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              required
            />
          </Grid>
        )}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 6 }}>
        <CustomButton
          label="Cancelar"
          onClick={() => router.back()}
          variant="outlined"
          color="primary"
        />
        <CustomButton
          label={isSubmitting ? 'Guardando...' : 'Guardar'}
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        />
      </Box>
    </form>
  )
}
