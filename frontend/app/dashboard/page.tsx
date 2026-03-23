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
]


const upcomingEvents = [
  { name: "Reunión de equipo", time: "10:00 AM", date: "Hoy" },
  { name: "Capacitación Excel", time: "3:00 PM", date: "Mañana" },
  { name: "Town Hall mensual", time: "11:00 AM", date: "Viernes" },
]

const corporateNews = [
  { title: "Plan de beneficios para empleados 2026", date: "Hace 2 días" },
  { title: "Resultados financieros Q2", date: "Hace 4 días" },
  { title: "Actualización de sistema ERP", date: "Hace 5 días" },
];

const employee = {
  name: "Carolina Perez",
  position: "Coordinadora de Contratos",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bienvenida Carolina.  </h1>
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
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-2">
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
        <Card sx={{ borderRadius: 4 }}>
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
                Noticias Corporativas
              </Typography>
            }
            subheader="Últimas novedades de la empresa"
          />
          <CardContent>
            <div className="space-y-4">
              {corporateNews.map((news, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <p className="font-medium text-foreground">{news.title}</p>
                  <p className="text-sm text-muted-foreground">{news.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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

        {/* Card 2: Empleado del Mes */}
        <Card sx={{ borderRadius: 4 }}>
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
                Empleado del Mes
              </Typography>
            }
            subheader="Reconocimiento destacado"
          />
          <CardContent>
            <div className="flex flex-col items-center text-center gap-4">
              
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                {/* Puedes reemplazar por <Avatar src="..." /> */}
                <span className="text-2xl font-bold text-primary">
                  {employee.name.charAt(0)}
                </span>
              </div>

              {/* Info */}
              <div>
                <p className="font-semibold text-lg text-foreground">
                  {employee.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {employee.position}
                </p>
              </div>

              {/* Badge */}
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                Destacado
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming events */}
      </div>


    </div>
  )
}
