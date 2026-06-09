import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom";
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
import Grid from "@mui/material/Grid";
import { updateUser, getUser } from "../../services/api";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
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
  Operaciones: ["Gerente de Operaciones", "Supervision", "Coordinador de Logística", "Analista de Procesos"],
  Legal: ["Director Legal", "Asesora Legal", "Abogado Junior", "Paralegal"],
  Administración: ["Director General", "Asistente Administrativo", "Recepcionista", "Secretaria Ejecutiva"],
}

const mockUser = {
  id: 1,
  name: "Cristobal",
  apellido: "Nuñez",
  email: "cristobal.nunez@empresa.com",
  telefono: "+34 612 345 678",
  direccion: "Calle Mayor 123, Madrid",
  fecha_nacimiento: "1985-06-15",
  departamento: "Tecnología",
  cargo: "Director de TI",
  fecha_ingreso: "2023-01-15",
  supervision_general: "Director General",
  role: "admin",
  estado_cuenta: "activo",
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

export default function EditUsersPage() {
  const params = useParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  const [formData, setFormData] = useState({
    name: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    departamento: "",
    cargo: "",
    fecha_ingreso: "",
    supervision_general: "",
    role: "usuario",
    estado_cuenta: "activo",
    newPassword: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({});


    useEffect(() => {

      const loadUser = async () => {

          try {

              const user =
                  await getUser(id);

              setFormData({

                  name: user.name,
                  apellido: user.apellido,
                  email: user.email,
                  telefono: user.telefono || "",
                  direccion: user.direccion || "",
                  fecha_nacimiento:
                      user.fecha_nacimiento?.substring(0, 10) || "",
                  departamento:
                      user.departamento || "",
                  cargo:
                      user.cargo || "",
                  fecha_ingreso:
                      user.fecha_ingreso?.substring(0, 10) || "",
                  supervision_general:
                      user.supervision_general || "",
                  role:
                      user.role || "",
                  estado_cuenta:
                      user.estado_cuenta || "activo",

              });

          } catch (error) {

              console.error(error);

          }

      };

      loadUser();

  }, [id]);

  const handleChange = (field, value) => {
  setFormData({
      ...formData,
      [field]: value,
  });

  if (errors[field]) {
      setErrors({
      ...errors,
      [field]: "",
      });
  }
  };

  const handleSave = async () => {

      const newErrors = {};

      if (!formData.name) {
          newErrors.name = "El nombre es requerido";
      }

      if (!formData.apellido) {
          newErrors.apellido = "El apellido es requerido";
      }

      if (!formData.email) {
          newErrors.email = "El email es requerido";
      }

      if (!formData.departamento) {
          newErrors.departamento = "El departamento es requerido";
      }

      if (!formData.cargo) {
          newErrors.cargo = "El cargo es requerido";
      }

      if (Object.keys(newErrors).length > 0) {

          setErrors(newErrors);

          setSnackbar({
              open: true,
              message: "Por favor complete los campos requeridos",
              severity: "error",
          });

          return;
      }

      try {

          await updateUser(
              params.id,
              formData
          );

          setSnackbar({
              open: true,
              message: "Usuario actualizado correctamente",
              severity: "success",
          });

          setTimeout(() => {
              navigate("/dashboard/users");
          }, 1500);

      } catch (error) {

          console.error(error);

          setSnackbar({
              open: true,
              message:
                  error.message ||
                  "Error al actualizar usuario",
              severity: "error",
          });
      }
  };

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
      <Box sx={{ p: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/dashboard" style={{ color: "#722F37", textDecoration: "none" }}>
            Dashboard
          </Link>
          <Link to="/dashboard/users" style={{ color: "#722F37", textDecoration: "none" }}>
            Usuarios
          </Link>
          <Typography color="text.primary">Editar Usuario</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <IconButton component={Link} to="/dashboard/users" sx={{ border: 1, borderColor: "divider" }}>
            
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                Editar Usuario
              </Typography>
              <Chip
                label={formData.estado_cuenta === "activo" ? "Activo" : formData.estado_cuenta === "inactivo" ? "Inactivo" : "Pendiente"}
                color={formData.estado_cuenta === "activo" ? "success" : formData.estado_cuenta === "inactivo" ? "error" : "warning"}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              ID de Usuario: {params.id} | Creado: {mockUser.fechaCreacion}
            </Typography>
          </Box>
          <Button variant="outlined" color="error">
            Eliminar
          </Button>
        </Box>

        {/* User Header Card */}
        <Paper sx={{ p: 3, mb: 3, display: "flex", alignItems: "center", gap: 3 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar sx={{ width: 100, height: 100 }}>
            {(formData.name?.charAt(0) || "")}
            {(formData.apellido?.charAt(0) || "")}
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
              
            </IconButton>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {formData.name} {formData.apellido}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {formData.cargo} - {formData.departamento}
            </Typography>
            <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {formData.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                {formData.telefono}
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
            <Tab  iconPosition="start" label="Información Personal" />
            <Tab  iconPosition="start" label="Seguridad" />

          </Tabs>

          {/* Tab 0: Información Personal */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Datos Personales
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Apellido"
                    value={formData.apellido}
                    onChange={(e) => handleChange("apellido", e.target.value)}
                    error={!!errors.apellido}
                    helperText={errors.apellido}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={formData.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12}}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    value={formData.direccion}
                    onChange={(e) => handleChange("direccion", e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Fecha de Nacimiento"
                    type="date"
                    value={formData.fecha_nacimiento}
                    onChange={(e) => handleChange("fecha_nacimiento", e.target.value)}
                    slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Información Laboral
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth error={!!errors.departamento}>
                    <InputLabel>Departamento</InputLabel>
                    <Select
                    value={formData.departamento || ""}
                    label="Departamento"
                    onChange={(e) => {
                        console.log("Departamento seleccionado:", e.target.value);

                        handleChange("departamento", e.target.value);
                        handleChange("cargo", "");
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
                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={!!errors.cargo}>
                    <InputLabel>Cargo</InputLabel>

                    <Select
                        value={formData.cargo || ""}
                        label="Cargo"
                        onChange={(e) => handleChange("cargo", e.target.value)}
                        disabled={!formData.departamento}
                    >
                        {(cargos[formData.departamento] || []).map((cargo) => (
                        <MenuItem key={cargo} value={cargo}>
                            {cargo}
                        </MenuItem>
                        ))}
                    </Select>

                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Fecha de Ingreso"
                    type="date"
                    value={formData.fecha_ingreso}
                    onChange={(e) => handleChange("fecha_ingreso", e.target.value)}
                    slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Supervision Directo"
                    value={formData.supervision_general}
                    onChange={(e) => handleChange("supervision_general", e.target.value)}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
                <Button component={Link} to="/dashboard/users" variant="outlined" color="inherit">
                  Cancelar
                </Button>
                <Button variant="contained" onClick={handleSave} >
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
                <Grid size={{ xs: 12}}>
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
                          
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
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
                          
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                            
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
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
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Rol de Usuario</InputLabel>
                    <Select value={formData.role} label="Rol de Usuario" onChange={(e) => handleChange("role", e.target.value)}>
                      <MenuItem value="admin">Administrador</MenuItem>
                      <MenuItem value="usuario">Usuario</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Estado de la Cuenta</InputLabel>
                    <Select value={formData.estado_cuenta} label="Estado de la Cuenta" onChange={(e) => handleChange("estado_cuenta", e.target.value)}>
                      <MenuItem value="activo">Activo</MenuItem>
                      <MenuItem value="inactivo">Inactivo</MenuItem>
                      <MenuItem value="pendiente">Pendiente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
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
  )
}
