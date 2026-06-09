import { useState } from "react";

// ICONOS
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useAuth } from "../../hooks/AuthContext";


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
  Chip,
} from "@mui/material";



const skills = [
  "React",
  "JavaScript",
  "Node.js",
  "Python",
  "SQL",
  "AWS",
  "Docker",
  "Git",
];

const achievements = [
  {
    title: "Empleado del mes",
    date: "Octubre 2024",
  },
  {
    title: "5 años en la empresa",
    date: "Marzo 2025",
  },
  {
    title: "Certificación AWS",
    date: "Junio 2024",
  },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [tab, setTab] = useState("info");

  const { user } = useAuth();

  return (
    <Box className="max-w-[1600px] mx-auto p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: "#4A1C23",
              fontWeight: 700,
            }}
          >
            Gestión de Perfil
          </Typography>

          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Gestiona tu perfil y mantén tu información actualizada
          </Typography>
        </Box>

        <Button
          variant={isEditing ? "contained" : "outlined"}
          startIcon={<EditIcon />}
          onClick={() => setIsEditing(!isEditing)}
          sx={{
            textTransform: "none",
            borderRadius: 1,

            ...( !isEditing && {
              borderColor: "#7B1E3A",
              color: "#4A0E1B",

              "&:hover": {
                backgroundColor: "#7B1E3A",
                color: "#fff",
                borderColor: "#7B1E3A",
              },
            }),

            ...( isEditing && {
              backgroundColor: "#7B1E3A",
              color: "#fff",

              "&:hover": {
                backgroundColor: "#4A0E1B",
              },
            }),
          }}
        >
          {isEditing ? "Guardar Cambios" : "Editar Perfil"}
        </Button>
      </div>

      {/* CARD PERFIL */}
        <Card
        sx={{
            overflow: "hidden",
            borderRadius: 2,
            marginTop:1,
            boxShadow: 2,
        }}
        >
        {/* CABECERA BURDEO */}
        <Box
            sx={{
            bgcolor: "#6b1426",
            height: 130,
            px: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            }}
        >
            <Typography
            variant="h4"
            className="font-bold text-white"
            >
            {user?.name} {user?.apellido}
            </Typography>

            <Box textAlign="right">
            <Typography
            variant="body2"
            className="font-bold text-white"
            >
                ID Empleado
            </Typography>

            <Typography
                variant="h7"
                className="font-semibold text-white"
            >
                {user?.id}
            </Typography>
            </Box>
        </Box>

        {/* CUERPO BLANCO */}
        <CardContent
            sx={{
            bgcolor: "white",
            py: 4,
            px: 4,
            }}
        >
            <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems="center"
            >
            {/* AVATAR */}
            <Box
                sx={{
                width: 120,
                height: 120,
                borderRadius: 3,
                bgcolor: "#E5E5E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: 40,
                flexShrink: 0,
                mt: -10,
                border: "4px solid white",
                boxShadow: 2,
                }}
            >
                {user?.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}{user?.apellido
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </Box>

            {/* INFORMACIÓN */}
            <Box>
                <Typography
                variant="h6"
                fontWeight="600"
                color="#222"
                >
                {user?.cargo}
                </Typography>

                <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1 }}
                >
                {user?.departamento}
                </Typography>
            </Box>
            </Stack>
        </CardContent>
        </Card>

      {/* TABS */}
      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{
          marginTop:2,
          marginBottom:2,
          backgroundColor: "#f4ede4",
          p: 1,
          borderRadius: 2,

          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        <Tab label="Información" value="info" />
        <Tab label="Habilidades" value="skills" />
        <Tab label="Logros" value="achievements" />
      </Tabs>

      {/* INFO */}
      {tab === "info" && (
        <Stack direction={{ xs: "column", lg: "row" }} spacing={4}>
          {/* CONTACTO */}
          <Card sx={{ flex: 1, borderRadius: 2, p: 2 }}>
            <CardHeader
              title={
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "#4A1C23",
                  }}
                >
                  Información Contacto
                </Typography>
              }
            />

            <CardContent>
              <Stack spacing={3}>
                <InfoRow
                  icon={<EmailIcon fontSize="small" />}
                  label="Correo"
                  value={user?.email}
                />

                <InfoRow
                  icon={<PhoneIcon fontSize="small" />}
                  label="Teléfono"
                  value={user?.telefono}
                />

                <InfoRow
                  icon={<LocationOnIcon fontSize="small" />}
                  label="Ubicación"
                  value={user?.direccion}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* LABORAL */}
          <Card sx={{ flex: 1, borderRadius: 2, p: 2 }}>
            <CardHeader
              title={
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    color: "#4A1C23",
                  }}
                >
                  Información Laboral
                </Typography>
              }
            />

            <CardContent>
              <Stack spacing={3}>
                <InfoRow
                  icon={<WorkIcon fontSize="small" />}
                  label="Cargo"
                  value={user?.cargo}
                />

                <InfoRow
                  icon={<ApartmentIcon fontSize="small" />}
                  label="Departamento"
                  value={user?.departamento}
                />

                <InfoRow
                  icon={<PersonIcon fontSize="small" />}
                  label="Supervisor"
                  value={user?.supervision_general}
                />

                <InfoRow
                  icon={<CalendarTodayIcon fontSize="small" />}
                  label="Ingreso"
                  value={user?.fecha_ingreso?.substring(0, 10)}
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* SKILLS */}
      {tab === "skills" && (
        <Card sx={{ borderRadius: 2 }}>
          <CardHeader
            title={
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  color: "#4A1C23",
                }}
              >
                Habilidades
              </Typography>
            }
          />

          <CardContent>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {skills.map((skill, i) => (
                <Chip
                  key={i}
                  label={skill}
                  sx={{
                    color: "#7B1E3F",
                    backgroundColor: "#F3DDE3",
                    fontWeight: 600,

                    "&:hover": {
                      backgroundColor: "#7B1E3F",
                      color: "#fff",
                    },
                  }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* LOGROS */}
      {tab === "achievements" && (
        <Card sx={{ borderRadius: 2 }}>
          <CardHeader
            title={
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  color: "#4A1C23",
                }}
              >
                Logros
              </Typography>
            }
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
                    borderRadius: 2,
                    backgroundColor: "#FBF6F8",
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
                    }}
                  >
                    <EmojiEventsIcon
                      sx={{
                        fontSize: 40,
                        color: "#7B1E3A",
                      }}
                    />
                  </Box>

                  <Typography fontWeight="600">
                    {a.title}
                  </Typography>

                  <Typography variant="body2">
                    {a.date}
                  </Typography>
                </Card>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <Stack spacing={1}>
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        sx={{
          color: "#5e4a41",
        }}
      >
        {icon}

        <Typography
          sx={{
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>
      </Stack>

      <Typography fontWeight="500">
        {value}
      </Typography>
    </Stack>
  );
}
