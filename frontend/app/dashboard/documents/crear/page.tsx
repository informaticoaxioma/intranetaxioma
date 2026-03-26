"use client";

import { useEffect, useState } from "react";
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
import Grid from "@mui/material/GridLegacy";
import { MuiProvider } from "@/app/components/mui-provider";
import { useRouter } from "next/navigation";

const categorias = [
  "Recursos Humanos",
  "Finanzas",
  "Corporativo",
  "Formación",
  "Legal",
  "Tecnología",
  "Liquidacion",
];



export default function CrearDocumentoPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    autor: "",
    archivo: null as File | null,
    user_id: "",
  });

const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
  // Simulación de carga
  setUsuarios([
    { id: "1", name: "Juan Gomez" },
    { id: "2", name: "Carolina Perez" },
    { id: "3", name: "Cristobal Nuñez" },
  ]);
}, []);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!form.nombre || !form.categoria || !form.autor || !form.archivo) {
      setSnackbar({
        open: true,
        message: "Completa todos los campos",
        severity: "error",
      });
      return;
    }

    console.log("Documento creado:", form);

    setSnackbar({
      open: true,
      message: "Documento creado correctamente",
      severity: "success",
    });

    setTimeout(() => {
      router.push("/dashboard/documents");
    }, 1500);
  };
  
  return (
    <MuiProvider>   
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Crear Documento
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre del documento"
              value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
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

          {form.categoria === "Liquidacion" && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Seleccionar Usuario</InputLabel>
                <Select
                  value={form.user_id}
                  label="Seleccionar Usuario"
                  onChange={(e) =>
                    handleChange("user_id", e.target.value)
                  }
                >
                  {usuarios.map((user: any) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {form.categoria != "Liquidacion" && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Autor"
                value={form.autor}
                onChange={(e) => handleChange("autor", e.target.value)}
              />
            </Grid>
          )}


          {/* Upload */}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Adjuntar archivo
              <input
                type="file"
                hidden
                onChange={(e) =>
                  handleChange("archivo", e.target.files?.[0])
                }
              />
            </Button>

            {form.archivo && (
              <Typography mt={1} variant="body2">
                Archivo seleccionado: {form.archivo.name}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => router.push("/dashboard/documents")}
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
                Crear Documento
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
    </MuiProvider>
  );
}