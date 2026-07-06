import { useState, useEffect, useRef } from "react";
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
import Autocomplete from "@mui/material/Autocomplete";

import { getLaborDocumentById, updateLaborDocument, getUsers } from "../../services/api";

const tiposDocumento = [
    "Contrato de Trabajo",
    "Anexo de Contrato",
    "Certificado Laboral",
    "Certificado de Salud",
    "Finiquito",
    "Ficha Trabajador",
    "Otro",
];

export default function EditLaborDocumentPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [usuarios, setUsuarios] = useState([]);

    const [form, setForm] = useState({
        user_id: "",
        tipo_documento: "",
        fecha_emision: "",
        fecha_vencimiento: "",
        observaciones: "",
        archivo: null,
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const emisionRef = useRef(null);
    const vencimientoRef = useRef(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const usersList = await getUsers();
                setUsuarios(usersList);

                const docData = await getLaborDocumentById(id);
                setForm({
                    user_id: docData.user_id || "",
                    tipo_documento: docData.tipo_documento || "",
                    fecha_emision: docData.fecha_emision || "",
                    fecha_vencimiento: docData.fecha_vencimiento || "",
                    observaciones: docData.observaciones || "",
                    archivo: null,
                });
            } catch (error) {
                console.error("Error al cargar datos del documento laboral", error);
                setSnackbar({
                    open: true,
                    message: "Error al cargar los datos del documento",
                    severity: "error",
                });
            }
        };

        cargarDatos();
    }, [id]);

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!form.user_id) {
                throw new Error("El trabajador es requerido");
            }
            if (!form.tipo_documento) {
                throw new Error("El tipo de documento es requerido");
            }

            await updateLaborDocument(id, form);

            setSnackbar({
                open: true,
                message: "Documento laboral actualizado correctamente",
                severity: "success",
            });

            setTimeout(() => {
                navigate("/dashboard/labor-documents");
            }, 1000);
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message: error.message || "Error al actualizar documento laboral",
                severity: "error",
            });
        }
    };

    // Find active user from list
    const selectedUser = usuarios.find((u) => u.id === form.user_id) || null;

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
            <Paper sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h5" fontWeight="bold" mb={4}>
                    Editar Documento Laboral
                </Typography>

                <Grid container sx={{ pt: 2 }} spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Autocomplete
                            options={usuarios}
                            getOptionLabel={(option) => option.name || ""}
                            value={selectedUser}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(event, value) =>
                                handleChange("user_id", value?.id || "")
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Trabajador"
                                    fullWidth
                                    required
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel>Tipo de Documento</InputLabel>
                            <Select
                                value={form.tipo_documento}
                                label="Tipo de Documento"
                                onChange={(e) =>
                                    handleChange("tipo_documento", e.target.value)
                                }
                            >
                                {tiposDocumento.map((tipo) => (
                                    <MenuItem key={tipo} value={tipo}>
                                        {tipo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Fecha de Emisión"
                            type="date"
                            value={form.fecha_emision}
                            slotProps={{ inputLabel: { shrink: true } }}
                            inputRef={emisionRef}
                            onClick={() => emisionRef.current?.showPicker()}
                            onChange={(e) => handleChange("fecha_emision", e.target.value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Fecha de Vencimiento"
                            type="date"
                            value={form.fecha_vencimiento}
                            slotProps={{ inputLabel: { shrink: true } }}
                            inputRef={vencimientoRef}
                            onClick={() => vencimientoRef.current?.showPicker()}
                            onChange={(e) => handleChange("fecha_vencimiento", e.target.value)}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Observaciones"
                            multiline
                            rows={3}
                            value={form.observaciones}
                            onChange={(e) => handleChange("observaciones", e.target.value)}
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
                                hidden
                                onChange={(e) =>
                                    handleChange("archivo", e.target.files[0])
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
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/dashboard/labor-documents")}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{
                                    textTransform: "none",
                                    backgroundColor: "#6a1936",
                                    "&:hover": {
                                        backgroundColor: "#4a1025",
                                    }
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
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}