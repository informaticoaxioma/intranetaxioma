import { useState, useEffect, useRef } from "react";
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
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";

import { createDocument, getUsers } from "../../services/api";

const categorias = [
  "Recursos Humanos",
  "Finanzas",
  "Corporativo",
  "Formación",
  "Legal",
  "Tecnología",
];

export default function CreateDocumentsPage() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);

    const [form, setForm] = useState({
        categoria: "",
        user_id: "",
        periodo: "",
        archivo: null,
        });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const periodRef = useRef(null);

    const handleChange = (field, value) => {
            setForm({ ...form, [field]: value });
        };

    useEffect(() => {
    const cargarUsuarios = async () => {
        try {
        const data = await getUsers();
        setUsuarios(data);
        } catch (error) {
        console.error(error);
        }
    };

    cargarUsuarios();
    }, []);

    const handleSave = async () => {

        try {

            const response =
                await createDocument(
                    form
                );

            console.log(response);

            setSnackbar({
                open: true,
                message:
                    "Documento creado correctamente",
                severity: "success",
            });

        } catch (error) {

            console.error(error);

            setSnackbar({
                open: true,
                message:
                    error.message,
                severity: "error",
            });
        }
    };
  
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} sx={{ paddingBottom: 3 }}>
          Subir Liquidación
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12}}>
            <TextField
              fullWidth
              label="Nombre del documento"
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
          </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
                <Autocomplete
                    options={usuarios}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, value) =>
                    handleChange("user_id", value?.id || "")
                    }
                    renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Trabajador"
                        fullWidth
                    />
                    )}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
            <TextField
                fullWidth
                label="Período"
                type="month"
                value={form.periodo}
                inputRef={periodRef}
                onClick={() => periodRef.current?.showPicker()}
                onChange={(e) => handleChange("periodo", e.target.value)}
                InputLabelProps={{
                shrink: true,
                }}
            />
            </Grid>

          {/* Upload */}
          <Grid size={{ xs: 12}}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Adjuntar archivo
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

          <Grid size={{ xs: 12}}>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/payrolls")}
              >
                Cancelar
              </Button>

              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#6a1936",
                }}
              >
                Crear Liquidación
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}