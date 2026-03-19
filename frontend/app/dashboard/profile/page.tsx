"use client"

import { useState } from "react"
// ICONOS
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// UI
import {
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
  Chip
} from "@mui/material";


const userInfo = {
  name: "Juan Díaz García",
  role: "Desarrollador Senior",
  department: "Tecnología",
  email: "juan.diaz@empresa.com",
  phone: "+34 612 345 678",
  location: "Madrid, España",
  startDate: "15 de Marzo, 2020",
  manager: "María López",
  employeeId: "EMP-2020-0342",
  contractUrl: "/public/DocumentoActa.pdf", // o URL firmada desde backend
}

const skills = ["React", "TypeScript", "Node.js", "Python", "SQL", "AWS", "Docker", "Git"]

const achievements = [
  { title: "Empleado del mes", date: "Octubre 2024", icon: WorkIcon },
  { title: "5 años en la empresa", date: "Marzo 2025", icon: AccessTimeIcon },
  { title: "Certificación AWS", date: "Junio 2024", icon: WorkIcon },
]




export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false)
    const [tab, setTab] = useState("info")

  return (
    <Stack spacing={4}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y profesional</p>
        </div>
        <Button
          variant={isEditing ? "contained" : "outlined"}
          startIcon={<EditIcon />}
          onClick={() => setIsEditing(!isEditing)}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
            py: 1,

            // ----- Estado OUTLINED -----
            ...( !isEditing && {
              borderColor: "#7B1E3A",
              color: "#4A0E1B",

              "&:hover": {
                backgroundColor: "#7B1E3A",
                color: "white",
                borderColor: "#7B1E3A",
              },
            }),

            // ----- Estado CONTAINED -----
            ...( isEditing && {
              backgroundColor: "#7B1E3A",
              color: "white",

              "&:hover": {
                backgroundColor: "#4A0E1B",
                color: "white",
              },
            }),
          }}
        >
          {isEditing ? "Guardar Cambios" : "Editar Perfil"}
        </Button>

      </div>

      {/* Profile header card */}
      <Card sx={{ overflow: "hidden", borderRadius: 4 }}>
        <Box height={120}     sx={{
            background: "linear-gradient(90deg, #6b1426, #541a2c)", // Burdeo → variante
          }} />
        <CardContent sx={{ position: "relative"}}>
          <Stack spacing={4} direction={{ xs: "column", md: "row" }} sx={{ mt: -8 }}>
            
            {/* Avatar */}
            <Box position="relative">
              <Box
                width={120}
                height={120}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius={4}
                bgcolor="#f1f1f1"
                border="4px solid white"
                fontSize={28}
                fontWeight="bold"
              >
                JD
              </Box>

              {isEditing && (
                <Button
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    borderRadius: "50%",
                    minWidth: 0,
                  }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </Button>
              )}
            </Box>

            {/* Basic Info */}
            <Box flex={1} display="flex" flexDirection="column" justifyContent="center" gap={1.5}>
              <Typography variant="h5"  color ="white" fontWeight="bold">
                {userInfo.name}
              </Typography>

              <Typography color="h6" fontWeight="500">
                {userInfo.role}
              </Typography>

              <Typography color="text.secondary">
                {userInfo.department}
              </Typography>
            </Box>

            {/* Employee ID */}
            <Box>
              <Typography variant="body2" color="beige" fontWeight="600" mb={0.5}>
                ID Empleado
              </Typography>
              <Typography fontFamily="monospace" color ="white "fontWeight="600">
                {userInfo.employeeId}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Tabs */}
<Tabs
  value={tab}
  onChange={(_, v) => setTab(v)}
  sx={{

    backgroundColor: "#f4ede4", // Beige claro
    p: 1,
    borderRadius: 3,
    "& .MuiTabs-indicator": {
      display: "none", // Quitar la línea inferior
    },
  }}
>
  <Tab
    label="Información"
    value="info"
    sx={{
      textTransform: "none",
      fontWeight: 500,
      color: "#33141f", // Burdeo oscuro
      borderRadius: 3,
      px: 3,
      "&.Mui-selected": {
        backgroundColor: "white",
        color: "#33141f",
        fontWeight: 600,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      },
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.5)",
      },
    }}
  />

  <Tab
    label="Habilidades"
    value="skills"
    sx={{
      textTransform: "none",
      fontWeight: 500,
      color: "#33141f",
      borderRadius: 3,
      px: 3,
      "&.Mui-selected": {
        backgroundColor: "white",
        color: "#33141f",
        fontWeight: 600,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      },
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.5)",
      },
    }}
  />

  <Tab
    label="Logros"
    value="achievements"
    sx={{
      textTransform: "none",
      fontWeight: 500,
      color: "#33141f",
      borderRadius: 2,
      px: 3,
      "&.Mui-selected": {
        backgroundColor: "white",
        color: "#33141f",
        fontWeight: 600,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      },
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.5)",
      },
    }}
  />
</Tabs>


        {/* Info tab */}
     {tab === "info" && (
        <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
          {/* Contact Info */}
          <Card sx={{ flex: 1 , borderRadius: 4, padding: 2}}>
            <CardHeader
              title={
              <Typography
                  variant="h1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "var(--foreground)",
                  }}
                >
                  Información Contacto
                </Typography>}
              subheader="Tus datos de contacto profesional"
            />
            <CardContent>
              <Stack spacing={3}>
                {/* Email */}
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    gap={1}
                    fontWeight="bold"
                    alignItems="center"
                    sx={{
                      color: "#5e4a41",
                    }}
                  >
                    <EmailIcon fontSize="small" sx={{ color: "inherit" }} />
                    <Typography sx={{ color: "inherit", fontWeight: 600, }}>Correo electrónico</Typography>
                  </Stack>
                  {isEditing ? (
                    <TextField defaultValue={userInfo.email} size="small" />
                  ) : (
                    <Typography fontWeight="500">{userInfo.email}</Typography>
                  )}
                </Stack>

                {/* Phone */}
                <Stack spacing={1}>
                  <Stack                     direction="row"
                    gap={1}
                    fontWeight="bold"
                    alignItems="center"
                    sx={{
                      color: "#5e4a41",
                    }}>
                    <PhoneIcon fontSize="small" sx={{ color: "inherit" }} />
                    <Typography sx={{ color: "inherit", fontWeight: 600, }}>Teléfono</Typography>
                  </Stack>
                  {isEditing ? (
                    <TextField defaultValue={userInfo.phone} size="small" />
                  ) : (
                    <Typography fontWeight="500">{userInfo.phone}</Typography>
                  )}
                </Stack>

                {/* Location */}
                <Stack spacing={1}>
                  <Stack                     direction="row"
                    gap={1}
                    fontWeight="bold"
                    alignItems="center"
                    sx={{
                      color: "#5e4a41",
                    }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography sx={{ color: "inherit", fontWeight: 600, }} >Ubicación</Typography>
                  </Stack>
                  {isEditing ? (
                    <TextField defaultValue={userInfo.location} size="small" />
                  ) : (
                    <Typography fontWeight="500">{userInfo.location}</Typography>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Work info */}
          <Card sx={{ flex: 1 , borderRadius: 4, padding: 2, backgroundColor: "#ffffff"}}>
            <CardHeader
              title={
              <Typography
                  variant="h1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "var(--foreground)",
                  }}
                >
                  Información Laboral
                </Typography>}
              subheader="Detalles sobre tu posición en la empresa"
            />

            <CardContent>
              <Stack spacing={3}>
                {/* Cargo */}
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    gap={1}
                    fontWeight="bold"
                    alignItems="center"
                    sx={{
                      color: "#5e4a41",
                    }}
                  >
                    <WorkIcon fontSize="small" sx={{ color: "inherit" }} />
                    <Typography sx={{ color: "inherit", fontWeight: 600, }}>Cargo</Typography>
                  </Stack>
                  {isEditing ? (
                    <TextField defaultValue={userInfo.role} size="small" />
                  ) : (
                    <Typography fontWeight="500">{userInfo.role}</Typography>
                  )}
                </Stack>

                {/* Departamento */}
                <Stack spacing={1}>
                  <Stack                     direction="row"
                    gap={1}
                    fontWeight="bold"
                    alignItems="center"
                    sx={{
                      color: "#5e4a41",
                    }}>
                    <ApartmentIcon fontSize="small" sx={{ color: "inherit" }} />
                    <Typography sx={{ color: "inherit", fontWeight: 600, }}>Departamento</Typography>
                  </Stack>
                  {isEditing ? (
                    <TextField defaultValue={userInfo.department} size="small" />
                  ) : (
                    <Typography fontWeight="500">{userInfo.department}</Typography>
                  )}
                </Stack>

                {/* Supervisor */}
                <Stack spacing={1}>
                  <Stack                     direction="row"
                    gap={1}
                    fontWeight="bold"
                    alignItems="center"
                    sx={{
                      color: "#5e4a41",
                    }}>
                    <PersonIcon fontSize="small" />
                    <Typography sx={{ color: "inherit", fontWeight: 600, }} >Supervisor</Typography>
                  </Stack>
                  {isEditing ? (
                    <TextField defaultValue={userInfo.manager} size="small" />
                  ) : (
                    <Typography fontWeight="500">{userInfo.manager}</Typography>
                  )}
                </Stack>

                {/* Fecha de Ingreso */}
                <Stack spacing={1}>
                  <Stack                     direction="row"
                    gap={1}
                    fontWeight="bold"
                    alignItems="center"
                    sx={{
                      color: "#5e4a41",
                    }}>
                    <CalendarTodayIcon fontSize="small" sx={{ color: "inherit" }} />
                    <Typography sx={{ color: "inherit", fontWeight: 600, }} >Fecha de Ingreso</Typography>
                  </Stack>
                  {isEditing ? (
                    <TextField defaultValue={userInfo.startDate} size="small" />
                  ) : (
                    <Typography fontWeight="500">{userInfo.startDate}</Typography>
                  )}
                </Stack>
                
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, borderRadius: 4, padding: 2 }}>
            <CardHeader
              title={
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "var(--foreground)",

                  }}
                >
                  Mi Contrato de Trabajo
                </Typography>
              }
              subheader={
                          <Typography>
                            Descarga tu contrato laboral en formato PDF
                          </Typography>
                        }
            />

            <CardContent>
              <Stack spacing={3}>

                {/* Información del archivo */}
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    gap={1}
                    alignItems="center"
                    sx={{ color: "#5e4a41" }}
                  >
                     <EmojiEventsIcon sx={{ fontSize: 40, color: "#7B1E3A" }} />
                    <Typography sx={{ fontWeight: 600 }}>
                      Documento
                    </Typography>
                  </Stack>

                  <Typography fontWeight="500">
                    Contrato_Laboral_{userInfo.name}.pdf
                  </Typography>
                </Stack>

                {/* Acción descarga */}
                <Stack direction="row"       spacing={3}
      alignItems="center"
      justifyContent="center"
      textAlign="center">
                  <Button
                    variant="contained"
                    href={userInfo.contractUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#6a1936",
                      borderRadius: 2,
                      fontWeight: "600",
                      paddingX: 3,
                      "&:hover": {
                        backgroundColor: "#4a1025",
                      },
                    }}
                  >
                    Descargar Contrato
                  </Button>
                </Stack>

              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {tab === "skills" && (
        <Card sx={{ overflow: "hidden", borderRadius: 4 }}>
          <CardHeader
            title=
            {<Typography
                  variant="h1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "var(--foreground)",
                  }}
                >
                  Habilidades y Competencias
                </Typography>}
            subheader="Tecnologías y herramientas que dominas"
          />
          <CardContent>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {skills.map((skill, i) => (
                <Chip key={i} label={skill}   
                sx={{
                    color: "#7B1E3F", // burdeo oscuro
                    backgroundColor: "#F3DDE3", // burdeo claro
                    fontWeight: 600,

                    "&:hover": {
                      backgroundColor: "#7B1E3F", // burdeo oscuro
                      color: "#ffffff", // texto blanco
                      borderColor: "#7B1E3F",
                      fontWeight: 600
                    },
                  }}
                 />
              ))}

              {isEditing && (
                <Button variant="outlined" size="small">
                  + Agregar
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}

      {tab === "achievements" && (
        <Card sx={{ overflow: "hidden", borderRadius: 4 }}>
          <CardHeader
          
            title={<Typography
                  variant="h1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "var(--foreground)",
                  }}
                >
                  Logros y Reconocimientos
                </Typography>}
            subheader="Tus hitos dentro de la empresa"
          />
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              {achievements.map((a, i) => (
              <Card
                key={i}
                sx={{
                  flex: 1,
                  p: 3,
                  textAlign: "center",
                  borderRadius: 4,
                  backgroundColor: "#FBF6F8", // fondo rosado muy claro
                  boxShadow: "none",
                  border: "1px solid #EFE5E8",
                  transition: "0.3s ease",

                  "&:hover": {
                    boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.12)", // sombra más grande
                    transform: "translateY(-2px)",                 // efecto suave opcional
                    cursor: "pointer",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    mx: "auto",
                    mb: 2,
                    backgroundColor: "#EFDDE3",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "0.3s ease",

                    "&:hover": {
                      backgroundColor: "#E5CBD3",
                    },
                  }}
                >
                  <EmojiEventsIcon sx={{ fontSize: 40, color: "#7B1E3A" }} /> {/* burdeo */}
                </Box>

                <Typography fontWeight="600" sx={{ color: "#4A0E1B" /* burdeo oscuro */ }}>
                  {a.title}
                </Typography>

                <Typography variant="body2" sx={{ color: "#7B1E3A" }}>
                  {a.date}
                </Typography>
              </Card>

              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>

  )
}

// 🔹 Componente reutilizable de fila de información
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack spacing={1}>
      <Stack direction="row"
          sx={{
            color: "#5e4a41",
          }}
          gap={1} alignItems="center">
        {icon}
        <Typography
          sx={{
            color: "#5e4a41",
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Typography
        fontWeight="500"
        sx={{
          color: "text.secondary",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

