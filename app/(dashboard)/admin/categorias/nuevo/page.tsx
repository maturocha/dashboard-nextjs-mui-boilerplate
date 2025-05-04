'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Container } from '@mui/material'
import { CategoryForm } from '@/app/(dashboard)/admin/categorias/_components/Form'
import { FormValues, api, views } from '@/models/Category'
import { apiWrapper } from '@/utils/api/apiWrapper'
import { FormikHelpers } from 'formik'
import { useAppContext } from '@/context/AppContext'
import { labels } from '@/models/Category'
import PageHeader from '@/components/layout/page/PageHeader'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const defaultValues: FormValues = {
  name: ''
}

export default function CreateCategoryPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useAppContext();

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      const response = await apiWrapper.post(api.create, values);

      showToast(`${labels.singular} ${response.name} creada correctamente`, 'success');
      router.push(views.list);
      
    } catch (error: any) {
      showToast('Error en la creación', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <PageHeader
          title={`Nueva ${labels.singular}`}
          cta={{
            label: `Volver`,
            onClick: () => router.back(),
            icon: <ArrowBackIcon fontSize="small" />
          }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }} maxWidth={'md'}>
        
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <CategoryForm 
              values={defaultValues}
              handleSubmit={handleSubmit}
            />
          </Box>
        
      </Box>
    </Container>
  )
}
