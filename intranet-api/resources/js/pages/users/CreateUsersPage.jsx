import { useState, useEffect } from "react"
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
  Stepper,
  Step,
  StepLabel,
} from "@mui/material"
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

import { createUser } from "../../services/api";

const steps = ["Información Personal", "Información Laboral", "Acceso y Permisos"]

const departamentos = [
  "Tecnología",
  "Recursos Humanos",
  "Finanzas",
  "Flota",
  "Calidad",
  "Contabilidad",
  "Operaciones",
  "Legal",
  "Administración",
  "Asesorías",
  "Estudio",
  "Concesiones",
  "Prevención de Riesgos"
]

const cargos = {
  Tecnología: ["Director de TI", "Desarrollador Senior", "Desarrollador Junior", "Analista de Sistemas", "Soporte Técnico"],
  "Recursos Humanos": ["Gerente de RRHH", "Jefa de RRHH y Contabilidad", "Analista de RRHH", "Reclutador", "Asistente Contrato RRHH", "Especialista en Nóminas"],
  Calidad: ["Jefe Gestión de Calidad"],
  Contabilidad: ["Asistente Contable", "Analista Contable"],
  Finanzas: ["Director Financiero", "Analista Financiero", "Contador", "Tesorero"],
  Marketing: ["Director de Marketing", "Coordinador de Marketing", "Community Manager", "Diseñador Gráfico"],
  Flota: ["Asistente de Flota"],
  Ventas: ["Director de Ventas", "Gerente de Ventas", "Ejecutivo de Ventas", "Representante Comercial"],
  Operaciones: ["Gerente de Operaciones", "Supervisor", "Coordinador de Logística", "Analista de Procesos"],
  Legal: ["Director Legal", "Asesora Legal", "Abogado Junior", "Paralegal"],
  Administración: ["Director General", "Asistente Administrativo", "Recepcionista", "Secretaria Ejecutiva"],
}

export default function CreateUsersPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [formData, setFormData] = useState({
    name: "",
    apellido: "",
    rut: "",
    email: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    departamento: "",
    cargo: "",
    fecha_ingreso: "",
    contrato: "",
    supervision_general: "",
    role: "user",
    password: "",
    confirmPassword: "",
    enviarCredenciales: true,
    requiereCambioPassword: true,
    estado_cuenta: "activo",
    foto_perfil: null
  })

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    console.log(field, value);

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.name) newErrors.name = "El nombre es requerido"
      if (!formData.apellido) newErrors.apellido = "El apellido es requerido"
      if (!formData.rut) newErrors.rut = "El RUT es requerido"
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
        navigate("/dashboard/users");
      }, 1500)
    }
  }

  const handleSave = async () => {
    const newErrors = {};
    if (!formData.name)
      newErrors.name = "El nombre es requerido";
    if (!formData.apellido)
      newErrors.apellido = "El apellido es requerido";
    if (!formData.rut)
      newErrors.rut = "El RUT es requerido";
    if (!formData.email)
      newErrors.email = "El email es requerido";
    if (!formData.departamento)
      newErrors.departamento = "El departamento es requerido";
    if (!formData.cargo)
      newErrors.cargo = "El cargo es requerido";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Datos enviados:", formData);

    try {
      const response =
        await createUser(formData);
      console.log(response);
      setSnackbar({
        open: true,
        message:
          "Usuario creado correctamente",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/dashboard/users");
      }, 1500);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid xs={12} sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar sx={{ width: 120, height: 120, bgcolor: "#722F37", fontSize: "2.5rem" }}>
                  {formData.name ? formData.name[0] : ""}
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

                </IconButton>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nombre"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="RUT"
                value={formData.rut}
                onChange={(e) => handleChange("rut", e.target.value)}
                error={!!errors.rut}
                helperText={errors.rut || "Ej: 12.345.678-9"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => handleChange("telefono", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
        )
      case 1:
        return (
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
              <TextField
                fullWidth
                label="Cargo"
                value={formData.cargo || ""}
                onChange={(e) => handleChange("cargo", e.target.value)}
                error={!!errors.cargo}
                helperText={errors.cargo}
              />
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
                label="Supervisor Directo"
                value={formData.supervision_general}
                onChange={(e) => handleChange("supervision_general", e.target.value)}
                placeholder="Nombre del Supervisor"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Contrato</InputLabel>
                <Select
                  value={formData.contrato || ""}
                  label="Contrato"
                  onChange={(e) => handleChange("contrato", e.target.value)}
                >
                  <MenuItem value="OFICINA CENTRAL">OFICINA CENTRAL</MenuItem>
                  <MenuItem value="TERBU">TERBU</MenuItem>
                  <MenuItem value="CARCELES VI">CARCELES VI</MenuItem>
                  <MenuItem value="BUIN PAINE">BUIN PAINE</MenuItem>
                  <MenuItem value="RED BIO BIO">RED BIO BIO</MenuItem>
                  <MenuItem value="CHICO II">CHICO II</MenuItem>
                  <MenuItem value="NIQUEN">NIQUEN</MenuItem>
                  <MenuItem value="INSTITUTO NACIONAL DEL CÁNCER">INSTITUTO NACIONAL DEL CÁNCER</MenuItem>
                  <MenuItem value="SUSI V">SUSI V</MenuItem>
                  <MenuItem value="AEROPUERTO DE LA SERENA">AEROPUERTO DE LA SERENA</MenuItem>
                  <MenuItem value="CENTRO ORIENTE">CENTRO ORIENTE</MenuItem>
                  <MenuItem value="ZONA NORTE 1">ZONA NORTE 1</MenuItem>
                  <MenuItem value="ANCO">ANCO</MenuItem>
                  <MenuItem value="ZONA NORTE 2">ZONA NORTE 2</MenuItem>
                  <MenuItem value="AEROPORTUARIA ZN2">AEROPORTUARIA ZN2</MenuItem>
                  <MenuItem value="CENTRO COSTA 3">CENTRO COSTA 3</MenuItem>
                  <MenuItem value="SATA 3">SATA 3</MenuItem>
                  <MenuItem value="LOS VILOS - LA SERENA">LOS VILOS - LA SERENA</MenuItem>
                  <MenuItem value="VESPUCIO SUR V">VESPUCIO SUR V</MenuItem>
                  <MenuItem value="ORBITAL SUR">ORBITAL SUR</MenuItem>
                  <MenuItem value="ELQUI">ELQUI</MenuItem>
                  <MenuItem value="PUTAGÁN">PUTAGÁN</MenuItem>
                  <MenuItem value="ITATA NORTE">ITATA NORTE</MenuItem>
                  <MenuItem value="CHIGUAYANTE">CHIGUAYANTE</MenuItem>
                  <MenuItem value="COCHAMÓ">COCHAMÓ</MenuItem>
                  <MenuItem value="LIMARÍ">LIMARÍ</MenuItem>
                  <MenuItem value="HUALAÑE">HUALAÑE</MenuItem>
                  <MenuItem value="ITATA COSTA SUR">ITATA COSTA SUR</MenuItem>
                  <MenuItem value="GLOBAL CAUQUENES">GLOBAL CAUQUENES</MenuItem>
                  <MenuItem value="SECANO">SECANO</MenuItem>
                  <MenuItem value="PATILLOS">PATILLOS</MenuItem>
                  <MenuItem value="CUESTA CHADA">CUESTA CHADA</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", alignItems: "center" }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    foto_perfil:
                      e.target.files[0]
                  })
                }
              />

            </Grid>
          </Grid>
        )
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Rol de Usuario</InputLabel>
                <Select value={formData.role} label="Rol de Usuario" onChange={(e) => handleChange("role", e.target.value)}>
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="user">Usuario</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                {formData.role === "admin" && "Acceso completo a todas las funcionalidades del sistema."}
                {formData.role === "user" && "Acceso básico de solo lectura y funciones limitadas."}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Estado cuenta Inicial</InputLabel>
                <Select value={formData.estado_cuenta} label="Estado cuenta Inicial" onChange={(e) => handleChange("estado_cuenta", e.target.value)}>
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="pendiente">Pendiente de Activación</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Credenciales de Acceso
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
                      <LockIcon />
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
            <Grid size={{ xs: 12, md: 6 }}>
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
                      <LockIcon />
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
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Opciones Adicionales
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
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
            <Grid size={{ xs: 12 }}>
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
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/dashboard" style={{ color: "#722F37", textDecoration: "none" }}>
          Dashboard
        </Link>
        <Link to="/dashboard/users" style={{ color: "#722F37", textDecoration: "none" }}>
          Usuarios
        </Link>
        <Typography color="text.primary">Crear Usuario</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton component={Link} to="/dashboard/users" sx={{ border: 1, borderColor: "divider" }}>

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
            <Button component={Link} to="/dashboard/users" variant="outlined" color="inherit">
              Cancelar
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSave} variant="contained" >
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
  )
}
