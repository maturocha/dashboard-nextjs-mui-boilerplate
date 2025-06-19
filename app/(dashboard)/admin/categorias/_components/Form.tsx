'use client' // Asegura que el componente se renderice solo en el cliente

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  TextField,
  Grid,
  Box
} from '@mui/material'

import { FormValues, validationSchema } from '@/models/Category'
import { useRouter } from 'next/navigation'
import CustomButton from '@/components/shared/CustomButton'

interface FormProps {
  values: FormValues
  handleSubmit: (values: FormValues) => Promise<void>
}

export const CategoryForm = ({ values, handleSubmit }: FormProps) => {
  const router = useRouter()
  
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    setError
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: values,
    mode: 'onChange'
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await handleSubmit(data)
    } catch (error: any) {
      console.error('Error submitting form:', error)
      
      // Manejar errores específicos del servidor si existen
      if (error.errors) {
        Object.entries(error.errors).forEach(([field, message]) => {
          setError(field as keyof FormValues, {
            type: 'server',
            message: message as string
          })
        })
      } else {
        // Error general
        setError('root', {
          type: 'server',
          message: 'Error al procesar la solicitud'
        })
      }
    }
  }

  return (
    <form onSubmit={handleFormSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            required
            disabled={isSubmitting}
            autoFocus
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <CustomButton
          label="Cancelar"
          onClick={() => router.back()}
          variant="outlined"
          color="primary"
          disabled={isSubmitting}
        />
        <CustomButton
          label={isSubmitting ? 'Guardando...' : 'Guardar'}
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting || !isValid || !isDirty}
        />
      </Box>
    </form>
  )
}
