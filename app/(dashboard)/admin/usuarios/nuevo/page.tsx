'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Paper, Typography, Container } from '@mui/material'
import { UserForm } from '@/app/(dashboard)/admin/usuarios/_components/Form'
import { FormValues, api, views } from '@/models/User'
import { apiWrapper } from '@/utils/api/apiWrapper'
import { FormikHelpers } from 'formik'
import { useAppContext } from '@/context/AppContext'


const defaultValues: FormValues = {
  name: '',
  email: '',
  role_id: '',
  password: '',
  cel: '',
}

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useAppContext();

  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    const { setSubmitting, setErrors } = formikHelpers;
    
    try {
      setSubmitting(true);
      
      const response = await apiWrapper.post(api.create, values);

      showToast(`Usuario ${response.name} creado correctamente`, 'success');
      router.push(views.list);
      
    } catch (error: any) {
      const errors = error.errors || { general: 'Error al crear el usuario' };
      showToast('Error al crear el usuario', 'error');
      setErrors(errors);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Nuevo Usuario
            </Typography>
            
            <UserForm 
              values={defaultValues}
              handleSubmit={handleSubmit}
              isCreating={true}
            />
          </Box>
        
      </Box>
    </Container>
  )
}
