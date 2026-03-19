"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
  Tabs,
  Tab,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
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
  IconShield,
  IconClock,
  IconSettings,
  IconTrash2,
} from "../../../../components/icons"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

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

const mockUser = {
  id: 1,
  nombre: "Cristobal",
  apellido: "Nuñez",
  email: "cristobal.nunez@empresa.com",
  telefono: "+34 612 345 678",
  direccion: "Calle Mayor 123, Madrid",
  fechaNacimiento: "1985-06-15",
  departamento: "Tecnología",
  cargo: "Director de TI",
  fechaIngreso: "2023-01-15",
  supervisor: "Director General",
  rol: "admin",
  estado: "activo",
  ultimoAcceso: "2024-03-18 09:30",
  fechaCreacion: "2023-01-15",
}

const activityLog = [
  { fecha: "2024-03-18 09:30", accion: "Inicio de sesión", ip: "192.168.1.100" },
  { fecha: "2024-03-17 14:45", accion: "Actualizó documento: Política de Seguridad", ip: "192.168.1.100" },
  { fecha: "2024-03-17 10:20", accion: "Inicio de sesión", ip: "192.168.1.100" },
  { fecha: "2024-03-16 16:30", accion: "Creó nuevo evento: Reunión de Equipo", ip: "192.168.1.105" },
  { fecha: "2024-03-16 09:15", accion: "Inicio de sesión", ip: "192.168.1.105" },
]

export default function EditarUsuarioPage() {
  const params = useParams()
  const router = useRouter()
  const [tabValue, setTabValue] = useState(0)
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
    estado: "activo",
    newPassword: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Simular carga de datos del usuario
    setFormData({
      nombre: mockUser.nombre,
      apellido: mockUser.apellido,
      email: mockUser.email,
      telefono: mockUser.telefono,
      direccion: mockUser.direccion,
      fechaNacimiento: mockUser.fechaNacimiento,
      departamento: mockUser.departamento,
      cargo: mockUser.cargo,
      fechaIngreso: mockUser.fechaIngreso,
      supervisor: mockUser.supervisor,
      rol: mockUser.rol,
      estado: mockUser.estado,
      newPassword: "",
      confirmPassword: "",
    })
  }, [params.id])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const handleSave = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nombre) newErrors.nombre = "El nombre es requerido"
    if (!formData.apellido) newErrors.apellido = "El apellido es requerido"
    if (!formData.email) newErrors.email = "El email es requerido"
    if (!formData.departamento) newErrors.departamento = "El departamento es requerido"
    if (!formData.cargo) newErrors.cargo = "El cargo es requerido"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSnackbar({ open: true, message: "Por favor complete los campos requeridos", severity: "error" })
      return
    }

    setSnackbar({ open: true, message: "Usuario actualizado correctamente", severity: "success" })
    setTimeout(() => {
      router.push("/dashboard/users")
    }, 1500)
  }

  const handleChangePassword = () => {
    if (!formData.newPassword) {
      setErrors({ ...errors, newPassword: "La contraseña es requerida" })
      return
    }
    if (formData.newPassword.length < 8) {
      setErrors({ ...errors, newPassword: "Mínimo 8 caracteres" })
      return
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Las contraseñas no coinciden" })
      return
    }

    setSnackbar({ open: true, message: "Contraseña actualizada correctamente", severity: "success" })
    setFormData({ ...formData, newPassword: "", confirmPassword: "" })
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ p: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/dashboard" style={{ color: "#722F37", textDecoration: "none" }}>
            Dashboard
          </Link>
          <Link href="/dashboard/users" style={{ color: "#722F37", textDecoration: "none" }}>
            Usuarios
          </Link>
          <Typography color="text.primary">Editar Usuario</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton component={Link} href="/dashboard/users" sx={{ border: 1, borderColor: "divider" }}>
            <IconChevronLeft className="w-5 h-5" />
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Editar Usuario
              </Typography>
              <Chip
                label={formData.estado === "activo" ? "Activo" : formData.estado === "inactivo" ? "Inactivo" : "Pendiente"}
                color={formData.estado === "activo" ? "success" : formData.estado === "inactivo" ? "error" : "warning"}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              ID de Usuario: {params.id} | Creado: {mockUser.fechaCreacion}
            </Typography>
          </Box>
          <Button variant="outlined" color="error" startIcon={<IconTrash2 className="w-4 h-4" />}>
            Eliminar
          </Button>
        </Box>

        {/* User Header Card */}
        <Paper sx={{ p: 3, mb: 3, display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar sx={{ width: 100, height: 100, bgcolor: "#722F37", fontSize: "2rem" }}>
              {formData.nombre[0]}
              {formData.apellido[0]}
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
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {formData.nombre} {formData.apellido}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {formData.cargo} - {formData.departamento}
            </Typography>
            <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <IconMail className="w-4 h-4" /> {formData.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <IconPhone className="w-4 h-4" /> {formData.telefono}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" color="text.secondary">
              Último acceso
            </Typography>
            <Typography variant="body2">{mockUser.ultimoAcceso}</Typography>
          </Box>
        </Paper>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
            <Tab icon={<IconUser className="w-4 h-4" />} iconPosition="start" label="Información Personal" />
            <Tab icon={<IconShield className="w-4 h-4" />} iconPosition="start" label="Seguridad" />
            <Tab icon={<IconClock className="w-4 h-4" />} iconPosition="start" label="Actividad" />
            <Tab icon={<IconSettings className="w-4 h-4" />} iconPosition="start" label="Configuración" />
          </Tabs>

          {/* Tab 0: Información Personal */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Datos Personales
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    value={formData.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    error={!!errors.nombre}
                    helperText={errors.nombre}
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
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={formData.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
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

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Información Laboral
              </Typography>
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
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.cargo}>
                    <InputLabel>Cargo</InputLabel>
                    <Select value={formData.cargo} label="Cargo" onChange={(e) => handleChange("cargo", e.target.value)}>
                      {formData.departamento &&
                        cargos[formData.departamento as keyof typeof cargos]?.map((cargo) => (
                          <MenuItem key={cargo} value={cargo}>
                            {cargo}
                          </MenuItem>
                        ))}
                    </Select>
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
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
                <Button component={Link} href="/dashboard/users" variant="outlined" color="inherit">
                  Cancelar
                </Button>
                <Button variant="contained" onClick={handleSave} startIcon={<IconCheck className="w-5 h-5" />}>
                  Guardar Cambios
                </Button>
              </Box>
            </Box>
          </TabPanel>

          {/* Tab 1: Seguridad */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Cambiar Contraseña
              </Typography>
              <Grid container spacing={3} sx={{ maxWidth: 600 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nueva Contraseña"
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword || "Mínimo 8 caracteres"}
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
                <Grid item xs={12}>
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
                  <Button variant="contained" onClick={handleChangePassword}>
                    Actualizar Contraseña
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Rol y Permisos
              </Typography>
              <Grid container spacing={3} sx={{ maxWidth: 600 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Rol de Usuario</InputLabel>
                    <Select value={formData.rol} label="Rol de Usuario" onChange={(e) => handleChange("rol", e.target.value)}>
                      <MenuItem value="admin">Administrador</MenuItem>
                      <MenuItem value="editor">Editor</MenuItem>
                      <MenuItem value="usuario">Usuario</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Estado de la Cuenta</InputLabel>
                    <Select value={formData.estado} label="Estado de la Cuenta" onChange={(e) => handleChange("estado", e.target.value)}>
                      <MenuItem value="activo">Activo</MenuItem>
                      <MenuItem value="inactivo">Inactivo</MenuItem>
                      <MenuItem value="pendiente">Pendiente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          {/* Tab 2: Actividad */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Registro de Actividad
              </Typography>
              <List>
                {activityLog.map((log, index) => (
                  <ListItem key={index} divider={index < activityLog.length - 1}>
                    <ListItemIcon>
                      <IconClock className="w-5 h-5 text-gray-400" />
                    </ListItemIcon>
                    <ListItemText
                      primary={log.accion}
                      secondary={`${log.fecha} | IP: ${log.ip}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </TabPanel>

          {/* Tab 3: Configuración */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Preferencias de Notificaciones
              </Typography>
              <Box sx={{ maxWidth: 600 }}>
                <FormControlLabel
                  control={<Switch defaultChecked color="primary" />}
                  label="Recibir notificaciones por correo electrónico"
                />
                <FormControlLabel
                  control={<Switch defaultChecked color="primary" />}
                  label="Notificaciones de nuevos documentos"
                />
                <FormControlLabel
                  control={<Switch defaultChecked color="primary" />}
                  label="Recordatorios de eventos"
                />
                <FormControlLabel
                  control={<Switch color="primary" />}
                  label="Resumen semanal de actividad"
                />
              </Box>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" fontWeight={600} gutterBottom color="error">
                Zona de Peligro
              </Typography>
              <Alert severity="warning" sx={{ mb: 2, maxWidth: 600 }}>
                Las siguientes acciones son irreversibles. Proceda con precaución.
              </Alert>
              <Button variant="outlined" color="error" startIcon={<IconTrash2 className="w-4 h-4" />}>
                Eliminar Cuenta Permanentemente
              </Button>
            </Box>
          </TabPanel>
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
