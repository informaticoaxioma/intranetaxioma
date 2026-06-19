import { useState, useEffect } from "react";
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

import { createDocument } from "../../services/api";

const categorias = [
    "Politicas y Normativas",
    "Contabilidad y RRHH",
    "Finanzas",
    "Corporativo",
    "Formación",
    "Legal",
    "Tecnología",
];

export default function CreateDocumentsPage() {
    const navigate = useNavigate();

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

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

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
                    Crear Documento
                </Typography>

                <Grid container spacing={3}>
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

                    <Grid size={{ xs: 12 }}>
                        <Stack direction="row" justifyContent="flex-end" spacing={2}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/dashboard/documents")}
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
    );
}