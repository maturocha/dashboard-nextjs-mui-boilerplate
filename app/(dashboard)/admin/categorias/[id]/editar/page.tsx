"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Container, CircularProgress } from '@mui/material'
import { CategoryForm } from '@/app/(dashboard)/admin/categorias/_components/Form'
import { FormValues, Category, api, views } from '@/models/Category'
import { apiWrapper } from '@/utils/api/apiWrapper'
import { FormikHelpers } from 'formik'
import { useAppContext } from '@/context/AppContext'
import { labels } from '@/models/Category';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<Category | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { showToast } = useAppContext()

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await apiWrapper.get(api.get.replace(':id', params.id))
        console.log(response);
        setCategory(response)
      } catch (error: any) {
        setError('Error al cargar el usuario')
        showToast('Error al cargar el usuario', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [params.id, showToast])

  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    const { setSubmitting, setErrors } = formikHelpers
    
    try {
      setSubmitting(true)
      
      const response = await apiWrapper.put(api.update.replace(':id', params.id), values)

      showToast(`${labels.singular} ${response.name} actualizada correctamente`, 'success')
      router.push(views.list)
      
    } catch (error: any) {
      const errors = error.errors || { general: 'Error al actualizar' }
      showToast('Error en la actualización', 'error')
      setErrors(errors)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error || !category) {
    return (
      <Container maxWidth="md">
        <Typography color="error" align="center">
          {error || 'Recurso no encontrado'}
        </Typography>
      </Container>
    )
  }

  const initialValues: FormValues = {
    name: category.name
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Editar {labels.singular}
        </Typography>
        
        <CategoryForm 
          values={initialValues}
          handleSubmit={handleSubmit}
        />
      </Box>
    </Container>
  )
}
