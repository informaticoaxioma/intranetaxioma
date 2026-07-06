import { useState, useEffect } from "react"
import {
  Search,
  Eye,
  Download,
  Edit,
  Trash2,
} from "lucide-react"
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Breadcrumbs,
  Tooltip,
  Button,
  Snackbar,
  Alert,
} from "@mui/material"
import { Link } from "react-router-dom"
import AddIcon from "@mui/icons-material/Add"
import { useNavigate } from "react-router-dom"
import {
  getLaborDocuments,
  getMyLaborDocuments,
  downloadLaborDocument,
  previewLaborDocument,
  deleteLaborDocument,
} from "../../services/api"

// Custom File Icon based on extension
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

const tiposDocumento = [
  "Todos",
  "Contrato de Trabajo",
  "Anexo de Contrato",
  "Certificado Laboral",
  "Finiquito",
  "Ficha Trabajador",
  "Otro",
]

export default function LaborDocumentsPage() {
  const navigate = useNavigate()
  const [tabValue, setTabValue] = useState(0)
  const [busqueda, setBusqueda] = useState("")
  const [documents, setDocuments] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))
  const isAdmin = user?.role === "admin"

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const loadDocuments = async () => {
    try {
      const data = isAdmin ? await getLaborDocuments() : await getMyLaborDocuments()
      setDocuments(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const documentosFiltrados = documents.filter((doc) => {
    const matchCategoria =
      tabValue === 0 ||
      doc.tipo_documento === tiposDocumento[tabValue]

    const matchBusqueda =
      (doc.tipo_documento || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      (doc.user?.name || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      (doc.observaciones || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase())

    return matchCategoria && matchBusqueda
  })

  const handleDownload = async (id, archivo) => {
    try {
      await downloadLaborDocument(id, archivo)
    } catch (error) {
      console.error(error)
      setSnackbar({
        open: true,
        message: "Error al descargar el documento",
        severity: "error",
      })
    }
  }

  const handlePreview = async (id) => {
    try {
      await previewLaborDocument(id)
    } catch (error) {
      console.error(error)
      setSnackbar({
        open: true,
        message: "Error al previsualizar el documento",
        severity: "error",
      })
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este documento laboral?")) {
      try {
        await deleteLaborDocument(id)
        setSnackbar({
          open: true,
          message: "Documento laboral eliminado correctamente",
          severity: "success",
        })
        loadDocuments()
      } catch (error) {
        console.error(error)
        setSnackbar({
          open: true,
          message: "Error al eliminar el documento laboral",
          severity: "error",
        })
      }
    }
  }

  const getFileType = (path) => {
    return path?.split(".").pop()?.toUpperCase() || "PDF"
  }

  return (
    <Box className="p-6 max-w-[1400px] mx-auto">
      {/* HEADER */}
      <Breadcrumbs className="mb-4">
        <Link to="/dashboard" className="text-gray-500 hover:underline">
          Inicio
        </Link>
        <Typography color="text.primary">Documentos Laborales</Typography>
      </Breadcrumbs>

      <Box className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <Box>
          <Typography variant="h4" className="font-bold text-[#4A1C23]">
            {isAdmin ? "Gestión de Documentos Laborales" : "Mis Documentos Laborales"}
          </Typography>
          <Typography className="text-gray-500 mt-1">
            {isAdmin
              ? "Administra contratos, anexos y certificados del personal."
              : "Visualiza y descarga tus contratos, anexos y otros documentos."}
          </Typography>
        </Box>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="!bg-[#6a1936] hover:!bg-[#4a1025]"
            component={Link}
            to="/dashboard/labor-documents/crear"
          >
            Subir Documento
          </Button>
        )}
      </Box>

      {/* FILTROS */}
      <Box className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tiposDocumento.map((tipo) => (
            <Tab key={tipo} label={tipo} />
          ))}
        </Tabs>

        <Box className="flex items-center gap-3">
          <TextField
            size="small"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      </Box>

      {/* TABLA */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell className="!font-semibold">Documento</TableCell>
              {isAdmin && <TableCell className="!font-semibold">Colaborador</TableCell>}
              <TableCell className="!font-semibold">F. Emisión</TableCell>
              <TableCell className="!font-semibold">F. Vencimiento</TableCell>
              <TableCell className="!font-semibold">Observaciones</TableCell>
              <TableCell className="!font-semibold">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} align="center" className="text-gray-500 py-8">
                  No se encontraron documentos laborales.
                </TableCell>
              </TableRow>
            ) : (
              documentosFiltrados.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>
                    <Box className="flex items-center gap-3">
                      <FileIcon type={getFileType(doc.path)} />
                      <Box>
                        <Typography className="font-semibold text-[#4A1C23]">
                          {doc.tipo_documento}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" className="block">
                          {doc.archivo}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      {doc.user?.name || "N/A"}
                    </TableCell>
                  )}
                  <TableCell>
                    {doc.fecha_emision || "-"}
                  </TableCell>
                  <TableCell>
                    {doc.fecha_vencimiento || "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {doc.observaciones || "-"}
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center gap-1">
                      <Tooltip title="Vista previa">
                        <IconButton onClick={() => handlePreview(doc.id)}>
                          <Eye size={18} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Descargar">
                        <IconButton onClick={() => handleDownload(doc.id, doc.archivo)}>
                          <Download size={18} />
                        </IconButton>
                      </Tooltip>

                      {isAdmin && (
                        <>
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={() => navigate(`/dashboard/labor-documents/editar/${doc.id}`)}
                            >
                              <Edit size={18} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar">
                            <IconButton onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-800">
                              <Trash2 size={18} />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}