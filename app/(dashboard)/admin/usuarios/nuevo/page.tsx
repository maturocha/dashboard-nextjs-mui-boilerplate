'use client'

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
  const router = useRouter()
  const { showToast } = useAppContext();

  const handleSubmit = async (values: FormValues) => {
    try {
      const response = await apiWrapper.post(api.create, values);

      showToast(`Usuario ${response.name} creado correctamente`, 'success');
      router.push(views.list);
      
    } catch (error: any) {
      showToast('Error al crear el usuario', 'error');
      console.error(error);
      throw error // Re-lanzar el error para que React Hook Form lo maneje
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
