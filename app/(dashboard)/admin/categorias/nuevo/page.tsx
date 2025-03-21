'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Container } from '@mui/material'
import { CategoryForm } from '@/app/(dashboard)/admin/categorias/_components/Form'
import { FormValues, api, views } from '@/models/Category'
import { apiWrapper } from '@/utils/api/apiWrapper'
import { FormikHelpers } from 'formik'
import { useAppContext } from '@/context/AppContext'
import { labels } from '@/models/Category'


const defaultValues: FormValues = {
  name: ''
}

export default function CreateCategoryPage() {
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

      showToast(`${labels.singular} ${response.name} creada correctamente`, 'success');
      router.push(views.list);
      
    } catch (error: any) {
      const errors = error.errors || { general: 'Error en la creación' };
      showToast('Error en la creación', 'error');
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
              Nueva {labels.singular}
            </Typography>
            
            <CategoryForm 
              values={defaultValues}
              handleSubmit={handleSubmit}
            />
          </Box>
        
      </Box>
    </Container>
  )
}
