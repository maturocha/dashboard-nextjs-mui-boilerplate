'use client' // Asegura que el componente se renderice solo en el cliente

import { useState, useEffect } from 'react'
import { Formik, Form, FormikProps } from 'formik'
import { 
  TextField,
  Button,
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
import { FormValues, validationSchema } from '@/models/User'
import { useRouter } from 'next/navigation'
interface FormProps {
  values: FormValues
  isCreating?: boolean
  handleSubmit: (values: FormValues, form: any) => Promise<void>
}

export const UserForm = ({ values, isCreating = false, handleSubmit }: FormProps) => {
  const [roles, setRoles] = useState<Role[] | null>(null)
  const router = useRouter()
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

  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema(isCreating)}
      onSubmit={async (values, form) => {
        try {
          await handleSubmit(values, form)
        } catch (error) {
            form.setSubmitting(false)
            console.error('Error submitting form:', error)
        } finally {
            
          form.setSubmitting(false)
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
        <Form>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                error={touched.role_id && Boolean(errors.role_id)}
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
                  name="role_id"
                  value={values.role_id || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  disabled={!roles}
                  label="Rol *"
                >
                  {roles?.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
                {!roles && <CircularProgress size={20} sx={{ mt: 1 }} />}
                {touched.role_id && errors.role_id && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.role_id}
                  </span>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="tel"
                label="Celular"
                name="cel"
                value={values.cel}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cel && Boolean(errors.cel)}
                helperText={touched.cel && errors.cel}
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
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  required
                />
              </Grid>
            )}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 6 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  )
}
