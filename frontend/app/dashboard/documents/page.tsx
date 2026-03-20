"use client"

import { useState, Suspense } from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import Tooltip from "@mui/material/Tooltip"
import Button from "@mui/material/Button"
import { MuiProvider } from "@/app/components/mui-provider"
import { IconPlus } from "@/app/components/icons"

// Iconos SVG inline para evitar problemas con lucide-react
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function FolderIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1">
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  )
}

function FileIcon({ type }: { type: string }) {
  const colors: Record<string, string> = {
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

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}

function StarIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "#FFB300" : "none"}
      stroke={filled ? "#FFB300" : "currentColor"}
      strokeWidth="2"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

// Datos de carpetas
const carpetas = [
  { id: 1, nombre: "Políticas y Normativas", color: "#722F37", cantidad: 24 },
  { id: 2, nombre: "Contabilidad y RRHH", color: "#4A1C23", cantidad: 18 },
  { id: 3, nombre: "Manuales y Guías", color: "#8B4513", cantidad: 32 },
  { id: 4, nombre: "Plantillas", color: "#5D6D7E", cantidad: 45 },
  { id: 5, nombre: "Formación", color: "#1E88E5", cantidad: 15 },
  { id: 6, nombre: "Concesiones", color: "#43A047", cantidad: 30 },
  { id: 7, nombre: "Asesorías", color: "#FFDE21", cantidad: 8 },
  { id: 8, nombre: "Flota", color: "#650099", cantidad: 15 },
  { id: 9, nombre: "Informática", color: "#FF0000", cantidad: 30 },



]

// Datos de documentos
const documentos = [
  {
    id: 1,
    nombre: "Código de Conducta Corporativo",
    tipo: "pdf",
    categoria: "Políticas y Normativas",
    tamaño: "2.4 MB",
    fechaModificacion: "15 Dic 2025",
    autor: "Contabilidad y RRHH",
    favorito: true,
    descargas: 245,
  },
  {
    id: 2,
    nombre: "Manual de Onboarding 2025",
    tipo: "pdf",
    categoria: "Contabilidad y RRHH",
    tamaño: "5.8 MB",
    fechaModificacion: "10 Dic 2025",
    autor: "RRHH",
    favorito: true,
    descargas: 189,
  },
  {
    id: 3,
    nombre: "Política de Trabajo Remoto",
    tipo: "docx",
    categoria: "Políticas y Normativas",
    tamaño: "1.2 MB",
    fechaModificacion: "8 Dic 2025",
    autor: "Dirección General",
    favorito: false,
    descargas: 312,
  },
  {
    id: 4,
    nombre: "Plantilla Informe Mensual",
    tipo: "xlsx",
    categoria: "Plantillas",
    tamaño: "856 KB",
    fechaModificacion: "5 Dic 2025",
    autor: "Finanzas",
    favorito: true,
    descargas: 567,
  },
  {
    id: 5,
    nombre: "Guía de Seguridad Informática",
    tipo: "pdf",
    categoria: "Manuales y Guías",
    tamaño: "3.1 MB",
    fechaModificacion: "1 Dic 2025",
    autor: "TI",
    favorito: false,
    descargas: 423,
  },
  {
    id: 6,
    nombre: "Presentación Corporativa",
    tipo: "pptx",
    categoria: "Plantillas",
    tamaño: "12.4 MB",
    fechaModificacion: "28 Nov 2025",
    autor: "Marketing",
    favorito: false,
    descargas: 234,
  },
  {
    id: 7,
    nombre: "Calendario de Vacaciones 2026",
    tipo: "xlsx",
    categoria: "Contabilidad y RRHH",
    tamaño: "245 KB",
    fechaModificacion: "25 Nov 2025",
    autor: "RRHH",
    favorito: true,
    descargas: 789,
  },
  {
    id: 8,
    nombre: "Procedimiento de Compras",
    tipo: "pdf",
    categoria: "Manuales y Guías",
    tamaño: "1.8 MB",
    fechaModificacion: "20 Nov 2025",
    autor: "Compras",
    favorito: false,
    descargas: 156,
  },
  {
    id: 9,
    nombre: "Política de Protección de Datos",
    tipo: "pdf",
    categoria: "Políticas y Normativas",
    tamaño: "980 KB",
    fechaModificacion: "18 Nov 2025",
    autor: "Legal",
    favorito: true,
    descargas: 345,
  },
  {
    id: 10,
    nombre: "Manual de Marca",
    tipo: "pdf",
    categoria: "Manuales y Guías",
    tamaño: "18.5 MB",
    fechaModificacion: "15 Nov 2025",
    autor: "Marketing",
    favorito: false,
    descargas: 278,
  },
  {
    id: 11,
    nombre: "Curso IA para Empleados",
    tipo: "zip",
    categoria: "Formación",
    tamaño: "156 MB",
    fechaModificacion: "12 Nov 2025",
    autor: "Formación",
    favorito: false,
    descargas: 134,
  },
  {
    id: 12,
    nombre: "Comunicado Fin de Año",
    tipo: "docx",
    categoria: "Concesiones",
    tamaño: "520 KB",
    fechaModificacion: "10 Nov 2025",
    autor: "Dirección",
    favorito: false,
    descargas: 456,
  },
]

const categorias = [
  "Todos",
  "Políticas y Normativas",
  "Contabilidad y RRHH",
  "Manuales y Guías",
  "Plantillas",
  "Formación",
  "Concesiones",
  "Asesorías",
  "Flota",
  "Informática",

]

function DocumentosContent() {
  const [tabValue, setTabValue] = useState(0)
  const [busqueda, setBusqueda] = useState("")
  const [vistaMode, setVistaMode] = useState<"grid" | "list">("list")
  const [favoritos, setFavoritos] = useState<number[]>(documentos.filter((d) => d.favorito).map((d) => d.id))

  const documentosFiltrados = documentos.filter((doc) => {
    const matchCategoria = tabValue === 0 || doc.categoria === categorias[tabValue]
    const matchBusqueda =
      doc.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      doc.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
      doc.autor.toLowerCase().includes(busqueda.toLowerCase())
    return matchCategoria && matchBusqueda
  })

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const documentosFavoritos = documentos.filter((d) => favoritos.includes(d.id))

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      {/* Header */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/dashboard">
            Inicio
          </Link>
          <Typography color="text.primary">Documentos</Typography>
        </Breadcrumbs>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ color: "primary.dark", mb: 1 }}>
            Centro de Documentos
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Accede a políticas, manuales, plantillas y más para facilitar tu trabajo diario.
          </Typography>
        </Box>

        <Button
          variant="contained"
          component={Link}
          href="/dashboard/documents/crear"
          sx={{
            textTransform: "none",
            backgroundColor: "#6a1936",
            borderRadius: 2,
            fontSize: "1.25rem",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#4a1025",
            },
          }}
        >
          <IconPlus className="w-5 h-5 mr-1" /> Subir Documento
        </Button>
      </Box>

      {/* Carpetas */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: "primary.main", mb: 2, fontWeight: 600 }}>
          Carpetas
        </Typography>
        <Grid container spacing={2}>
          {carpetas.map((carpeta) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={carpeta.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 4px 20px rgba(74, 28, 35, 0.15)",
                  },
                }}
                onClick={() => {
                  const index = categorias.findIndex((c) => c === carpeta.nombre)
                  if (index !== -1) setTabValue(index)
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  <FolderIcon color={carpeta.color} />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mt: 1,
                      fontWeight: 600,
                      color: "primary.dark",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {carpeta.nombre}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {carpeta.cantidad} documentos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Documentos Favoritos */}
      {documentosFavoritos.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: "primary.main", mb: 2, fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}>
            <StarIcon filled /> Documentos Favoritos
          </Typography>
          <Grid container spacing={2}>
            {documentosFavoritos.slice(0, 4).map((doc) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={doc.id}>
                <Card
                  sx={{
                    height: "100%",
                    "&:hover": { boxShadow: "0 4px 20px rgba(74, 28, 35, 0.15)" },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      <FileIcon type={doc.tipo} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 600,
                            color: "primary.dark",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {doc.nombre}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {doc.tamaño} - {doc.fechaModificacion}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
                      <Tooltip title="Descargar">
                        <IconButton size="small" sx={{ color: "primary.main" }}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Filtros y Búsqueda */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 2,
          alignItems: { lg: "center" },
          justifyContent: "space-between",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": { minWidth: "auto", px: 2 },
            "& .Mui-selected": { color: "primary.main" },
          }}
        >
          {categorias.map((cat) => (
            <Tab key={cat} label={cat} />
          ))}
        </Tabs>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Buscar documentos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{ minWidth: 250 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <ToggleButtonGroup
            value={vistaMode}
            exclusive
            onChange={(_, newMode) => newMode && setVistaMode(newMode)}
            size="small"
          >
            <ToggleButton value="grid">
              <GridIcon />
            </ToggleButton>
            <ToggleButton value="list">
              <ListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Lista de Documentos */}
      {vistaMode === "list" ? (
        <TableContainer component={Paper} sx={{ boxShadow: "0 2px 8px rgba(74, 28, 35, 0.1)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "secondary.main" }}>
                <TableCell sx={{ fontWeight: 600, color: "primary.dark" }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "primary.dark" }}>Categoría</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "primary.dark" }}>Tamaño</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "primary.dark" }}>Modificado</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "primary.dark" }}>Autor</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: "primary.dark" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documentosFiltrados.map((doc) => (
                <TableRow
                  key={doc.id}
                  sx={{
                    "&:hover": { bgcolor: "rgba(114, 47, 55, 0.04)" },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <FileIcon type={doc.tipo} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "primary.dark" }}>
                          {doc.nombre}
                        </Typography>
                        <Chip
                          label={doc.tipo.toUpperCase()}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.65rem",
                            bgcolor:
                              doc.tipo === "pdf"
                                ? "#FFEBEE"
                                : doc.tipo === "xlsx"
                                  ? "#E8F5E9"
                                  : doc.tipo === "docx"
                                    ? "#E3F2FD"
                                    : doc.tipo === "pptx"
                                      ? "#FFF3E0"
                                      : "#F5F5F5",
                            color:
                              doc.tipo === "pdf"
                                ? "#C62828"
                                : doc.tipo === "xlsx"
                                  ? "#2E7D32"
                                  : doc.tipo === "docx"
                                    ? "#1565C0"
                                    : doc.tipo === "pptx"
                                      ? "#EF6C00"
                                      : "#616161",
                          }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={doc.categoria} size="small" variant="outlined" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {doc.tamaño}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {doc.fechaModificacion}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {doc.autor}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                      <Tooltip title={favoritos.includes(doc.id) ? "Quitar de favoritos" : "Agregar a favoritos"}>
                        <IconButton size="small" onClick={() => toggleFavorito(doc.id)}>
                          <StarIcon filled={favoritos.includes(doc.id)} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Vista previa">
                        <IconButton size="small" sx={{ color: "primary.main" }}>
                          <EyeIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar">
                        <IconButton size="small" sx={{ color: "primary.main" }}>
                          <DownloadIcon />
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
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={doc.id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 4px 20px rgba(74, 28, 35, 0.15)",
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <FileIcon type={doc.tipo} />
                    <IconButton size="small" onClick={() => toggleFavorito(doc.id)}>
                      <StarIcon filled={favoritos.includes(doc.id)} />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "primary.dark",
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      minHeight: 40,
                    }}
                  >
                    {doc.nombre}
                  </Typography>
                  <Chip label={doc.categoria} size="small" variant="outlined" color="primary" sx={{ mb: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {doc.tamaño}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {doc.fechaModificacion}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 0.5 }}>
                    <Tooltip title="Vista previa">
                      <IconButton size="small" sx={{ color: "primary.main" }}>
                        <EyeIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Descargar">
                      <IconButton size="small" sx={{ color: "primary.main" }}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Información adicional */}
      <Box sx={{ mt: 4, p: 3, bgcolor: "secondary.main", borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ color: "primary.dark", fontWeight: 600, mb: 1 }}>
          ¿No encuentras lo que buscas?
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Si necesitas un documento específico que no está disponible en el centro de documentos, contacta con el
          departamento correspondiente o envía una solicitud a{" "}
          <Link href="mailto:documentos@empresa.com" sx={{ color: "primary.main" }}>
            documentos@empresa.com
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

function Loading() {
  return null;
}

export default function DocumentosPage() {
  return (
    <MuiProvider>
      <Suspense fallback={<Loading />}>
        <DocumentosContent />
      </Suspense>
    </MuiProvider>
  )
}
