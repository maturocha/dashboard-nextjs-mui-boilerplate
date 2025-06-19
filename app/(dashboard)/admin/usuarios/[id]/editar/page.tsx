"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Typography, Container, CircularProgress } from '@mui/material'
import { UserForm } from '@/app/(dashboard)/admin/usuarios/_components/Form'
import { FormValues, User, api, views } from '@/models/User'
import { apiWrapper } from '@/utils/api/apiWrapper'
import { useAppContext } from '@/context/AppContext'

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { showToast } = useAppContext()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiWrapper.get(api.get.replace(':id', params.id))
        console.log(response);
        setUser(response)
      } catch (error: any) {
        setError('Error al cargar el usuario')
        showToast('Error al cargar el usuario', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [params.id, showToast])

  const handleSubmit = async (values: FormValues) => {
    try {
      const response = await apiWrapper.put(api.update.replace(':id', params.id), values)

      showToast(`Usuario ${response.name} actualizado correctamente`, 'success')
      router.push(views.list)
      
    } catch (error: any) {
      showToast('Error al actualizar el usuario', 'error')
      throw error // Re-lanzar el error para que React Hook Form lo maneje
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

  if (error || !user) {
    return (
      <Container maxWidth="md">
        <Typography color="error" align="center">
          {error || 'Usuario no encontrado'}
        </Typography>
      </Container>
    )
  }

  const initialValues: FormValues = {
    name: user.name,
    email: user.email,
    role_id: user.role_id,
    password: '',
    cel: user.cel || '',
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Editar Usuario
        </Typography>
        
        <UserForm 
          values={initialValues}
          handleSubmit={handleSubmit}
          isCreating={false}
        />
      </Box>
    </Container>
  )
}
