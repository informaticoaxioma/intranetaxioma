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
import { useNavigate, useParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";

import { updatePayroll, getPayrolltById, getUsers } from "../../services/api";

export default function EditPayrollPage() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const { id } = useParams();
    

    const [form, setForm] = useState({
        titulo: "",
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
        const cargarLiquidacion = async () => {

            try {

            const data = await getPayrolltById(id);

            setForm({
                titulo: data.titulo,
                user_id: data.user_id,
                    periodo: data.periodo
        ? data.periodo.substring(0, 7)
        : "",
            });

            } catch (error) {

            console.error("Error cargando documento", error);

            }

    };

    cargarLiquidacion();

    }, [id]);

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

    const handleSubmit = async () => {
    try {

        await updatePayroll(id, form);
        alert("Liquidación actualizada");
        navigate("/dashboard/payrolls");
        } catch (error) {
            console.error(error);
            alert("Error al actualizar");
        }

    };

  
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} sx={{ paddingBottom: 3 }}>
          Actualizar Liquidación
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12}}>
            <TextField
              fullWidth
              label="Titulo de la Liquidación"
              value={form.titulo}
              onChange={(e) => handleChange("titulo", e.target.value)}
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
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard/payrolls")}
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
                Actualizar Liquidación
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