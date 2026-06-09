import { useState, useEffect } from "react"
import {
  Search,
  Grid3X3,
  List,
  Eye,
  Download,
  Star,
  Edit,
  Folder,
} from "lucide-react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Breadcrumbs,
  Tooltip,
  Button,
} from "@mui/material"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { getDocuments, downloadDocument } from "../../services/api";

// ==========================
// ICONOS CUSTOM
// ==========================

function FolderIcon({ color = "currentColor" }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill={color}>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  )
}

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

// ==========================
// DATA
// ==========================

const carpetas = [
  { id: 1, nombre: "Políticas y Normativas", color: "#722F37", cantidad: 24 },
  { id: 2, nombre: "Contabilidad y RRHH", color: "#4A1C23", cantidad: 18 },
  { id: 3, nombre: "Manuales y Guías", color: "#8B4513", cantidad: 32 },
  { id: 4, nombre: "Plantillas", color: "#5D6D7E", cantidad: 45 },
  { id: 5, nombre: "Formación", color: "#1E88E5", cantidad: 15 },
]

const documentos = [
  {
    id: 1,
    nombre: "Código de Conducta Corporativo",
    tipo: "pdf",
    categoria: "Políticas y Normativas",
    tamaño: "2.4 MB",
    ultima_modificacion: "15 Dic 2025",
    autor: "Contabilidad y RRHH",
    favorito: true,
  },
  {
    id: 2,
    nombre: "Manual de Onboarding 2025",
    tipo: "pdf",
    categoria: "Contabilidad y RRHH",
    tamaño: "5.8 MB",
    ultima_modificacion: "10 Dic 2025",
    autor: "RRHH",
    favorito: true,
  },
]

const categorias = [
  "Todos",
  "Políticas y Normativas",
  "Contabilidad y RRHH",
  "Manuales y Guías",
  "Plantillas",
  "Formación",
]

// ==========================
// COMPONENTE
// ==========================

export default function DocumentsPage() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0)
  const [busqueda, setBusqueda] = useState("")
  const [vistaMode, setVistaMode] = useState("list")
  const [documents, setDocuments] = useState([])

  const [favoritos, setFavoritos] = useState(
    documents.filter((d) => d.favorito).map((d) => d.id)
  )

  const documentosFiltrados = documents.filter((doc) => {
    const matchCategoria =
      tabValue === 0 || doc.categoria === categorias[tabValue]

    const matchBusqueda =
    (doc.nombre || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase()) ||

    (doc.autor || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    return matchCategoria && matchBusqueda
  })

  const toggleFavorito = (id) => {
    setFavoritos((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    )
  }

  const handleDownload = async (id,archivo) => {
      try {
          await downloadDocument(id, archivo);
      } catch (error) {
          console.error(error);
          setSnackbar({
              open: true,
              message:
                  "Error al descargar el documento",
              severity: "error",
          });
      }
  };


  const getFileType = (path) => {
    return path?.split(".").pop()?.toUpperCase() || "N/A";
  };
  useEffect(() => {

    const loadDocuments = async () => {

        try {

            const data = await getDocuments();

            console.log(data);

            setDocuments(data);

        } catch (error) {

            console.error(error);
        }
    };

    loadDocuments();

}, []);

  return (
    <Box className="p-6 max-w-[1400px] mx-auto">

      {/* HEADER */}
        <Breadcrumbs className="mb-4">
        <Link
            to="/dashboard"
            className="text-gray-500 hover:underline"
        >
            Inicio
        </Link>

        <Typography color="text.primary">
            Liquidaciones
        </Typography>
        </Breadcrumbs>

      <Box
        className="flex flex-wrap justify-between items-center gap-4 mb-8"
      >
        <Box>
          <Typography
            variant="h4"
            className="font-bold text-[#4A1C23]"
          >
            Centro de Liquidaciones de Sueldo
          </Typography>

          <Typography className="text-gray-500 mt-1">
            Accede a las liquidaciones de sueldo de todos los colaboradores
          </Typography>
        </Box>

        <Button
          variant="contained"
          className="!bg-[#6a1936] hover:!bg-[#4a1025]"
           component={Link}
            to="/dashboard/payrolls/crear"
        >
          Subir Liquidación
        </Button>
      </Box>


      {/* FILTROS */}
      <Box className="flex flex-col lg:flex-row justify-between gap-4 mb-6">


        <Box className="flex items-center gap-3">

          <TextField
            size="small"
            placeholder="Buscar documentos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{
            startAdornment: (
            <InputAdornment position="start">
                <Search size={18} />
            </InputAdornment>
            ),
        }}
          />


        </Box>
      </Box>

      {/* TABLA */}
      {vistaMode === "list" ? (
        <TableContainer component={Paper}>

          <Table>

            <TableHead>
              <TableRow className="bg-gray-100">

                <TableCell className="!font-semibold">
                  Nombre
                </TableCell>

                <TableCell className="!font-semibold">
                  Categoría
                </TableCell>

                <TableCell className="!font-semibold">
                  Tamaño
                </TableCell>

                <TableCell className="!font-semibold">
                  Modificado
                </TableCell>

                <TableCell className="!font-semibold">
                  Acciones
                </TableCell>

              </TableRow>
            </TableHead>

            <TableBody>

              {documents.map((doc) => (
                <TableRow key={doc.id} hover>

                  <TableCell>
                    <Box className="flex items-center gap-3">

                      <FileIcon type={getFileType(doc.path)} />

                      <Box>
                        <Typography className="font-semibold text-[#4A1C23]">
                          {doc.nombre}
                        </Typography>

                      <Chip
                        label={getFileType(doc.path)}
                        size="small"
                      />
                      </Box>

                    </Box>
                  </TableCell>

                  <TableCell>
                    {doc.categoria}
                  </TableCell>

                  <TableCell>
                    {doc.tamano_archivo}
                  </TableCell>

                  <TableCell>
                    {doc.updated_at?.substring(0, 10)}
                  </TableCell>

                  <TableCell>

                    <Box className="flex items-center gap-1">

                      <Tooltip title="Favorito">
                        <IconButton onClick={() => toggleFavorito(doc.id)}>
                            <Star
                            size={18}
                            fill={favoritos.includes(doc.id) ? "#FFB300" : "none"}
                            color={favoritos.includes(doc.id) ? "#FFB300" : "currentColor"}
                            />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Vista previa">
                        <IconButton>
                            <Eye size={18} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Descargar">
                        <IconButton
                          onClick={() => handleDownload(doc.id, doc.archivo)}
                        >
                          <Download size={18} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Editar">
                          <IconButton
                              onClick={() =>
                                  navigate(
                                      `/dashboard/documents/editar/${doc.id}`
                                  )
                              }
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
      ) : (
        <Grid container spacing={2}>

          {documentosFiltrados.map((doc) => (
            <Grid key={doc.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, }} >

              <Card className="hover:-translate-y-1 transition-all duration-200 h-full">

                <CardContent>

                  <Box className="flex justify-between items-start mb-4">

                    
                    <IconButton
                      onClick={() => toggleFavorito(doc.id)}
                    >
                      <IconStar
                        size={18}
                        fill={
                          favoritos.includes(doc.id)
                            ? "#FFB300"
                            : "none"
                        }
                      />
                    </IconButton>

                  </Box>

                  <Typography className="font-semibold text-[#4A1C23] mb-2">
                    {doc.nombre}
                  </Typography>

                  <Chip
                    label={doc.categoria}
                    size="small"
                    className="mb-3"
                  />

                  <Box className="flex justify-between text-sm text-gray-500">
                    <span>{doc.tamano_archivo}</span>
                    <span>{doc.ultima_modificacion}</span>
                  </Box>

                  <Box className="flex justify-end gap-1 mt-4">

                    <IconButton>
                      <IconEye size={18} />
                    </IconButton>

                    <IconButton>
                      <IconDownload size={18} />
                    </IconButton>

                  </Box>

                </CardContent>

              </Card>

            </Grid>
          ))}

        </Grid>
      )}
    </Box>
  )
}