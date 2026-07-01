import { useState, useEffect } from "react";
// ICONOS
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useAuth } from "../../hooks/AuthContext";
import { downloadPayroll, previewPayroll, myPayrolls, getMyVacations, createVacation, getMyLaborDocuments, previewLaborDocument, downloadLaborDocument, updateMyAvatar } from "../../services/api";
import { Eye, Download, Edit } from "lucide-react"
import { useNavigate } from "react-router-dom";


// UI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Stack,
  TextField,
  Tabs,
  Tab,
  Box,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Paper,
  Tooltip,
  Avatar,
  Snackbar,
  Alert
} from "@mui/material";

function FileIcon({ type }) {
  const colors = {
    pdf: "#E53935",
    doc: "#1E88E5",
    docx: "#1E88E5",
    xls: "#43A047",
    xlsx: "#43A047",
    ppt: "#FB8C00",
    pptx: "#FB8C00",
    img: "#8E24AA",
    zip: "#6D4C41",
    default: "#722F37",
  }

  const color = colors[type] || colors.default

  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" fill={`${color}20`} />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />

      <text x="12" y="16" textAnchor="middle" fontSize="6" fill={color} fontWeight="bold">
        {type.toUpperCase()}
      </text>
    </svg>
  )
}


export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [tab, setTab] = useState("info");
  const [busqueda, setBusqueda] = useState("")
  const [vistaMode, setVistaMode] = useState("list")
  const [payrolls, setPayrolls] = useState([]);
  const [laborDocuments, setLaborDocuments] = useState([]);
  const [vacations, setVacations] = useState([]);
  const navigate = useNavigate();
  const [openVacationModal, setOpenVacationModal] =
    useState(false);

  const [vacationForm, setVacationForm] =
    useState({
      fecha_inicio: "",
      fecha_fin: "",
      dias_solicitados: 0,
      comentario: "",
    });

  const feriados = [
    "2026-01-01",
    "2026-05-01",
    "2026-09-18",
    "2026-09-19",
    "2026-12-25",
  ];
  const calcularDiasHabiles = (fechaInicio, fechaFin) => {
    if (
      !fechaInicio ||
      !fechaFin
    ) {
      return 0;
    }

    let contador = 0;

    let actual =
      new Date(fechaInicio);

    const fin =
      new Date(fechaFin);

    while (actual <= fin) {

      const diaSemana =
        actual.getDay();

      const fechaStr =
        actual
          .toISOString()
          .split("T")[0];

      const esFinDeSemana =
        diaSemana === 0 ||
        diaSemana === 6;

      const esFeriado =
        feriados.includes(
          fechaStr
        );

      if (
        !esFinDeSemana &&
        !esFeriado
      ) {
        contador++;
      }

      actual.setDate(
        actual.getDate() + 1
      );
    }

    return contador;
  };

  const documentsFiltrados = laborDocuments.filter((doc) => {
    const query = busqueda.toLowerCase();
    return (
      doc.tipo_documento?.toLowerCase().includes(query) ||
      doc.archivo?.toLowerCase().includes(query) ||
      doc.observaciones?.toLowerCase().includes(query)
    );
  });

  const vacationsFiltrados =
    vacations.filter((vacation) => {

      const textoBusqueda =
        busqueda.toLowerCase();

      return (

        vacation.user?.name
          ?.toLowerCase()
          .includes(textoBusqueda)

        ||

        vacation.estado
          ?.toLowerCase()
          .includes(textoBusqueda)

        ||

        vacation.comentario
          ?.toLowerCase()
          .includes(textoBusqueda)

        ||

        vacation.comentario_admin
          ?.toLowerCase()
          .includes(textoBusqueda)

        ||

        vacation.fecha_inicio
          ?.includes(textoBusqueda)

        ||

        vacation.fecha_fin
          ?.includes(textoBusqueda)

      );
    });

  const { user, setUser } = useAuth();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "El archivo no debe superar los 10 MBytes",
        severity: "error",
      });
      return;
    }

    try {
      const response = await updateMyAvatar(file);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
      setSnackbar({
        open: true,
        message: "Foto de perfil actualizada correctamente",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.message || "Error al actualizar la foto de perfil",
        severity: "error",
      });
    }
  };

  const handleDownload = async (id, archivo) => {
    try {
      await downloadPayroll(id, archivo);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message:
          "Error al descargar la liquidación",
        severity: "error",
      });
    }
  };

  const handleDownloadLaborDocument = async (id, archivo) => {
    try {
      await downloadLaborDocument(id, archivo);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Error al descargar el documento laboral",
        severity: "error",
      });
    }
  };
  const handleCreateVacation = async () => {
    try {
      await createVacation(vacationForm);
      alert("Solicitud de vacaciones enviada correctamente");
      setOpenVacationModal(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error al crear solicitud");
    }
  };
  useEffect(() => {
    const loadPayrolls = async () => {

      try {

        const data =
          await myPayrolls();

        setPayrolls(data);

      } catch (error) {

        console.error(error);
      }
    };

    const loadLaborDocuments = async () => {
      try {
        const data = await getMyLaborDocuments();
        setLaborDocuments(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadPayrolls();
    loadLaborDocuments();

  }, []);

  useEffect(() => {

    const loadVacations = async () => {

      const data =
        await getMyVacations();

      console.log(
        "Respuesta API:",
        data
      );

      setVacations(data);
    };

    loadVacations();

  }, []);

  useEffect(() => {

    console.log(
      "Estado vacations:",
      vacations
    );

  }, [vacations]);

  useEffect(() => {
    const dias =
      calcularDiasHabiles(
        vacationForm.fecha_inicio,
        vacationForm.fecha_fin
      );

    setVacationForm((prev) => ({
      ...prev,
      dias_solicitados: dias,
    }));

  }, [
    vacationForm.fecha_inicio,
    vacationForm.fecha_fin,
  ]);

  return (
    <Box className="max-w-[1600px] mx-auto p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: "#4A1C23",
              fontWeight: 700,
            }}
          >
            Gestión de Perfil
          </Typography>

          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Gestiona tu perfil y mantén tu información actualizada
          </Typography>
        </Box>

      </div>

      {/* CARD PERFIL */}
      <Card
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          marginTop: 1,
          boxShadow: 2,
        }}
      >
        {/* CABECERA BURDEO */}
        <Box
          sx={{
            bgcolor: "#6b1426",
            height: 130,
            px: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            className="font-bold text-white"
          >
            {user?.name} {user?.apellido}
          </Typography>

          <Box >
            <Typography
              variant="body2"
              className="font-bold text-white"
            >
              ID Empleado
            </Typography>

            <Typography
              variant="h7"
              className="font-semibold text-white"
            >
              {user?.id}
            </Typography>
          </Box>
        </Box>

        {/* CUERPO BLANCO */}
        <CardContent
          sx={{
            bgcolor: "white",
            py: 4,
            px: 4,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
          >
            {/* AVATAR CONTAINER */}
            <Box sx={{ position: "relative", mt: -10, display: "inline-block" }}>
              <Avatar
                src={
                  user?.path_foto_perfil
                    ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/storage/${user.path_foto_perfil}`
                    : undefined
                }
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: 3,
                  bgcolor: "#E5E5E5",
                  fontWeight: "bold",
                  fontSize: 40,
                  border: "4px solid white",
                  boxShadow: 2,
                }}
              >
                {
                  `${user?.name?.[0] || ""}${user?.apellido?.[0] || ""}`
                    .toUpperCase()
                }
              </Avatar>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="avatar-upload-file"
                type="file"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload-file">
                <IconButton
                  component="span"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "#6b1426",
                    color: "white",
                    boxShadow: 1,
                    p: 0.8,
                    "&:hover": {
                      backgroundColor: "#4a1025",
                    },
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
              </label>
            </Box>

            {/* INFORMACIÓN */}
            <Box>
              <Typography
                variant="h6"
                fontWeight="600"
                color="#222"
              >
                {user?.cargo}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {user?.departamento}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* TABS */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{
          marginTop: 2,
          marginBottom: 2,
          backgroundColor: "#f4ede4",
          p: 1,
          borderRadius: 2,

          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        <Tab label="Información" value="info" />
        <Tab label="Documentos Laborales" value="documents" />
        {/* <Tab label="Vacaciones" value="vacations" /> */}
      </Tabs>

      {/* INFO */}
      {tab === "info" && (
        <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
          {/* CONTACTO */}
          <Card sx={{ flex: 1, borderRadius: 2, p: 2 }}>
            <CardHeader
              title={
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "#4A1C23",
                  }}
                >
                  Información Contacto
                </Typography>
              }
            />

            <CardContent>
              <Stack spacing={3}>
                <InfoRow
                  icon={<EmailIcon fontSize="small" />}
                  label="Correo"
                  value={user?.email}
                />

                <InfoRow
                  icon={<PhoneIcon fontSize="small" />}
                  label="Teléfono"
                  value={user?.telefono}
                />

                <InfoRow
                  icon={<LocationOnIcon fontSize="small" />}
                  label="Ubicación"
                  value={user?.direccion}
                />

                <InfoRow
                  icon={<LocationOnIcon fontSize="small" />}
                  label="Contrato"
                  value={user?.contrato}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* LABORAL */}
          <Card sx={{ flex: 1, borderRadius: 2, p: 2 }}>
            <CardHeader
              title={
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "#4A1C23",
                  }}
                >
                  Información Laboral
                </Typography>
              }
            />

            <CardContent>
              <Stack spacing={3}>
                <InfoRow
                  icon={<WorkIcon fontSize="small" />}
                  label="Cargo"
                  value={user?.cargo}
                />

                <InfoRow
                  icon={<ApartmentIcon fontSize="small" />}
                  label="Departamento"
                  value={user?.departamento}
                />

                <InfoRow
                  icon={<PersonIcon fontSize="small" />}
                  label="Supervisor"
                  value={user?.supervision_general}
                />

                <InfoRow
                  icon={<CalendarTodayIcon fontSize="small" />}
                  label="Ingreso"
                  value={user?.fecha_ingreso?.substring(0, 10)}
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}


      {/* DOCUMENTOS LABORALES */}
      {tab === "documents" && (
        <Card sx={{ borderRadius: 2 }}>
          <CardHeader
            title={
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  color: "#4A1C23",
                }}
              >
                Mis Documentos
              </Typography>
            }
          />

          <CardContent>
            <Stack >
              {/* FILTROS */}
              <Box className="flex flex-col lg:flex-row justify-between gap-4 mb-6">


                <Box className="flex items-center gap-3">

                  <TextField
                    size="small"
                    placeholder="Buscar documentos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />


                </Box>
              </Box>

              {/* TABLA */}
              {vistaMode === "list" ? (
                <TableContainer component={Paper}>

                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          Documento
                        </TableCell>

                        <TableCell>
                          Tipo Documento
                        </TableCell>

                        <TableCell>
                          Fecha Emisión
                        </TableCell>

                        <TableCell>
                          Tamaño
                        </TableCell>

                        <TableCell>
                          Fecha Vencimiento
                        </TableCell>

                        <TableCell align="center">
                          Acciones
                        </TableCell>

                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {documentsFiltrados.map((document) => (
                        <TableRow
                          key={document.id}
                        >
                          <TableCell>
                            <Box className="flex items-center gap-3">
                              <FileIcon type="pdf" />
                              <Box>
                                <Typography
                                  className="font-semibold text-[#4A1C23]"
                                >
                                  {document.tipo_documento}
                                </Typography>

                                <Chip
                                  label={document.archivo}
                                  size="small"
                                />
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {document.tipo_documento}
                          </TableCell>
                          <TableCell>
                            {document.fecha_emision || "-"}
                          </TableCell>
                          <TableCell>
                            -
                          </TableCell>
                          <TableCell>
                            {document.fecha_vencimiento || "-"}
                          </TableCell>
                          <TableCell>
                            <Box className="flex items-center gap-1">

                              <Tooltip title="Vista previa">
                                <IconButton
                                  onClick={() =>
                                    previewLaborDocument(
                                      document.id
                                    )
                                  }
                                >
                                  <Eye size={18} />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Descargar">
                                <IconButton
                                  onClick={() =>
                                    handleDownloadLaborDocument(
                                      document.id,
                                      document.archivo
                                    )
                                  }
                                >
                                  <Download size={18} />
                                </IconButton>
                              </Tooltip>

                              {user?.role === "admin" && (
                                <Tooltip title="Editar">
                                  <IconButton
                                    onClick={() =>
                                      navigate(
                                        `/dashboard/labor-documents/editar/${document.id}`
                                      )
                                    }
                                  >
                                    <Edit size={18} />
                                  </IconButton>
                                </Tooltip>
                              )}

                            </Box>

                          </TableCell>

                        </TableRow>
                      ))}

                    </TableBody>

                  </Table>

                </TableContainer>
              ) : (
                <Grid container spacing={2}>

                  {documentsFiltrados.map((doc) => (
                    <Grid key={doc.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, }} >

                      <Card className="hover:-translate-y-1 transition-all duration-200 h-full">

                        <CardContent>


                          <Typography className="font-semibold text-[#4A1C23] mb-2">
                            {doc.tipo_documento}
                          </Typography>

                          <Chip
                            label={doc.archivo}
                            size="small"
                            className="mb-3"
                          />

                          <Box className="flex justify-between text-sm text-gray-500">
                            <span>Emisión: {doc.fecha_emision || "-"}</span>
                            <span>Vence: {doc.fecha_vencimiento || "-"}</span>
                          </Box>

                          <Box className="flex justify-end gap-1 mt-4">

                            <IconButton onClick={() => previewLaborDocument(doc.id)}>
                              <Eye size={18} />
                            </IconButton>

                            <IconButton onClick={() => handleDownloadLaborDocument(doc.id, doc.archivo)}>
                              <Download size={18} />
                            </IconButton>

                            {user?.role === "admin" && (
                              <IconButton onClick={() => navigate(`/dashboard/labor-documents/editar/${doc.id}`)}>
                                <Edit size={18} />
                              </IconButton>
                            )}

                          </Box>

                        </CardContent>

                      </Card>

                    </Grid>
                  ))}

                </Grid>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* VACACIONES */}
      {tab === "vacations" && (
        <Card sx={{ borderRadius: 2 }}>
          <CardHeader

            title={
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  color: "#4A1C23",
                }}
              >
                Mis Vacaciones
              </Typography>
            }

            action={

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() =>
                  setOpenVacationModal(true)
                }
                sx={{
                  backgroundColor: "#6a1936",
                  textTransform: "none",
                  marginRight: 2,
                  mt: 1,
                  "&:hover": {
                    backgroundColor: "#4a1025",
                  },
                }}
              >
                Solicitar Vacaciones
              </Button>


            }
          />
          <Dialog
            open={openVacationModal}
            onClose={() =>
              setOpenVacationModal(false)
            }
            maxWidth="sm"
            fullWidth
          >

            <DialogTitle>
              Solicitar Vacaciones
            </DialogTitle>

            <DialogContent>

              <Grid
                container
                spacing={2}
                sx={{ mt: 1 }}
              >

                <Grid size={{ xs: 12 }}>

                  <TextField
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    fullWidth
                    type="date"
                    label="Fecha Inicio"
                    value={
                      vacationForm.fecha_inicio
                    }
                    onChange={(e) =>
                      setVacationForm({
                        ...vacationForm,
                        fecha_inicio:
                          e.target.value,
                      })
                    }
                  />

                </Grid>

                <Grid size={{ xs: 12 }}>

                  <TextField
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    fullWidth
                    type="date"
                    label="Fecha Fin"
                    value={
                      vacationForm.fecha_fin
                    }
                    onChange={(e) =>
                      setVacationForm({
                        ...vacationForm,
                        fecha_fin:
                          e.target.value,
                      })
                    }
                  />

                </Grid>

                <Grid size={{ xs: 12 }}>

                  <TextField
                    fullWidth
                    label="Días Solicitados"
                    value={
                      vacationForm.dias_solicitados
                    }
                    disabled
                  />

                </Grid>

                <Grid size={{ xs: 12 }}>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Comentario"
                    value={
                      vacationForm.comentario
                    }
                    onChange={(e) =>
                      setVacationForm({
                        ...vacationForm,
                        comentario:
                          e.target.value,
                      })
                    }
                  />

                </Grid>

                <Grid size={{ xs: 12 }}>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Los días se calculan
                    automáticamente excluyendo
                    fines de semana y
                    feriados.
                  </Typography>

                </Grid>

              </Grid>

            </DialogContent>

            <DialogActions>

              <Button
                onClick={() =>
                  setOpenVacationModal(false)
                }
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                sx={{
                  backgroundColor:
                    "#6a1936",
                  "&:hover": {
                    backgroundColor:
                      "#4a1025",
                  },
                }}
                onClick={
                  handleCreateVacation
                }
              >
                Enviar Solicitud
              </Button>

            </DialogActions>

          </Dialog>


          <CardContent>

            <Stack >
              {/* FILTROS */}
              <Box className="flex flex-col lg:flex-row justify-between gap-4 mb-6">


                <Box className="flex items-center gap-3">

                  <TextField
                    size="small"
                    placeholder="Buscar Vacaciones..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />


                </Box>
              </Box>

              {/* TABLA */}
              <TableContainer component={Paper}>
                <Table>

                  <TableHead>
                    <TableRow>

                      <TableCell>
                        Fecha Inicio
                      </TableCell>

                      <TableCell>
                        Fecha Fin
                      </TableCell>

                      <TableCell>
                        Días
                      </TableCell>

                      <TableCell>
                        Comentario
                      </TableCell>

                      <TableCell>
                        Estado
                      </TableCell>

                      <TableCell>
                        Aprobado Por
                      </TableCell>

                      <TableCell>
                        Comentario Administrador
                      </TableCell>


                    </TableRow>
                  </TableHead>

                  <TableBody>

                    {vacationsFiltrados.map((vacation) => (

                      <TableRow key={vacation.id} hover>

                        <TableCell>
                          {vacation.fecha_inicio}
                        </TableCell>

                        <TableCell>
                          {vacation.fecha_fin}
                        </TableCell>

                        <TableCell>
                          {vacation.dias_solicitados}
                        </TableCell>

                        <TableCell>
                          {vacation.comentario}
                        </TableCell>

                        <TableCell>

                          <Chip
                            label={vacation.estado}
                            color={
                              vacation.estado === "aprobado"
                                ? "success"
                                : vacation.estado === "rechazado"
                                  ? "error"
                                  : "warning"
                            }
                            size="small"
                          />

                        </TableCell>

                        <TableCell>
                          {vacation.aprobado_por || "-"}
                        </TableCell>

                        <TableCell>
                          {vacation.comentario_admin || "-"}
                        </TableCell>

                      </TableRow>

                    ))}

                  </TableBody>

                </Table>
              </TableContainer>
            </Stack>
          </CardContent>
        </Card>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>

  );
}

function InfoRow({ icon, label, value }) {
  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        gap={1}
        sx={{
          color: "#5e4a41",
        }}
      >
        {icon}

        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Typography fontWeight="500">
        {value}
      </Typography>
    </Stack>
  );
}
