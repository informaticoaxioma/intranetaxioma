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

import { Typography, Box, IconButton, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField as MuiTextField, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel, CircularProgress, Tooltip, Badge } from "@mui/material";
import ForumIcon from '@mui/icons-material/Forum';
import SendIcon from '@mui/icons-material/Send';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthContext";
import { getNews, getEvents, getDashboardStats, sendFeedback, createTicket, getMyTickets } from '../../services/api';
import { renderTextWithLinks } from "../../components/LinkifiedText";
import TicketChat from "../../components/TicketChat";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const eventTypeLabels = {
  capacitacion: "Capacitación",
  evento: "Evento",
  cumpleanos: "Cumpleaños",
  festivo: "Festivo",
};


const stats = [
  { label: "Documentos", value: "128", icon: DescriptionIcon, change: "+12 este mes" },
  { label: "Eventos", value: "8", icon: CalendarTodayIcon, change: "Esta semana" },
]

const slidesComite = [
  {
    title: "Comité Paritario",
    description: "Organismo encargado de velar por el cumplimiento del reglamento interno, promover buenas prácticas laborales, fomentar ambientes de trabajo seguros y colaborar en la aplicación de las políticas internas de la empresa.",
    image: "/imagenes/banner_comite_paritario_axioma_burdeos.png",
    link: "/dashboard/documents"
  },
  {
    title: "Prevención y Seguridad",
    description: "Promovemos una cultura de autocuidado e identificamos riesgos en nuestras instalaciones, velando por que cada miembro del equipo trabaje en condiciones óptimas y protegidas.",
    image: "/imagenes/Logo-Def-Mutual.png",
    link: "https://www.mutual.cl/portal/publico/empresa/home"
  },
  {
    title: "Caja de Compensación",
    description: "Fomentamos la salud y calidad de vida de nuestros trabajadores, impulsando la mejora continua de los espacios de trabajo y el equilibrio entre vida laboral y personal.",
    image: "/imagenes/BANNER-CAJA.jpg",
    link: "https://somosandes.cajalosandes.cl/"
  }
];



export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [corporateNews, setCorporateNews] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // === ESTADO TICKETERA / MESA DE AYUDA ===
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    title: "",
    category: "Soporte TI",
    priority: "media",
    description: "",
  });
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketSuccessModalOpen, setTicketSuccessModalOpen] = useState(false);
  const [createdTicketInfo, setCreatedTicketInfo] = useState(null);

  // Mis Tickets Modal
  const [myTicketsModalOpen, setMyTicketsModalOpen] = useState(false);
  const [myTickets, setMyTickets] = useState([]);
  const [myTicketsLoading, setMyTicketsLoading] = useState(false);
  const [ticketImage, setTicketImage] = useState(null);
  const [ticketImagePreview, setTicketImagePreview] = useState(null);
  const [previewZoomImage, setPreviewZoomImage] = useState(null);
  const [activeChatTicket, setActiveChatTicket] = useState(null);

  const totalUnreadMyTickets = myTickets.reduce(
    (sum, t) => sum + (Number(t.unread_messages_count) || 0),
    0
  );

  useEffect(() => {
    const fetchInitialMyTickets = async () => {
      try {
        const data = await getMyTickets();
        setMyTickets(data);
      } catch (err) {
        // silent
      }
    };
    fetchInitialMyTickets();
  }, []);

  const handleOpenTicketModal = () => {
    setTicketForm({
      title: "",
      category: "Soporte TI",
      priority: "media",
      description: "",
    });
    setTicketImage(null);
    if (ticketImagePreview) URL.revokeObjectURL(ticketImagePreview);
    setTicketImagePreview(null);
    setTicketModalOpen(true);
  };

  const handleTicketImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setSnackbar({ open: true, message: "La imagen no debe superar los 10MB.", severity: "warning" });
      return;
    }
    setTicketImage(file);
    if (ticketImagePreview) URL.revokeObjectURL(ticketImagePreview);
    setTicketImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveTicketImage = () => {
    setTicketImage(null);
    if (ticketImagePreview) URL.revokeObjectURL(ticketImagePreview);
    setTicketImagePreview(null);
  };

  const handleCreateTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.title.trim() || !ticketForm.description.trim()) {
      setSnackbar({ open: true, message: "Por favor completa el asunto y la descripción.", severity: "warning" });
      return;
    }

    setTicketLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", ticketForm.title.trim());
      formData.append("category", ticketForm.category);
      formData.append("priority", ticketForm.priority);
      formData.append("description", ticketForm.description.trim());
      if (ticketImage) {
        formData.append("imagen", ticketImage);
      }

      const res = await createTicket(formData);

      setTicketModalOpen(false);
      setTicketImage(null);
      if (ticketImagePreview) URL.revokeObjectURL(ticketImagePreview);
      setTicketImagePreview(null);
      setCreatedTicketInfo(res.ticket);
      setTicketSuccessModalOpen(true);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Error al crear ticket",
        severity: "error",
      });
    } finally {
      setTicketLoading(false);
    }
  };

  const handleOpenMyTickets = async () => {
    setMyTicketsModalOpen(true);
    setMyTicketsLoading(true);
    try {
      const data = await getMyTickets();
      setMyTickets(data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error al cargar tus tickets",
        severity: "error",
      });
    } finally {
      setMyTicketsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slidesComite.length);
    }, 15000);
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

      {/* SECCIÓN SUPERIOR: TICKET Y MESA DE AYUDA (IZQUIERDA) + 3 KPIS (MITAD DERECHA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mb-2 items-stretch">
        {/* TARJETA MESA DE AYUDA / LEVANTAR TICKET (AL PRINCIPIO, MITAD IZQUIERDA) */}
        <div className="lg:col-span-6 flex">
          <Card
            sx={{
              borderRadius: 2,
              border: "1px solid #E8E0D5",
              borderLeft: "6px solid #722F37",
              background: "linear-gradient(135deg, #FFFFFF 0%, #FAF7F2 100%)",
              boxShadow: "0 4px 14px rgba(74, 28, 35, 0.05)",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            className="rounded-lg"
          >
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(114, 47, 55, 0.25)",
                    flexShrink: 0,
                  }}
                >
                  <ConfirmationNumberIcon sx={{ fontSize: 26, color: "white" }} />
                </Box>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#4A1C23", lineHeight: 1.2 }}>
                      Mesa de Ayuda y Soporte
                    </Typography>
                    <Chip
                      label="Atención hoy"
                      size="small"
                      sx={{
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        height: 20,
                        bgcolor: "#dcfce7",
                        color: "#15803d",
                        border: "1px solid #bbf7d0",
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.8rem", mt: 0.3 }}>
                    ¿Requieres asistencia o soporte técnico? Levanta tu requerimiento aquí.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: { xs: "100%", sm: "auto" }, justifyContent: "flex-end", flexShrink: 0 }}>
                <Badge
                  badgeContent={totalUnreadMyTickets}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      fontWeight: 800,
                      fontSize: "0.72rem",
                      boxShadow: "0 0 10px rgba(239, 68, 68, 0.7)",
                      animation: totalUnreadMyTickets > 0 ? "pulse 2s infinite" : "none",
                    },
                  }}
                >
                  <Button
                    variant={totalUnreadMyTickets > 0 ? "contained" : "outlined"}
                    size="small"
                    onClick={handleOpenMyTickets}
                    startIcon={totalUnreadMyTickets > 0 ? <ForumIcon sx={{ fontSize: "16px !important" }} /> : null}
                    sx={{
                      borderColor: totalUnreadMyTickets > 0 ? "#ef4444" : "#E8E0D5",
                      bgcolor: totalUnreadMyTickets > 0 ? "#b91c1c" : "transparent",
                      color: totalUnreadMyTickets > 0 ? "#ffffff" : "#4A1C23",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      textTransform: "none",
                      py: 0.8,
                      px: 1.8,
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: totalUnreadMyTickets > 0 ? "#991b1b" : "#722F37",
                        backgroundColor: totalUnreadMyTickets > 0 ? "#991b1b" : "#FAF7F2",
                      },
                    }}
                  >
                    Mis Tickets {totalUnreadMyTickets > 0 ? `(${totalUnreadMyTickets} nuevo${totalUnreadMyTickets > 1 ? "s" : ""})` : ""}
                  </Button>
                </Badge>

                <Button
                  variant="contained"
                  size="small"
                  onClick={handleOpenTicketModal}
                  startIcon={<ConfirmationNumberIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textTransform: "none",
                    py: 0.9,
                    px: 2.2,
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(114, 47, 55, 0.3)",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      background: "linear-gradient(135deg, #8B4049 0%, #5A1E24 100%)",
                      boxShadow: "0 6px 16px rgba(114, 47, 55, 0.45)",
                    },
                  }}
                >
                  Levantar Ticket
                </Button>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* LOS 3 KPIS (MITAD DERECHA) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                sx={{
                  borderRadius: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                key={stat.label}
                className="rounded-lg"
              >
                <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-0.5">{stat.value}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <TrendingUpIcon className="w-3 h-3 text-green-600" />
                        {stat.change}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
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
              objectFit: "contain",
              backgroundColor: "#fcfaf7",
              cursor: "pointer",
              transition: "opacity 0.5s ease"
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
            {corporateNews.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  onClick={() => navigate(`/dashboard/news/${corporateNews[0].id}`)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 3,
                      transform: "translateY(-2px)",
                    },
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    p: 2,
                    bgcolor: "action.hover",
                  }}
                >
                  <Box
                    component="img"
                    src={
                      corporateNews[0].path_imagen
                        ? `${API_BASE_URL}/storage/${corporateNews[0].path_imagen}`
                        : "https://picsum.photos/600/300"
                    }
                    alt={corporateNews[0].titulo}
                    sx={{
                      width: { xs: "100%", sm: 160 },
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 1.5,
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, minWidth: 0 }}>
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                          color: "#4A1C23",
                          mb: 1,
                          fontSize: "1.1rem",
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {corporateNews[0].titulo}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: 1.4,
                          mb: 1
                        }}
                      >
                        {renderTextWithLinks(corporateNews[0].resumen)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {corporateNews[0].created_at?.substring(0, 10)} | Por {corporateNews[0].autor}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/dashboard/news")}
                    sx={{
                      textTransform: "none",
                      borderColor: "#7B1E3A",
                      color: "#7B1E3A",
                      fontWeight: 600,
                      px: 3,
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "#4A0E1B",
                        backgroundColor: "rgba(123, 30, 58, 0.04)",
                      },
                    }}
                  >
                    Ver más noticias
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No hay noticias corporativas publicadas.
              </Typography>
            )}
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

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        {event.tipo && (
                          <>
                            <Typography
                              component="span"
                              sx={{
                                fontSize: "0.75rem",
                                color: "#6a1936",
                                fontWeight: "bold",
                              }}
                            >
                              {eventTypeLabels[event.tipo?.toLowerCase()] || event.tipo}
                            </Typography>
                            <Typography
                              component="span"
                              sx={{
                                fontSize: "0.75rem",
                                color: "#999",
                              }}
                            >
                              |
                            </Typography>
                          </>
                        )}
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "0.75rem",
                            color: "text.secondary",
                          }}
                        >
                          {
                            new Date(`${event.fecha}T00:00:00`).toLocaleDateString(
                              "es-CL"
                            )
                          }
                        </Typography>
                      </Box>

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

      {/* === SECCIÓN CONVERSACIÓN CON EL COMITÉ PARITARIO === */}
      <Box
        sx={{
          mt: 3,
          mb: 2,
          borderRadius: 3,
          background: "linear-gradient(135deg, #FFFFFF 0%, #FAF7F2 100%)",
          border: "1px solid #E8E0D5",
          borderLeft: "6px solid #722F37",
          p: { xs: 3, md: 3.5 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 3,
          boxShadow: "0 6px 20px rgba(74,28,35,0.06)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 14px rgba(114, 47, 55, 0.3)",
            }}
          >
            <ForumIcon sx={{ color: "white", fontSize: 32 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                color: "#4A1C23",
                fontWeight: 700,
                fontSize: "1.25rem",
                lineHeight: 1.2,
              }}
            >
              Comité Paritario
            </Typography>
            <Typography
              sx={{
                color: "#6D5257",
                fontSize: "0.92rem",
                mt: 0.5,
                maxWidth: 520,
              }}
            >
              ¿Tienes dudas, inquietudes o sugerencias sobre seguridad y bienestar? Comunícate directamente con el Comité Paritario.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={() => setFeedbackOpen(true)}
          startIcon={
            <ForumIcon
              sx={{
                fontSize: 24,
                color: "#FFFFFF",
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))",
              }}
            />
          }
          sx={{
            background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: "0.95rem",
            px: 3.5,
            py: 1.6,
            borderRadius: 2.5,
            whiteSpace: "nowrap",
            flexShrink: 0,
            boxShadow: "0 4px 16px rgba(114, 47, 55, 0.35)",
            border: "1px solid rgba(255,255,255,0.15)",
            transition: "all 0.25s ease-in-out",
            "&:hover": {
              background: "linear-gradient(135deg, #8B4049 0%, #5A1E24 100%)",
              boxShadow: "0 6px 22px rgba(114, 47, 55, 0.5)",
              transform: "translateY(-1px)",
            },
          }}
        >
          Conversar con el Comité
        </Button>
      </Box>

      {/* === MODAL FORMULARIO DE FEEDBACK === */}
      <Dialog
        open={feedbackOpen}
        onClose={() => {
          setFeedbackOpen(false);
          setFeedbackMessage("");
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            py: 2.5,
          }}
        >
          <ForumIcon sx={{ fontSize: 28 }} />
          Conversación con el Comité Paritario
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
            Tu mensaje será enviado directamente al <strong>Comité Paritario</strong> de Axioma. Tu nombre, correo y área serán incluidos para que puedan responderte.
          </Typography>

          <MuiTextField
            label="Tu mensaje o consulta"
            multiline
            rows={5}
            fullWidth
            required
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            placeholder="Escribe aquí tus comentarios, sugerencias o recomendaciones..."
            inputProps={{ maxLength: 2000 }}
            helperText={`${feedbackMessage.length} / 2000 caracteres`}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&.Mui-focused fieldset": { borderColor: "#722F37" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => {
              setFeedbackOpen(false);
              setFeedbackMessage("");
            }}
            sx={{ color: "text.secondary", borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            endIcon={feedbackLoading ? null : <SendIcon />}
            disabled={feedbackLoading || feedbackMessage.trim().length < 10}
            onClick={async () => {
              setFeedbackLoading(true);
              try {
                const res = await sendFeedback(feedbackMessage.trim());
                setSnackbar({ open: true, message: res.message, severity: "success" });
                setFeedbackOpen(false);
                setFeedbackMessage("");
              } catch (err) {
                setSnackbar({ open: true, message: err.message, severity: "error" });
              } finally {
                setFeedbackLoading(false);
              }
            }}
            sx={{
              background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
              color: "#FFFFFF",
              px: 3,
              borderRadius: 2,
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(114, 47, 55, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #8B4049 0%, #5A1E24 100%)",
              },
              "&.Mui-disabled": { opacity: 0.5 },
            }}
          >
            {feedbackLoading ? "Enviando..." : "Enviar mensaje"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* === MODAL 1: FORMULARIO LEVANTAR TICKET === */}
      <Dialog
        open={ticketModalOpen}
        onClose={() => !ticketLoading && setTicketModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ConfirmationNumberIcon sx={{ fontSize: 26 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Levantar Requerimiento / Ticket
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
                Mesa de Ayuda &bull; Intranet Axioma
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setTicketModalOpen(false)} sx={{ color: "white" }} disabled={ticketLoading}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleCreateTicketSubmit}>
          <DialogContent sx={{ pt: 3, pb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
              Ingresa el detalle de tu solicitud técnica o requerimiento. Al enviarlo se le asignará un código <strong>AXM-XXXX</strong> y te llegará una confirmación a tu correo.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2.5 }}>
              <FormControl fullWidth size="small" sx={{ flex: 1, minWidth: 200 }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={ticketForm.category}
                  label="Categoría"
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                >
                  <MenuItem value="Soporte TI">Soporte TI</MenuItem>
                  <MenuItem value="Sistemas / Software">Sistemas / Software</MenuItem>
                  <MenuItem value="Hardware / Equipos">Hardware / Equipos</MenuItem>
                  <MenuItem value="Cuentas y Accesos">Cuentas y Accesos</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={{ flex: 1, minWidth: 160 }}>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={ticketForm.priority}
                  label="Prioridad"
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                >
                  <MenuItem value="baja">Baja</MenuItem>
                  <MenuItem value="media">Media</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                  <MenuItem value="urgente">🚨 Urgente</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <MuiTextField
              label="Asunto o Título del Requerimiento"
              fullWidth
              required
              size="small"
              value={ticketForm.title}
              onChange={(e) => setTicketForm({ ...ticketForm, title: e.target.value })}
              placeholder="Ej: Problema al acceder a VPN / Falla de correo"
              inputProps={{ maxLength: 200 }}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": { borderColor: "#722F37" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
              }}
            />

            <MuiTextField
              label="Descripción detallada del problema o solicitud"
              multiline
              rows={4}
              fullWidth
              required
              value={ticketForm.description}
              onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
              placeholder="Explica detalladamente qué ocurre, pasos para reproducir o qué necesitas..."
              inputProps={{ maxLength: 5000 }}
              helperText={`${ticketForm.description.length} / 5000 caracteres`}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": { borderColor: "#722F37" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
              }}
            />

            {/* ADJUNTAR FOTOGRAFÍA OPCIONAL */}
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", display: "block", mb: 1 }}>
                Fotografía o Captura de Pantalla (Opcional)
              </Typography>

              {!ticketImagePreview ? (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AddPhotoAlternateIcon />}
                  sx={{
                    borderRadius: 2,
                    borderColor: "#E8E0D5",
                    color: "#4A1C23",
                    py: 1.2,
                    px: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    borderStyle: "dashed",
                    borderWidth: 1.5,
                    bgcolor: "#FAF7F2",
                    width: "100%",
                    justifyContent: "center",
                    "&:hover": {
                      borderColor: "#722F37",
                      bgcolor: "rgba(114, 47, 55, 0.04)",
                      borderStyle: "dashed",
                    },
                  }}
                >
                  Adjuntar fotografía o captura (JPG, PNG, WEBP)
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                    hidden
                    onChange={handleTicketImageChange}
                  />
                </Button>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.8,
                    p: 1.5,
                    bgcolor: "#FAF7F2",
                    border: "1px solid #E8E0D5",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={ticketImagePreview}
                    alt="Vista previa"
                    onClick={() => setPreviewZoomImage(ticketImagePreview)}
                    sx={{
                      width: 54,
                      height: 54,
                      objectFit: "cover",
                      borderRadius: 1.5,
                      cursor: "pointer",
                      border: "1px solid rgba(114, 47, 55, 0.25)",
                      transition: "transform 0.15s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {ticketImage?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                      {ticketImage ? (ticketImage.size / (1024 * 1024)).toFixed(2) : "0"} MB &bull; Clic en la imagen para ampliar
                    </Typography>
                  </Box>
                  <Tooltip title="Quitar fotografía">
                    <IconButton size="small" onClick={handleRemoveTicketImage} sx={{ color: "#b91c1c" }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={() => setTicketModalOpen(false)}
              disabled={ticketLoading}
              sx={{ color: "text.secondary", fontWeight: 600 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={ticketLoading || !ticketForm.title.trim() || !ticketForm.description.trim()}
              sx={{
                background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
                color: "#FFFFFF",
                px: 3.5,
                py: 1,
                borderRadius: 2,
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(114, 47, 55, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #8B4049 0%, #5A1E24 100%)",
                },
                "&.Mui-disabled": { opacity: 0.5 },
              }}
            >
              {ticketLoading ? "Enviando Ticket..." : "Enviar Requerimiento"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* === MODAL 2: ÉXITO AL CREAR TICKET (AVISO ATENCIÓN DURANTE EL DÍA) === */}
      {createdTicketInfo && (
        <Dialog
          open={ticketSuccessModalOpen}
          onClose={() => setTicketSuccessModalOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
          <DialogContent sx={{ textAlign: "center", pt: 4, pb: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "#dcfce7",
                color: "#15803d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                border: "2px solid #bbf7d0",
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 38 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, color: "#4A1C23", mb: 1 }}>
              ¡Ticket Generado con Éxito!
            </Typography>

            <Chip
              label={createdTicketInfo.code || `AXM-${createdTicketInfo.id}`}
              sx={{
                fontSize: "1.1rem",
                fontWeight: 800,
                py: 2.2,
                px: 2,
                bgcolor: "rgba(114, 47, 55, 0.08)",
                color: "#722F37",
                border: "1.5px solid rgba(114, 47, 55, 0.25)",
                borderRadius: 2,
                letterSpacing: "0.8px",
                mb: 2.5,
              }}
            />

            <Box
              sx={{
                bgcolor: "#FAF7F2",
                border: "1px solid #E8E0D5",
                borderLeft: "5px solid #722F37",
                borderRadius: 2,
                p: 2,
                textAlign: "left",
                mb: 2.5,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#4A1C23", mb: 0.5 }}>
                Se le asignó el ticket {createdTicketInfo.code || `AXM-${createdTicketInfo.id}`} y se le atenderá durante el día.
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                Hemos enviado un correo de confirmación con los detalles de tu requerimiento.
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center" }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setTicketSuccessModalOpen(false)}
              sx={{
                background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
                fontWeight: 700,
                py: 1.2,
                borderRadius: 2,
              }}
            >
              Entendido
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* === MODAL 3: MIS TICKETS (HISTORIAL DEL USUARIO) === */}
      <Dialog
        open={myTicketsModalOpen}
        onClose={() => setMyTicketsModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ConfirmationNumberIcon sx={{ fontSize: 26 }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Mis Tickets y Solicitudes
            </Typography>
          </Box>
          <IconButton onClick={() => setMyTicketsModalOpen(false)} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {myTicketsLoading ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <CircularProgress size={32} sx={{ color: "#722F37" }} />
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
                Cargando tus tickets...
              </Typography>
            </Box>
          ) : myTickets.length === 0 ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <SupportAgentIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#475569" }}>
                Aún no has levantado ningún ticket
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                Cuando tengas un problema técnico o requerimiento, haz clic en "Levantar Ticket".
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {myTickets.map((t) => {
                const statusStyles = {
                  pendiente: { label: "Pendiente", color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
                  en_proceso: { label: "En Proceso", color: "#1d4ed8", bg: "#dbeafe", border: "#bfdbfe" },
                  resuelto: { label: "Resuelto", color: "#15803d", bg: "#dcfce7", border: "#bbf7d0" },
                  cerrado: { label: "Cerrado", color: "#475569", bg: "#f1f5f9", border: "#e2e8f0" },
                }[t.status] || { label: t.status, color: "#475569", bg: "#f1f5f9", border: "#e2e8f0" };

                return (
                  <Box
                    key={t.id}
                    sx={{
                      p: 2.5,
                      border: "1px solid #E8E0D5",
                      borderRadius: 2.5,
                      bgcolor: "#FAF7F2",
                      transition: "all 0.2s ease",
                      "&:hover": { borderColor: "#722F37", bgcolor: "#FFFFFF" },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, flexWrap: "wrap", mb: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Chip
                          label={t.code || `AXM-${t.id}`}
                          sx={{
                            fontWeight: 800,
                            bgcolor: "rgba(114, 47, 55, 0.08)",
                            color: "#722F37",
                            border: "1px solid rgba(114, 47, 55, 0.2)",
                            borderRadius: 1.5,
                          }}
                        />
                        <Chip
                          size="small"
                          label={t.category}
                          sx={{ bgcolor: "#E8E0D5", color: "#4A1C23", fontWeight: 600 }}
                        />
                        {t.assigned_user ? (
                          <Chip
                            size="small"
                            label={`🛠️ Responsable: ${t.assigned_user.name} ${t.assigned_user.apellido}`}
                            sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: "0.72rem", border: "1px solid #bbf7d0" }}
                          />
                        ) : (
                          <Chip
                            size="small"
                            label="⏳ Pendiente de asignación"
                            sx={{ bgcolor: "#fef3c7", color: "#92400e", fontWeight: 600, fontSize: "0.7rem", border: "1px solid #fde68a" }}
                          />
                        )}
                        {t.unread_messages_count > 0 && (
                          <Chip
                            size="small"
                            icon={<ForumIcon sx={{ fontSize: "13px !important", color: "#b91c1c !important" }} />}
                            label={`${t.unread_messages_count} NUEVO${t.unread_messages_count !== 1 ? "S" : ""} MENSAJE${t.unread_messages_count !== 1 ? "S" : ""}`}
                            sx={{
                              bgcolor: "#fef2f2",
                              color: "#b91c1c",
                              border: "1.5px solid #ef4444",
                              fontWeight: 900,
                              fontSize: "0.7rem",
                              letterSpacing: "0.3px",
                              animation: "pulse 1.8s infinite",
                              boxShadow: "0 0 8px rgba(239, 68, 68, 0.35)",
                            }}
                          />
                        )}
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {t.created_at ? new Date(t.created_at).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                        </Typography>
                      </Box>

                      <Chip
                        size="small"
                        label={statusStyles.label}
                        sx={{
                          fontWeight: 700,
                          color: statusStyles.color,
                          bgcolor: statusStyles.bg,
                          border: `1px solid ${statusStyles.border}`,
                        }}
                      />
                    </Box>

                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
                      {t.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: "#475569", mb: t.admin_notes ? 2 : 0, lineHeight: 1.6 }}>
                      {t.description}
                    </Typography>

                    {t.imagen_url && (
                      <Box sx={{ mt: 1.8, pt: 1.5, borderTop: "1px dashed #E8E0D5", display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          component="img"
                          src={t.imagen_url}
                          alt="Fotografía adjunta"
                          onClick={() => setPreviewZoomImage(t.imagen_url)}
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: 1.5,
                            objectFit: "cover",
                            cursor: "pointer",
                            border: "1px solid #cbd5e1",
                            transition: "all 0.15s ease",
                            "&:hover": { transform: "scale(1.05)", borderColor: "#722F37" },
                          }}
                        />
                        <Box>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: "#4A1C23", display: "flex", alignItems: "center", gap: 0.5 }}>
                            <ImageIcon sx={{ fontSize: 16 }} /> Fotografía adjunta
                          </Typography>
                          <Typography
                            variant="caption"
                            onClick={() => setPreviewZoomImage(t.imagen_url)}
                            sx={{ color: "#722F37", cursor: "pointer", textDecoration: "underline", fontWeight: 600, display: "block" }}
                          >
                            Ver fotografía completa
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {t.admin_notes && (
                      <Box
                        sx={{
                          mt: 1.5,
                          p: 2,
                          bgcolor: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 800, color: "#15803d", textTransform: "uppercase", display: "block", mb: 0.5 }}>
                          Respuesta del Equipo de Soporte:
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#166534", lineHeight: 1.5 }}>
                          {t.admin_notes}
                        </Typography>
                      </Box>
                    )}

                    {/* BOTÓN SEGUIMIENTO Y CHAT */}
                    <Box sx={{ mt: 2, pt: 1.5, borderTop: "1px solid #E8E0D5", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1.5 }}>
                      <Typography variant="caption" sx={{ color: t.unread_messages_count > 0 ? "#b91c1c" : "text.secondary", fontWeight: t.unread_messages_count > 0 ? 800 : 600 }}>
                        {t.unread_messages_count > 0
                          ? `🔴 Tienes ${t.unread_messages_count} nuevo${t.unread_messages_count !== 1 ? "s" : ""} mensaje${t.unread_messages_count !== 1 ? "s" : ""} sin leer del soporte`
                          : t.messages_count > 0
                          ? `💬 ${t.messages_count} mensaje${t.messages_count !== 1 ? "s" : ""} en conversación`
                          : "Sin mensajes adicionales aún"}
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={
                          t.unread_messages_count > 0 ? (
                            <Badge badgeContent={t.unread_messages_count} color="error">
                              <ForumIcon sx={{ fontSize: "16px !important" }} />
                            </Badge>
                          ) : (
                            <ForumIcon sx={{ fontSize: "16px !important" }} />
                          )
                        }
                        onClick={() => {
                          setActiveChatTicket(t);
                          // Marcar localmente como leídos para actualizar el badge de inmediato
                          setMyTickets((prev) =>
                            prev.map((item) => (item.id === t.id ? { ...item, unread_messages_count: 0 } : item))
                          );
                        }}
                        sx={{
                          background: t.unread_messages_count > 0 ? "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)" : "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
                          color: "#ffffff",
                          textTransform: "none",
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          borderRadius: 2,
                          px: 2,
                          py: 0.7,
                          boxShadow: t.unread_messages_count > 0 ? "0 4px 14px rgba(220, 38, 38, 0.4)" : "0 2px 8px rgba(114, 47, 55, 0.25)",
                          "&:hover": {
                            background: t.unread_messages_count > 0 ? "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" : "linear-gradient(135deg, #8B4049 0%, #5A1E24 100%)",
                          },
                        }}
                      >
                        {t.unread_messages_count > 0
                          ? `Ver Chat (${t.unread_messages_count} nuevo${t.unread_messages_count !== 1 ? "s" : ""})`
                          : `Seguimiento y Chat ${t.messages_count > 0 ? `(${t.messages_count})` : ""}`}
                      </Button>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setMyTicketsModalOpen(false)} sx={{ color: "text.secondary", fontWeight: 600 }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* === MODAL 4: CHAT Y SEGUIMIENTO DEL TICKET === */}
      {activeChatTicket && (
        <TicketChat
          ticket={activeChatTicket}
          onClose={() => {
            setActiveChatTicket(null);
            handleOpenMyTickets();
          }}
          onMessagesRead={(ticketId) => {
            setMyTickets((prev) =>
              prev.map((item) => (item.id === ticketId ? { ...item, unread_messages_count: 0 } : item))
            );
          }}
          onMessageSent={() => {
            // Actualizar en el estado local de myTickets
            setMyTickets((prev) =>
              prev.map((item) =>
                item.id === activeChatTicket.id
                  ? { ...item, messages_count: (item.messages_count || 0) + 1 }
                  : item
              )
            );
          }}
        />
      )}

      {/* Snackbar de confirmación / error */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 2, boxShadow: 4 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* MODAL ZOOM DE IMAGEN */}
      <Dialog
        open={Boolean(previewZoomImage)}
        onClose={() => setPreviewZoomImage(null)}
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3, bgcolor: "transparent", boxShadow: "none", overflow: "hidden" } }}
      >
        <Box sx={{ position: "relative", bgcolor: "#0f172a", p: 1.5, textAlign: "center", borderRadius: 2 }}>
          <IconButton
            onClick={() => setPreviewZoomImage(null)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "white",
              bgcolor: "rgba(0,0,0,0.6)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={previewZoomImage}
            alt="Fotografía ampliada"
            sx={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: 1.5, display: "block", mx: "auto" }}
          />
        </Box>
      </Dialog>

    </Box>
  );
}