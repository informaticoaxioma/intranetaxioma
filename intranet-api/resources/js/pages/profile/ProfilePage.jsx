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
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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

const userInfo = {
  name: "Carolina Perez",
  role: "Coordinadora de Contratos",
  department: "Tecnología",
  email: "carolina.perez@empresa.com",
  phone: "+34 612 345 678",
  location: "Madrid, España",
  startDate: "15 de Marzo, 2020",
  manager: "Luis Maluenda",
  employeeId: "EMP-2020-0342",
  contractUrl: "/DocumentoActa.pdf",
};

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

  return (
    <Stack spacing={4}>
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
      <Card sx={{ overflow: "hidden", borderRadius: 2 }}>
        <Box
          height={120}
          sx={{
            background: "linear-gradient(90deg, #6b1426, #541a2c)",
          }}
        />

        <CardContent sx={{ position: "relative" }}>
          <Stack
            spacing={4}
            direction={{ xs: "column", md: "row" }}
            sx={{ mt: -8 }}
          >
            {/* AVATAR */}
            <Box position="relative">
              <Box
                width={120}
                height={120}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius={2}
                bgcolor="#f1f1f1"
                border="4px solid white"
                fontSize={28}
                fontWeight="bold"
              >
                CP
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

            {/* INFO */}
            <Box
              flex={1}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              gap={1.5}
            >
              <Typography variant="h5" color="white" fontWeight="bold">
                {userInfo.name}
              </Typography>

              <Typography color="white">
                {userInfo.role}
              </Typography>

              <Typography color="rgba(255,255,255,0.8)">
                {userInfo.department}
              </Typography>
            </Box>

            {/* EMPLOYEE ID */}
            <Box>
              <Typography
                variant="body2"
                color="white"
                fontWeight="600"
                mb={0.5}
              >
                ID Empleado
              </Typography>

              <Typography
                fontFamily="monospace"
                color="white"
                fontWeight="600"
              >
                {userInfo.employeeId}
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
                  value={userInfo.email}
                />

                <InfoRow
                  icon={<PhoneIcon fontSize="small" />}
                  label="Teléfono"
                  value={userInfo.phone}
                />

                <InfoRow
                  icon={<LocationOnIcon fontSize="small" />}
                  label="Ubicación"
                  value={userInfo.location}
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
                  value={userInfo.role}
                />

                <InfoRow
                  icon={<ApartmentIcon fontSize="small" />}
                  label="Departamento"
                  value={userInfo.department}
                />

                <InfoRow
                  icon={<PersonIcon fontSize="small" />}
                  label="Supervisor"
                  value={userInfo.manager}
                />

                <InfoRow
                  icon={<CalendarTodayIcon fontSize="small" />}
                  label="Ingreso"
                  value={userInfo.startDate}
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
    </Stack>
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
