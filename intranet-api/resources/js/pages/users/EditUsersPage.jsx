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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material"
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add"
import { updateUser, getUser, getLaborDocuments, previewLaborDocument, downloadLaborDocument } from "../../services/api";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Eye, Download, Edit, FileText } from "lucide-react";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}
function FileIcon({ type }) {
  const colors = {
    pdf: "#E53935",
    doc: "#1E88E5",
    docx: "#1E88E5",
    xls: "#43A047",
    xlsx: "#43A047",
    default: "#722F37",
  }

  const fileType = type?.toLowerCase() || ""
  const color = colors[fileType] || colors.default

  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" fill={`${color}20`} />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <text x="12" y="16" textAnchor="middle" fontSize="6" fill={color} fontWeight="bold">
        {fileType.toUpperCase()}
      </text>
    </svg>
  )
}
const departamentos = [
  "Tecnología",
  "Recursos Humanos",
  "Finanzas",
  "Flota",
  "Calidad",
  "Contabilidad",
  "Marketing",
  "Ventas",
  "Operaciones",
  "Legal",
  "Administración",
]

const cargos = {
  Tecnología: ["Director de TI", "Desarrollador Senior", "Desarrollador Junior", "Analista de Sistemas", "Soporte Técnico"],
  "Recursos Humanos": ["Gerente de RRHH", "Cordinadora de Contratos", "Jefa de RRHH y Contabilidad", "Analista de RRHH", "Asistente Contrato RRHH", "Reclutador", "Especialista en Nóminas"],
  Finanzas: ["Director Financiero", "Analista Financiero", "Contador", "Tesorero"],
  Flota: ["Asistente de Flota"],
  Calidad: ["Jefe Gestión de Calidad"],
  Contabilidad: ["Asistente Contable", "Analista Contable"],
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

export default function EditUsersPage() {
  const params = useParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [laborDocuments, setLaborDocuments] = useState([])
  const [loadingDocs, setLoadingDocs] = useState(false)

  const getFileType = (path) => {
    return path?.split(".").pop() || "pdf"
  }

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
    supervision_general: "",
    role: "usuario",
    estado_cuenta: "activo",
    newPassword: "",
    confirmPassword: "",
    foto_perfil: null,
    path_foto_perfil: "",
    contrato: "",
  })

  const [errors, setErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");


  useEffect(() => {

    const loadUser = async () => {

      try {

        const user =
          await getUser(id);

        setFormData({

          name: user.name,
          apellido: user.apellido,
          rut: user.rut || "",
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
          foto_perfil: null,
          path_foto_perfil: user.path_foto_perfil || "",
          contrato: user.contrato || "",

        });

      } catch (error) {

        console.error(error);

      }

    };

    loadUser();

  }, [id]);

  useEffect(() => {
    const loadLaborDocs = async () => {
      setLoadingDocs(true);
      try {
        const docs = await getLaborDocuments();
        const filteredDocs = docs.filter(doc => doc.user_id === parseInt(id));
        setLaborDocuments(filteredDocs);
      } catch (err) {
        console.error("Error loading labor documents:", err);
      } finally {
        setLoadingDocs(false);
      }
    };
    loadLaborDocs();
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

    if (!formData.rut) {
      newErrors.rut = "El RUT es requerido";
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

  const handleChangePassword = async () => {
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

    try {
      await updateUser(params.id, {
        ...formData,
        password: formData.newPassword
      });

      setSnackbar({ open: true, message: "Contraseña actualizada correctamente", severity: "success" })
      setFormData({ ...formData, newPassword: "", confirmPassword: "" })
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.message || "Error al actualizar contraseña",
        severity: "error"
      });
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
        <Typography color="text.primary">Editar Usuario</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: 2, mb: 4, width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
          <IconButton component={Link} to="/dashboard/users" sx={{ border: 1, borderColor: "divider" }}>
            {/* Back button */}
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
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
        </Box>
        <Button variant="outlined" color="error" sx={{ width: { xs: "100%", sm: "auto" } }}>
          Eliminar
        </Button>
      </Box>

      {/* User Header Card */}
      <Paper sx={{ p: 3, mb: 3, display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", textAlign: { xs: "center", sm: "left" }, gap: 3 }}>
        <Box sx={{ position: "relative" }}>
          <input
            type="file"
            id="foto-perfil-edit-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                handleChange("foto_perfil", file);
                setAvatarPreview(URL.createObjectURL(file));
              }
            }}
          />
          <Avatar
            src={
              avatarPreview
                ? avatarPreview
                : formData.path_foto_perfil
                  ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/storage/${formData.path_foto_perfil}`
                  : undefined
            }
            sx={{ width: 100, height: 100 }}
          >
            {!avatarPreview && !formData.path_foto_perfil && (
              <>
                {(formData.name?.charAt(0) || "")}
                {(formData.apellido?.charAt(0) || "")}
              </>
            )}
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
            onClick={() => document.getElementById("foto-perfil-edit-input").click()}
          >
            <PhotoCameraIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {formData.name} {formData.apellido}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {formData.cargo} - {formData.departamento}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", justifyContent: { xs: "center", sm: "flex-start" }, gap: { xs: 1, sm: 3 }, mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {formData.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {formData.telefono}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: { xs: "center", sm: "right" }, width: { xs: "100%", sm: "auto" } }}>
          <Typography variant="caption" color="text.secondary">
            Último acceso
          </Typography>
          <Typography variant="body2">{mockUser.ultimoAcceso}</Typography>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: "divider", px: 2 }} variant="scrollable" scrollButtons="auto">
          <Tab iconPosition="start" label="Información Personal" />
          <Tab iconPosition="start" label="Seguridad" />
          {/* <Tab iconPosition="start" label="Documentos Laborales" /> */}
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
                  label="RUT"
                  value={formData.rut}
                  onChange={(e) => handleChange("rut", e.target.value)}
                  error={!!errors.rut}
                  helperText={errors.rut || "Ej: 12.345.678-9"}
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
              <Grid size={{ xs: 12 }}>
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
                    <MenuItem value="CHICO LL">CHICO ll</MenuItem>
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
            </Grid>

            <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", sm: "row" }, justifyContent: "flex-end", mt: 4, gap: 2 }}>
              <Button component={Link} to="/dashboard/users" variant="outlined" color="inherit" fullWidth sx={{ maxWidth: { sm: "auto" } }}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleSave} fullWidth sx={{ maxWidth: { sm: "auto" } }}>
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
              <Grid size={{ xs: 12 }}>
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
                    <MenuItem value="user">Usuario</MenuItem>
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

        {/* Tab 2: Documentos Laborales */}
        {/* 
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ px: 3, pb: 2 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ color: "#4A1C23" }}>
                Documentos Laborales del Colaborador
              </Typography>
              <Button
                component={Link}
                to={`/dashboard/labor-documents/crear?user_id=${id}`}
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#6a1936",
                  textTransform: "none",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    backgroundColor: "#4a1025",
                  },
                }}
              >
                Subir Nuevo Documento
              </Button>
            </Box>

            {loadingDocs ? (
              <Typography variant="body2" color="text.secondary">
                Cargando documentos...
              </Typography>
            ) : laborDocuments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No hay documentos laborales registrados para este usuario.
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid", borderColor: "divider", overflowX: "auto", maxWidth: "100%" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#fcfaf7" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Documento</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Tipo Documento</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Fecha Emisión</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Fecha Vencimiento</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {laborDocuments.map((doc) => (
                      <TableRow key={doc.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <FileIcon type={getFileType(doc.archivo)} />
                            <Box>
                              <Typography variant="body2" fontWeight="semibold" sx={{ color: "#4a1025" }}>
                                {doc.tipo_documento}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {doc.archivo}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{doc.tipo_documento}</TableCell>
                        <TableCell>{doc.fecha_emision || "-"}</TableCell>
                        <TableCell>{doc.fecha_vencimiento || "-"}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                            <Tooltip title="Vista previa">
                              <IconButton
                                size="small"
                                onClick={() => previewLaborDocument(doc.id)}
                              >
                                <Eye size={18} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Descargar">
                              <IconButton
                                size="small"
                                onClick={async () => {
                                  try {
                                    await downloadLaborDocument(doc.id, doc.archivo);
                                  } catch (error) {
                                    console.error(error);
                                    setSnackbar({
                                      open: true,
                                      message: "Error al descargar el documento",
                                      severity: "error",
                                    });
                                  }
                                }}
                              >
                                <Download size={18} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/dashboard/labor-documents/editar/${doc.id}`)}
                              >
                                <Edit size={18} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </TabPanel>
        */}

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
