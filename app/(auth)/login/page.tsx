"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import InputAdornment from "@mui/material/InputAdornment"
import IconButton from "@mui/material/IconButton"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { useTheme } from "@mui/material/styles"
export default function LoginPage() {

  const theme = useTheme()
  const router = useRouter()
  
  const callbackUrl = "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {

      const result = await signIn('credentials', {
        username: email,
        password: password,
        redirect: false,
        callbackUrl: callbackUrl
      });

      if (result?.error) {
        setError("Credenciales inválidas. Por favor intente nuevamente.")
      } else if (result?.url) {
        router.push(result.url)
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Error de inicio de sesión:", error)
      setError("Ocurrió un error al iniciar sesión. Por favor intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 2,
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(99, 102, 241, 0.1) 100%)`
            : `linear-gradient(135deg, ${theme.palette.background.default} 0%, rgba(99, 102, 241, 0.05) 100%)`,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: "100%",
          borderRadius: 3,
          boxShadow: theme.palette.mode === "dark" ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.08)",
          border:
            theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(0, 0, 0, 0.02)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 6,
            bgcolor: error ? "error.main" : "primary.main",
            background: error ? `linear-gradient(90deg, ${theme.palette.error.main}, ${theme.palette.error.main})` : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          }}
        />
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {process.env.NEXT_PUBLIC_APP_NAME ?? 'Stock'} App
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Inicia sesión para acceder al sistema
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo electrónico"
              variant="outlined"
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setError("")}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setError("")}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 12px rgba(99, 102, 241, 0.3)"
                    : "0 4px 12px rgba(99, 102, 241, 0.15)",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Iniciar sesión"}
            </Button>

            {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          </form>
        </CardContent>
      </Card>
    </Box>
  )
}