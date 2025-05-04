'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Container } from '@mui/material'
import { UserForm } from '@/app/(dashboard)/admin/usuarios/_components/Form'
import { FormValues, api, labels, views } from '@/models/User'
import { apiWrapper } from '@/utils/api/apiWrapper'
import { useAppContext } from '@/context/AppContext'
import PageHeader from '@/components/layout/page/PageHeader'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const defaultValues: FormValues = {
  name: '',
  email: '',
  role_id: 0,
  password: '',
  cel: '',
}

export default function CreateUserPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useAppContext();

  const handleSubmit = async (
    values: FormValues,
  ) => {
    
    try {
      setLoading(true);
      
      const response = await apiWrapper.post(api.create, values);

      showToast(`Usuario ${response.name} creado correctamente`, 'success');
      router.push(views.list);
      
    } catch (error: any) {
      const errors = error.errors || { general: 'Error al crear el usuario' };
      showToast('Error al crear el usuario', 'error');
      console.error(errors);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md">
      <PageHeader
        title={`Nuevo ${labels.singular}`}
        cta={{
          label: `Volver`,
          onClick: () => router.back(),
          icon: <ArrowBackIcon fontSize="small" />
        }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <UserForm 
          values={defaultValues}
          handleSubmit={handleSubmit}
          isCreating={true}
        />
      </Box>
    </Container>
  )
}
