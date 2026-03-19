"use client"

import { useState } from "react"
import Link from "next/link"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import CardActionArea from "@mui/material/CardActionArea"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Grid from "@mui/material/Grid"
import Pagination from "@mui/material/Pagination"
import { MuiProvider } from "@/app/components/mui-provider"

const noticias = [
  {
    id: 1,
    titulo: "Nuevo plan de beneficios para empleados 2025",
    resumen:
      "La empresa anuncia mejoras significativas en el plan de beneficios incluyendo seguro médico ampliado, días de vacaciones adicionales y nuevos programas de bienestar.",
    categoria: "Recursos Humanos",
    fecha: "5 Dic 2025",
    imagen: "/corporate-benefits-employee-wellness.png",
    destacada: true,
    autor: "María González",
  },
  {
    id: 2,
    titulo: "Resultados del tercer trimestre superan expectativas",
    resumen:
      "Los resultados financieros del Q3 muestran un crecimiento del 15% respecto al año anterior, superando las proyecciones iniciales.",
    categoria: "Finanzas",
    fecha: "3 Dic 2025",
    imagen: "/business-growth-chart-success.png",
    destacada: true,
    autor: "Carlos Ramírez",
  },
  {
    id: 3,
    titulo: "Inauguración de nuevas oficinas en Barcelona",
    resumen:
      "La compañía expande su presencia en España con la apertura de modernas instalaciones en el distrito tecnológico de Barcelona.",
    categoria: "Corporativo",
    fecha: "1 Dic 2025",
    imagen: "/modern-office-building-barcelona.png",
    destacada: false,
    autor: "Ana Martínez",
  },
  {
    id: 4,
    titulo: "Programa de capacitación en inteligencia artificial",
    resumen:
      "Se lanza un nuevo programa de formación en IA para todos los empleados, con certificaciones reconocidas internacionalmente.",
    categoria: "Formación",
    fecha: "28 Nov 2025",
    imagen: "/artificial-intelligence-training-education.png",
    destacada: false,
    autor: "Pedro Sánchez",
  },
  {
    id: 5,
    titulo: "Celebración del 25 aniversario de la empresa",
    resumen:
      "Este mes celebramos 25 años de trayectoria. Se preparan eventos especiales y reconocimientos para empleados con mayor antigüedad.",
    categoria: "Eventos",
    fecha: "25 Nov 2025",
    imagen: "/corporate-anniversary-celebration-party.png",
    destacada: false,
    autor: "Laura Torres",
  },
  {
    id: 6,
    titulo: "Actualización del sistema de gestión interno",
    resumen:
      "El departamento de TI anuncia la migración al nuevo sistema ERP que mejorará la eficiencia operativa en todos los departamentos.",
    categoria: "Tecnología",
    fecha: "22 Nov 2025",
    imagen: "/enterprise-software-system-technology.png",
    destacada: false,
    autor: "Diego Fernández",
  },
]

const categorias = ["Todas", "Recursos Humanos", "Finanzas", "Corporativo", "Formación", "Eventos", "Tecnología"]

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function NoticiasContent() {
  const [tabValue, setTabValue] = useState(0)
  const [busqueda, setBusqueda] = useState("")

  const noticiasFiltradas = noticias.filter((noticia) => {
    const matchCategoria = tabValue === 0 || noticia.categoria === categorias[tabValue]
    const matchBusqueda =
      noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      noticia.resumen.toLowerCase().includes(busqueda.toLowerCase())
    return matchCategoria && matchBusqueda
  })

  const noticiasDestacadas = noticias.filter((n) => n.destacada)

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: "primary.dark", mb: 1 }}>
          Noticias Corporativas
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Mantente informado sobre las últimas novedades de la empresa
        </Typography>
      </Box>

      {/* Noticias Destacadas */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
          Destacadas
        </Typography>
        <Grid container spacing={3}>
          {noticiasDestacadas.map((noticia) => (
            <Grid size={{ xs: 12, md: 6 }} key={noticia.id}>
              <Card sx={{ height: "100%", "&:hover": { boxShadow: "0 4px 20px rgba(74, 28, 35, 0.15)" } }}>
                <CardActionArea component={Link} href={`/dashboard/noticias/${noticia.id}`}>
                  <CardMedia component="img" height="180" image={noticia.imagen} alt={noticia.titulo} />
                  <CardContent>
                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                      <Chip label={noticia.categoria} size="small" color="primary" />
                      <Chip label="Destacada" size="small" sx={{ bgcolor: "secondary.main", color: "primary.dark" }} />
                    </Box>
                    <Typography variant="h6" sx={{ color: "primary.dark", mb: 1 }}>
                      {noticia.titulo}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                      {noticia.resumen}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Por {noticia.autor}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {noticia.fecha}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Filtros */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { md: "center" },
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
        <TextField
          size="small"
          placeholder="Buscar noticias..."
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
      </Box>

      {/* Lista de Noticias */}
      <Grid container spacing={3}>
        {noticiasFiltradas.map((noticia) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={noticia.id}>
            <Card sx={{ height: "100%", "&:hover": { boxShadow: "0 4px 20px rgba(74, 28, 35, 0.15)" } }}>
              <CardActionArea
                component={Link}
                href={`/dashboard/noticias/${noticia.id}`}
                sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
              >
                <CardMedia component="img" height="140" image={noticia.imagen} alt={noticia.titulo} />
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ mb: 1 }}>
                    <Chip label={noticia.categoria} size="small" color="primary" variant="outlined" />
                  </Box>
                  <Typography variant="subtitle1" sx={{ color: "primary.dark", fontWeight: 600, mb: 1 }}>
                    {noticia.titulo}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, flexGrow: 1 }}>
                    {noticia.resumen.substring(0, 100)}...
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {noticia.autor}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {noticia.fecha}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Paginación */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination count={3} color="primary" />
      </Box>
    </Box>
  )
}

export default function NoticiasPage() {
  return (
    <MuiProvider>
      <NoticiasContent />
    </MuiProvider>
  )
}
