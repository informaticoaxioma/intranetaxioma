"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Breadcrumbs,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { muiTheme } from "@/lib/mui-theme"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  IconChevronLeft,
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
  IconEye,
  IconEyeOff,
  IconCamera,
  IconCheck,
} from "../../../components/icons"

const steps = ["Información Personal", "Información Laboral", "Acceso y Permisos"]

const departamentos = [
  "Tecnología",
  "Recursos Humanos",
  "Finanzas",
  "Marketing",
  "Ventas",
  "Operaciones",
  "Legal",
  "Administración",
]

const cargos = {
  Tecnología: ["Director de TI", "Desarrollador Senior", "Desarrollador Junior", "Analista de Sistemas", "Soporte Técnico"],
  "Recursos Humanos": ["Gerente de RRHH", "Analista de RRHH", "Reclutador", "Especialista en Nóminas"],
  Finanzas: ["Director Financiero", "Analista Financiero", "Contador", "Tesorero"],
  Marketing: ["Director de Marketing", "Coordinador de Marketing", "Community Manager", "Diseñador Gráfico"],
  Ventas: ["Director de Ventas", "Gerente de Ventas", "Ejecutivo de Ventas", "Representante Comercial"],
  Operaciones: ["Gerente de Operaciones", "Supervisor", "Coordinador de Logística", "Analista de Procesos"],
  Legal: ["Director Legal", "Asesora Legal", "Abogado Junior", "Paralegal"],
  Administración: ["Director General", "Asistente Administrativo", "Recepcionista", "Secretaria Ejecutiva"],
}

export default function CrearUsuarioPage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    fechaNacimiento: "",
    departamento: "",
    cargo: "",
    fechaIngreso: "",
    supervisor: "",
    rol: "usuario",
    password: "",
    confirmPassword: "",
    enviarCredenciales: true,
    requiereCambioPassword: true,
    estado: "activo",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (!formData.nombre) newErrors.nombre = "El nombre es requerido"
      if (!formData.apellido) newErrors.apellido = "El apellido es requerido"
      if (!formData.email) {
        newErrors.email = "El email es requerido"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "El email no es válido"
      }
    } else if (step === 1) {
      if (!formData.departamento) newErrors.departamento = "El departamento es requerido"
      if (!formData.cargo) newErrors.cargo = "El cargo es requerido"
    } else if (step === 2) {
      if (!formData.password) {
        newErrors.password = "La contraseña es requerida"
      } else if (formData.password.length < 8) {
        newErrors.password = "La contraseña debe tener al menos 8 caracteres"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      setSnackbar({ open: true, message: "Usuario creado correctamente", severity: "success" })
      setTimeout(() => {
        router.push("/dashboard/usuarios")
      }, 1500)
    }
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar sx={{ width: 120, height: 120, bgcolor: "#722F37", fontSize: "2.5rem" }}>
                  {formData.nombre ? formData.nombre[0] : ""}
                  {formData.apellido ? formData.apellido[0] : ""}
                </Avatar>
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "#4A1C23",
                    color: "white",
                    "&:hover": { bgcolor: "#722F37" },
                  }}
                  size="small"
                >
                  <IconCamera className="w-4 h-4" />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                error={!!errors.nombre}
                helperText={errors.nombre}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconUser className="w-5 h-5 text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Apellido"
                value={formData.apellido}
                onChange={(e) => handleChange("apellido", e.target.value)}
                error={!!errors.apellido}
                helperText={errors.apellido}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconUser className="w-5 h-5 text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconMail className="w-5 h-5 text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconPhone className="w-5 h-5 text-gray-400" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Dirección"
                value={formData.direccion}
                onChange={(e) => handleChange("direccion", e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        )
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.departamento}>
                <InputLabel>Departamento</InputLabel>
                <Select
                  value={formData.departamento}
                  label="Departamento"
                  onChange={(e) => {
                    handleChange("departamento", e.target.value)
                    handleChange("cargo", "")
                  }}
                >
                  {departamentos.map((dep) => (
                    <MenuItem key={dep} value={dep}>
                      {dep}
                    </MenuItem>
                  ))}
                </Select>
                {errors.departamento && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.departamento}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.cargo} disabled={!formData.departamento}>
                <InputLabel>Cargo</InputLabel>
                <Select value={formData.cargo} label="Cargo" onChange={(e) => handleChange("cargo", e.target.value)}>
                  {formData.departamento &&
                    cargos[formData.departamento as keyof typeof cargos]?.map((cargo) => (
                      <MenuItem key={cargo} value={cargo}>
                        {cargo}
                      </MenuItem>
                    ))}
                </Select>
                {errors.cargo && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.cargo}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Ingreso"
                type="date"
                value={formData.fechaIngreso}
                onChange={(e) => handleChange("fechaIngreso", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Supervisor Directo"
                value={formData.supervisor}
                onChange={(e) => handleChange("supervisor", e.target.value)}
                placeholder="Nombre del supervisor"
              />
            </Grid>
          </Grid>
        )
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Rol de Usuario</InputLabel>
                <Select value={formData.rol} label="Rol de Usuario" onChange={(e) => handleChange("rol", e.target.value)}>
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="editor">Editor</MenuItem>
                  <MenuItem value="usuario">Usuario</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                {formData.rol === "admin" && "Acceso completo a todas las funcionalidades del sistema."}
                {formData.rol === "editor" && "Puede crear y editar contenido, pero no administrar usuarios."}
                {formData.rol === "usuario" && "Acceso básico de solo lectura y funciones limitadas."}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado Inicial</InputLabel>
                <Select value={formData.estado} label="Estado Inicial" onChange={(e) => handleChange("estado", e.target.value)}>
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="pendiente">Pendiente de Activación</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Credenciales de Acceso
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                error={!!errors.password}
                helperText={errors.password || "Mínimo 8 caracteres"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconLock className="w-5 h-5 text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconLock className="w-5 h-5 text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Opciones Adicionales
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enviarCredenciales}
                    onChange={(e) => handleChange("enviarCredenciales", e.target.checked)}
                    color="primary"
                  />
                }
                label="Enviar credenciales por correo electrónico"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.requiereCambioPassword}
                    onChange={(e) => handleChange("requiereCambioPassword", e.target.checked)}
                    color="primary"
                  />
                }
                label="Requerir cambio de contraseña en el primer inicio de sesión"
              />
            </Grid>
          </Grid>
        )
      default:
        return null
    }
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ p: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/dashboard" style={{ color: "#722F37", textDecoration: "none" }}>
            Dashboard
          </Link>
          <Link href="/dashboard/usuarios" style={{ color: "#722F37", textDecoration: "none" }}>
            Usuarios
          </Link>
          <Typography color="text.primary">Crear Usuario</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton component={Link} href="/dashboard/usuarios" sx={{ border: 1, borderColor: "divider" }}>
            <IconChevronLeft className="w-5 h-5" />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Crear Nuevo Usuario
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete la información para registrar un nuevo usuario en el sistema
            </Typography>
          </Box>
        </Box>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Form Content */}
        <Paper sx={{ p: 4 }}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
            <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
              Anterior
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button component={Link} href="/dashboard/usuarios" variant="outlined" color="inherit">
                Cancelar
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button onClick={handleSubmit} variant="contained" startIcon={<IconCheck className="w-5 h-5" />}>
                  Crear Usuario
                </Button>
              ) : (
                <Button onClick={handleNext} variant="contained">
                  Siguiente
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}
