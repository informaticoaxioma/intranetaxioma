"use client"

import Link from "next/link"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Button from "@mui/material/Button"
import Avatar from "@mui/material/Avatar"
import Divider from "@mui/material/Divider"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemButton from "@mui/material/ListItemButton"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import { MuiProvider } from "@/app/components/mui-provider"
import { useParams } from "next/navigation"


const noticias: Record<
  string,
  {
    id: number
    titulo: string
    resumen: string
    contenido: string[]
    categoria: string
    fecha: string
    imagen: string
    autor: string
    autorCargo: string
    autorAvatar: string
  }
> = {
  "1": {
    id: 1,
    titulo: "Nuevo plan de beneficios para empleados 2025",
    resumen:
      "La empresa anuncia mejoras significativas en el plan de beneficios incluyendo seguro médico ampliado, días de vacaciones adicionales y nuevos programas de bienestar.",
    contenido: [
      "Nos complace anunciar el lanzamiento de nuestro nuevo plan de beneficios para el año 2025, el cual representa una mejora sustancial respecto a años anteriores y refleja nuestro compromiso continuo con el bienestar de todos nuestros colaboradores.",
      "Entre las principales novedades del plan se incluyen: ampliación de la cobertura del seguro médico para incluir tratamientos especializados y medicina preventiva, incremento de 5 días adicionales de vacaciones para todos los empleados con más de 2 años de antigüedad, y un nuevo programa de bienestar integral que incluye acceso a gimnasios, sesiones de mindfulness y apoyo psicológico.",
      "Adicionalmente, hemos implementado un programa de trabajo flexible que permite a los empleados elegir entre modalidad híbrida o remota según las necesidades de cada puesto. Este programa busca mejorar el balance entre la vida personal y laboral.",
      "El nuevo plan también contempla mejoras en el programa de desarrollo profesional, incluyendo presupuesto individual para capacitaciones, certificaciones y asistencia a conferencias del sector.",
      "Invitamos a todos los empleados a revisar los detalles completos del plan en el portal de Recursos Humanos y a participar en las sesiones informativas que se llevarán a cabo durante las próximas semanas.",
    ],
    categoria: "Recursos Humanos",
    fecha: "5 Diciembre 2025",
    imagen: "/corporate-benefits-employee-wellness-program.png",
    autor: "María González",
    autorCargo: "Directora de Recursos Humanos",
    autorAvatar: "/professional-woman-portrait.png",
  },
  "2": {
    id: 2,
    titulo: "Resultados del tercer trimestre superan expectativas",
    resumen:
      "Los resultados financieros del Q3 muestran un crecimiento del 15% respecto al año anterior, superando las proyecciones iniciales.",
    contenido: [
      "Es con gran satisfacción que compartimos los resultados financieros del tercer trimestre de 2025, los cuales han superado significativamente las expectativas establecidas a principios de año.",
      "Los ingresos totales alcanzaron los 45 millones de euros, representando un crecimiento del 15% respecto al mismo período del año anterior. Este resultado se debe principalmente al excelente desempeño de nuestras líneas de negocio principales y a la exitosa expansión en nuevos mercados.",
      "El margen operativo se situó en el 22%, mejorando 3 puntos porcentuales respecto al Q3 de 2024, gracias a las iniciativas de optimización de costos y mejora de eficiencia implementadas durante el año.",
      "Destacamos especialmente el crecimiento del 25% en el segmento de servicios digitales, que se ha convertido en uno de los principales motores de crecimiento de la compañía.",
      "De cara al cierre de año, mantenemos una perspectiva positiva y confiamos en alcanzar los objetivos anuales establecidos. Agradecemos a todo el equipo por su compromiso y dedicación que hacen posibles estos resultados.",
    ],
    categoria: "Finanzas",
    fecha: "3 Diciembre 2025",
    imagen: "/business-growth-financial-chart-success.png",
    autor: "Carlos Ramírez",
    autorCargo: "Director Financiero",
    autorAvatar: "/professional-man-portrait.png",
  },
}

const noticiasRelacionadas = [
  { id: 3, titulo: "Inauguración de nuevas oficinas en Barcelona", fecha: "1 Dic 2025" },
  { id: 4, titulo: "Programa de capacitación en inteligencia artificial", fecha: "28 Nov 2025" },
  { id: 5, titulo: "Celebración del 25 aniversario de la empresa", fecha: "25 Nov 2025" },
]

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98" />
      <path d="m8.59 10.49 6.83-3.98" />
    </svg>
  )
}

function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
}

function PrintIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect width="12" height="8" x="6" y="14" />
    </svg>
  )
}

function NoticiaContent() {
  const params = useParams()
  const id = params.id as string
  const noticia = noticias[id] || noticias["1"]

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Navegación */}
      <Box sx={{ mb: 3 }}>
        <Button
          component={Link}
          href="/dashboard/noticias"
          startIcon={<ArrowLeftIcon />}
          sx={{ color: "primary.main" }}
        >
          Volver a noticias
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", lg: "row" } }}>
        {/* Contenido Principal */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ overflow: "hidden" }}>
            {/* Imagen de cabecera */}
            <CardMedia component="img" height="350" image={noticia.imagen} alt={noticia.titulo} />

            <Box sx={{ p: 4 }}>
              {/* Metadatos */}
              <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
                <Chip label={noticia.categoria} color="primary" />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {noticia.fecha}
                </Typography>
              </Box>

              {/* Título */}
              <Typography variant="h4" sx={{ color: "primary.dark", mb: 3, fontWeight: 700 }}>
                {noticia.titulo}
              </Typography>

              {/* Resumen */}
              <Typography
                variant="subtitle1"
                sx={{
                  color: "text.secondary",
                  mb: 4,
                  fontStyle: "italic",
                  borderLeft: "4px solid",
                  borderColor: "primary.main",
                  pl: 2,
                }}
              >
                {noticia.resumen}
              </Typography>

              {/* Autor */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                <Avatar src={noticia.autorAvatar} sx={{ width: 56, height: 56 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "primary.dark", fontWeight: 600 }}>
                    {noticia.autor}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {noticia.autorCargo}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Contenido */}
              <Box sx={{ "& > p": { mb: 3 } }}>
                {noticia.contenido.map((parrafo, index) => (
                  <Typography key={index} variant="body1" sx={{ color: "text.primary", lineHeight: 1.8 }}>
                    {parrafo}
                  </Typography>
                ))}
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Acciones */}
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <IconButton sx={{ color: "primary.main" }}>
                  <ShareIcon />
                </IconButton>
                <IconButton sx={{ color: "primary.main" }}>
                  <BookmarkIcon />
                </IconButton>
                <IconButton sx={{ color: "primary.main" }}>
                  <PrintIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Sidebar */}
        <Box sx={{ width: { xs: "100%", lg: 320 }, flexShrink: 0 }}>
          {/* Noticias Relacionadas */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "primary.dark", mb: 2 }}>
                Noticias Relacionadas
              </Typography>
              <List disablePadding>
                {noticiasRelacionadas.map((item, index) => (
                  <Box key={item.id}>
                    <ListItem
                    disablePadding
                    sx={{ borderRadius: 1, overflow: "hidden" }}
                    >
                    <ListItemButton
                        component={Link}
                        href={`/dashboard/noticias/${item.id}`}
                        sx={{
                        px: 0,
                        "&:hover": { bgcolor: "secondary.light" },
                        }}
                    >
                        <ListItemText
                        primary={item.titulo}
                        secondary={item.fecha}
                        primaryTypographyProps={{
                            variant: "body2",
                            color: "primary.dark",
                            fontWeight: 500,
                        }}
                        secondaryTypographyProps={{
                            variant: "caption",
                        }}
                        />
                    </ListItemButton>
                    </ListItem>
                    {index < noticiasRelacionadas.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Información de contacto */}
          <Card sx={{ bgcolor: "primary.main" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
                ¿Tienes una noticia?
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", mb: 3 }}>
                Si tienes información relevante para compartir con la empresa, contáctanos.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": { bgcolor: "secondary.main" },
                }}
              >
                Enviar noticia
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

export default function NoticiaPage() {
  return (
    <MuiProvider>
      <NoticiaContent />
    </MuiProvider>
  )
}
