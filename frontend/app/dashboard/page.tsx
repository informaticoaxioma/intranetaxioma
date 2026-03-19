import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Card
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

// Typography (reemplazo títulos/descripciones)
import Typography from '@mui/material/Typography';

// Button
import Button from '@mui/material/Button';
import Link from "next/link"

const stats = [
  { label: "Documentos", value: "128", icon: DescriptionIcon, change: "+12 este mes" },
  { label: "Eventos", value: "8", icon: CalendarTodayIcon, change: "Esta semana" },
  { label: "Empleados", value: "524", icon: GroupIcon, change: "+3 nuevos" },
  { label: "Mensajes", value: "24", icon: ChatBubbleOutlineIcon, change: "Sin leer" },
]

const recentDocuments = [
  { name: "Política de teletrabajo 2025", date: "Hace 2 horas", status: "Nuevo" },
  { name: "Manual de onboarding", date: "Hace 1 día", status: "Actualizado" },
  { name: "Reglamento interno", date: "Hace 3 días", status: "Revisado" },
  { name: "Beneficios corporativos", date: "Hace 1 semana", status: "Nuevo" },
]

const upcomingEvents = [
  { name: "Reunión de equipo", time: "10:00 AM", date: "Hoy" },
  { name: "Capacitación Excel", time: "3:00 PM", date: "Mañana" },
  { name: "Town Hall mensual", time: "11:00 AM", date: "Viernes" },
]

const quickActions = [
  { label: "Solicitar vacaciones", href: "/dashboard/requests" },
  { label: "Ver nómina", href: "/dashboard/payroll" },
  { label: "Reportar incidencia", href: "/dashboard/support" },
  { label: "Reservar sala", href: "/dashboard/rooms" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bienvenido Administrador Juan.  </h1>
          <p className="text-muted-foreground">Aquí tienes un resumen de lo que está pasando en la empresa</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
            sx={{ borderRadius: 4 }} 
            key={stat.label} className="  rounded-lg ">
              <CardContent className="p-6">
                <div className="flex items-center justify-between rounded-lg ">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUpIcon className="w-3 h-3 text-green-600" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent documents */}
        <Card   sx={{ borderRadius: 4 }} className="lg:col-span-2 ">
            <CardHeader 
                  title={
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        color: "var(--foreground)",
                      }}
                    >
                      Documentos Recientes
                    </Typography>
                  }
              subheader="Últimas actualizaciones en documentos corporativos"
              action={
                <Link href="/dashboard/documents" passHref>
                  <Button
                    size="medium"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      textTransform: "none",
                      color: "#6a1936",
                      backgroundColor: "white",
                      borderRadius: 2,
                      fontWeight: "600",
                      "&:hover": {
                        backgroundColor: "#6a1936",
                        color: "white",
                        borderRadius: 2,
                      },
                    }}
                  >
                    Ver todos
                  </Button>
                </Link>
              }
            />
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DescriptionIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.date}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming events */}
        <Card  sx={{ borderRadius: 4 }} className="">
                      <CardHeader 
                  title={
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        color: "var(--foreground)",
                      }}
                    >
                     Próximos Eventos
                    </Typography>
                  }
              subheader="Tu agenda para esta semana"

            />
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <AccessTimeIcon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{event.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.date} • {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <CardActions>
              <Button
                variant="text"
                className="w-full mt-4"
                sx={{
                  backgroundColor: "transparent",
                  color: "#4A0E1B", // burdeo oscuro para el texto
                  textTransform: "none",
                  borderRadius: 2,
                  py: 1,
                  outline: "1px solid #4A0E1B",

                  "&:hover": {
                    backgroundColor: "#7B1E3A", // burdeo
                    color: "white",             // texto blanco
                  },
                }}
              >
                <Link href="/dashboard/calendar" style={{ width: "100%", display: "block", textAlign: "center" }}>
                  Ver calendario completo
                </Link>
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </div>


    </div>
  )
}
