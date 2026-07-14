import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from "@mui/icons-material/Description";
import EventIcon from "@mui/icons-material/Event";
import CampaignIcon from "@mui/icons-material/Campaign";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from "react-router-dom";

// Card
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import { Typography, Box, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { getNews, getEvents, getDashboardStats } from '../../services/api';


const stats = [
  { label: "Documentos", value: "128", icon: DescriptionIcon, change: "+12 este mes" },
  { label: "Eventos", value: "8", icon: CalendarTodayIcon, change: "Esta semana" },
]

const slidesComite = [
  {
    title: "Comité Paritario - Higiene y Seguridad",
    description: "Organismo encargado de velar por el cumplimiento del reglamento interno, promover buenas prácticas laborales, fomentar ambientes de trabajo seguros y colaborar en la aplicación de las políticas internas de la empresa.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    link: "/dashboard/documents"
  },
  {
    title: "Comité Paritario - Prevención y Seguridad",
    description: "Promovemos una cultura de autocuidado e identificamos riesgos en nuestras instalaciones, velando por que cada miembro del equipo trabaje en condiciones óptimas y protegidas.",
    image: "/imagenes/imagen-principal-mutual.avif",
    link: "https://www.mutual.cl/portal/publico/empresa/home"
  },
  {
    title: "Comité Paritario - Bienestar Laboral",
    description: "Fomentamos la salud y calidad de vida de nuestros trabajadores, impulsando la mejora continua de los espacios de trabajo y el equilibrio entre vida laboral y personal.",
    image: "/imagenes/bannercajalosandes.png",
    link: "https://somosandes.cajalosandes.cl/"
  },
  {
    title: "Sistema Ticketera Informatica",
    description: "Enlace directo a nuestro sistema de ticketing informático para la gestión de incidencias y solicitudes de soporte técnico.",
    image: "/imagenes/consorsio-logo.png",
    link: "https://faceted-tilapia-231.notion.site/2e17837f803980dfa073f2e3ce488fe2?pvs=105"
  }
];



export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [corporateNews, setCorporateNews] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slidesComite.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  const handleImageClick = (link) => {
    if (!link) return;
    if (link.startsWith("http://") || link.startsWith("https://")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link);
    }
  };

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data =
          await getNews();
        setCorporateNews(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadNews();

  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data =
          await getEvents();

        setUpcomingEvents(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadEvents();

  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats([
          {
            label: "Documentos",
            value: data.documents,
            change: "Disponibles",
            icon: DescriptionIcon,
          },
          {
            label: "Eventos",
            value: data.events,
            change: "Programados",
            icon: EventIcon,
          },
          {
            label: "Noticias",
            value: data.news,
            change: "Publicadas",
            icon: CampaignIcon,
          }
        ]);
      } catch (error) {
        console.error(
          "Error cargando estadísticas",
          error
        );
      }
    };
    loadStats();

  }, []);

  return (

    <Box className="space-y-6 max-w-[1400px] mx-auto">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <Typography
            variant="h4"
            className="font-bold text-[#4A1C23]"
          >
            Bienvenido: {user?.name || "Usuario"} {user?.apellido || "Intranet"}
          </Typography>

          <Typography
            variant="body1"
            className="text-gray-500 mt-1"
          >
            Aquí tienes un resumen de lo que está pasando en la empresa
          </Typography>
        </div>

        <div className="text-right">
          <Typography
            variant="body2"
            className="text-gray-500"
          >
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              sx={{ borderRadius: 2 }}
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
      <Card
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* TEXT SECTION (Transitions with activeSlide) */}
        <Box sx={{ p: 3, minHeight: 140, transition: "all 0.5s ease" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#4A1C23",
              transition: "opacity 0.5s ease",
            }}
          >
            {slidesComite[activeSlide].title}
          </Typography>
          <Typography
            sx={{
              mt: 1,
              color: "text.secondary",
              fontSize: "1rem",
              minHeight: 60
            }}
          >
            {slidesComite[activeSlide].description}
          </Typography>
        </Box>

        {/* IMAGE/MEDIA CAROUSEL WITH OVERLAY CONTROLS */}
        <Box sx={{ position: "relative", overflow: "hidden", height: 400 }}>
          {/* IMAGE */}
          <Box
            component="img"
            src={slidesComite[activeSlide].image}
            alt={slidesComite[activeSlide].title}
            onClick={() => handleImageClick(slidesComite[activeSlide].link)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "pointer",
              transition: "transform 0.5s ease, opacity 0.5s ease",
              "&:hover": {
                transform: "scale(1.03)"
              }
            }}
          />

          {/* ARROWS (CONTROLS) */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide((prev) => (prev === 0 ? slidesComite.length - 1 : prev - 1));
            }}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)"
              }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setActiveSlide((prev) => (prev === slidesComite.length - 1 ? 0 : prev + 1));
            }}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)"
              }
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          {/* SLIDE INDICATORS (DOTS) */}
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
              zIndex: 10
            }}
          >
            {slidesComite.map((_, index) => (
              <Box
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(index);
                }}
                sx={{
                  width: index === activeSlide ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: index === activeSlide ? "white" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              />
            ))}
          </Box>
        </Box>
      </Card>


      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent documents */}
        <Card sx={{ borderRadius: 2 }}>
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
              {corporateNews
                .slice(0, 3)
                .map((news) => (

                  <div
                    key={news.id}
                    onClick={() =>
                      navigate(
                        `/dashboard/news/${news.id}`
                      )
                    }
                    className="
                                  p-4
                                  rounded-lg
                                  bg-secondary/50
                                  hover:bg-secondary
                                  transition-colors
                              "
                  >

                    <p className="font-medium text-foreground">
                      {news.titulo}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {
                        news.created_at?.substring(
                          0,
                          10
                        )
                      }
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }} className="">
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
              {[...upcomingEvents]
                .filter(
                  (event) =>
                    new Date(event.fecha) >= new Date()
                )

                .sort(
                  (a, b) =>
                    new Date(a.fecha) -
                    new Date(b.fecha)
                ).slice(0, 3).map((event) => (

                  <div
                    key={event.id}
                    className="
                      flex
                      items-start
                      gap-4
                      p-3
                      rounded-lg
                      hover:bg-secondary/50
                      transition-colors
                    "
                  >

                    <div
                      className="
                        w-10
                        h-10
                        rounded-lg
                        bg-accent/10
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <AccessTimeIcon
                        className="
                          w-5
                          h-5
                          text-accent
                        "
                      />
                    </div>

                    <div>

                      <p className="font-medium text-foreground">
                        {event.titulo}
                      </p>

                      <p className="text-sm text-muted-foreground">

                        {
                          new Date(`${event.fecha}T00:00:00`).toLocaleDateString(
                            "es-CL"
                          )
                        }

                        {" • "}

                        {
                          new Date(
                            event.fecha
                          ).toLocaleTimeString(
                            "es-CL",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        }

                      </p>

                    </div>

                  </div>

                ))}

            </div>
            <CardActions>

              <button

                onClick={() =>
                  navigate("/dashboard/calendar")
                }

                className="
                    w-full
                    border
                      border-ring
                      hover:text-ring)]
                      mt-2
                      bg-ring
                      hover:bg-white
                      hover:text-ring
                      text-white
                      py-3
                      rounded-lg
                      font-semibold
                      transition-all
                      duration-200
                    "
              >

                Ver calendario completo

              </button>

            </CardActions>
          </CardContent>
        </Card>


        {/* Upcoming events */}
      </div>


    </Box>
  );
}