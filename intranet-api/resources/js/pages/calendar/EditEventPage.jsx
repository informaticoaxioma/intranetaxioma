import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Breadcrumbs,
  Grid,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { getEventById, updateEvent, deleteEvent } from "../../services/api";

const eventTypes = {
  reunion: "Reunión",
  capacitacion: "Capacitación",
  evento: "Evento",
  deadline: "Deadline",
  festivo: "Festivo",
};

export default function EditEventPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    titulo: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    tipo: "",
    ubicacion: "",
    descripcion: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const cargarEvento = async () => {
      try {
        const data = await getEventById(id);
        // Format date string to YYYY-MM-DD for input[type="date"]
        let formattedDate = "";
        if (data.fecha) {
          formattedDate = data.fecha.substring(0, 10);
        }
        // Format time to HH:MM if necessary
        let startTime = data.hora_inicio || "";
        if (startTime.length > 5) startTime = startTime.substring(0, 5);
        let endTime = data.hora_fin || "";
        if (endTime.length > 5) endTime = endTime.substring(0, 5);

        setForm({
          titulo: data.titulo || "",
          fecha: formattedDate,
          hora_inicio: startTime,
          hora_fin: endTime,
          tipo: data.tipo || "",
          ubicacion: data.ubicacion || "",
          descripcion: data.descripcion || "",
        });
      } catch (error) {
        console.error("Error al cargar el evento", error);
        setSnackbar({
          open: true,
          message: "Error al cargar los datos del evento",
          severity: "error",
        });
      }
    };

    cargarEvento();
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      try {
        await deleteEvent(id);
        setSnackbar({
          open: true,
          message: "Evento eliminado correctamente",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/dashboard/calendar");
        }, 1500);
      } catch (error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: error.message || "Error al eliminar el evento",
          severity: "error",
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(id, form);
      setSnackbar({
        open: true,
        message: "Evento actualizado correctamente",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/dashboard/calendar");
      }, 1500);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: error.message || "Error al actualizar el evento",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/dashboard" className="text-gray-500 hover:underline">
          Inicio
        </Link>
        <Link to="/dashboard/calendar" className="text-gray-500 hover:underline">
          Calendario
        </Link>
        <Typography color="text.primary">Editar Evento</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
          <Button
            component={Link}
            to="/dashboard/calendar"
            startIcon={<ChevronLeftIcon />}
            sx={{ color: "#722F37", textTransform: "none", mr: 1 }}
          >
            Volver
          </Button>
          <Typography variant="h5" fontWeight="bold" color="#4A1C23">
            Editar Evento
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Título del evento"
                required
                value={form.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#722F37" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha"
                required
                slotProps={{ inputLabel: { shrink: true } }}
                value={form.fecha}
                onChange={(e) => handleChange("fecha", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#722F37" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel sx={{ "&.Mui-focused": { color: "#722F37" } }}>Tipo</InputLabel>
                <Select
                  value={form.tipo}
                  label="Tipo"
                  onChange={(e) => handleChange("tipo", e.target.value)}
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#722F37" },
                  }}
                >
                  {Object.entries(eventTypes).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Hora inicio"
                required
                slotProps={{ inputLabel: { shrink: true } }}
                value={form.hora_inicio}
                onChange={(e) => handleChange("hora_inicio", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#722F37" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Hora fin"
                required
                slotProps={{ inputLabel: { shrink: true } }}
                value={form.hora_fin}
                onChange={(e) => handleChange("hora_fin", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#722F37" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>

              <TextField
                fullWidth
                label="Ubicación"
                required
                value={form.ubicacion}
                onChange={(e) => handleChange("ubicacion", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#722F37" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Descripción"
                required
                multiline
                rows={4}
                value={form.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#722F37" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              sx={{
                textTransform: "none",
                mr: "auto"
              }}
            >
              Eliminar Evento
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/dashboard/calendar"
              sx={{
                borderColor: "#722F37",
                color: "#722F37",
                textTransform: "none",
                "&:hover": { borderColor: "#4A1C23", color: "#4A1C23" },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#722F37",
                color: "white",
                textTransform: "none",
                "&:hover": { backgroundColor: "#4A1C23" },
              }}
            >
              Guardar Cambios
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
