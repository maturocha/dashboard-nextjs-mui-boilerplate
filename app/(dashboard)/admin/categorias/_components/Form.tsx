'use client' // Asegura que el componente se renderice solo en el cliente

import { Formik, Form } from 'formik'
import { 
  TextField,
  Button,
  Grid,
  
  Box
} from '@mui/material'
import { FormValues, validationSchema } from '@/models/Category'
import { useRouter } from 'next/navigation'
interface FormProps {
  values: FormValues
  handleSubmit: (values: FormValues, form: any) => Promise<void>
}

export const CategoryForm = ({ values, handleSubmit }: FormProps) => {
  
  const router = useRouter()
  
  return (
    <Formik
      initialValues={values}
      validationSchema={validationSchema}
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
            <Grid item xs={12}>
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

          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
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
