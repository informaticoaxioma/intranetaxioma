import { useState, useEffect } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
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
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { getDocumentById, updateDocument } from "../../services/api";

const categorias = [
  "Recursos humanos",
  "Politicas y Normativas",
  "Finanzas",
  "Prevención de Riesgo",
  "Servicios Técnicos",
  "Flota",
];

export default function EditarDocumentoPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = useParams();

  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    autor: "",
    archivo: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {

    const cargarDocumento = async () => {

      try {

        const data = await getDocumentById(id);

        setForm({
          nombre: data.nombre,
          autor: data.autor,
          categoria: data.categoria,
        });

      } catch (error) {

        console.error("Error cargando documento", error);

      }

    };

    cargarDocumento();

  }, [id]);

  const handleChange = (field, value) => {

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {

      await updateDocument(id, form);
      alert("Documento actualizado");
      navigate("/dashboard/documents");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar");
    }

  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={4}>
          Editar Documento
        </Typography>

        <Grid container sx={{ pt: 2 }} spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Nombre del documento"
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={form.categoria}
                label="Categoría"
                onChange={(e) =>
                  handleChange("categoria", e.target.value)
                }
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Autor"
              value={form.autor}
              onChange={(e) => handleChange("autor", e.target.value)}
            />
          </Grid>

          {/* Upload */}
          <Grid size={{ xs: 12 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Reemplazar Archivo
              <input
                type="file"
                onChange={(e) =>
                  handleChange(
                    "archivo",
                    e.target.files[0]
                  )
                }
              />
            </Button>

            {form.archivo && (
              <Typography mt={1} variant="body2">
                Archivo seleccionado: {form.archivo.name}
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/documents")}
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#6a1936",
                }}
              >
                Guardar Cambios
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}