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
import { useNavigate, useSearchParams } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";

import { createLaborDocument, getUsers } from "../../services/api";

const tiposDocumento = [
    "Contrato de Trabajo",
    "Anexo de Contrato",
    "Certificado Laboral",
    "Certificado de Salud",
    "Finiquito",
    "Ficha trabajador",
    "Otro",
];

export default function CreateLaborDocumentPage() {
    const navigate = useNavigate();
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

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const [searchParams] = useSearchParams();
    const queryUserId = searchParams.get("user_id");

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const data = await getUsers();
                setUsuarios(data);
                if (queryUserId) {
                    setForm(prev => ({ ...prev, user_id: queryUserId }));
                }
            } catch (error) {
                console.error(error);
            }
        };

        cargarUsuarios();
    }, [queryUserId]);

    const handleSave = async () => {
        try {
            if (!form.user_id) {
                throw new Error("El trabajador es requerido");
            }
            if (!form.tipo_documento) {
                throw new Error("El tipo de documento es requerido");
            }
            if (!form.archivo) {
                throw new Error("El archivo es requerido");
            }

            await createLaborDocument(form);

            setSnackbar({
                open: true,
                message: "Documento laboral creado correctamente",
                severity: "success",
            });

            setTimeout(() => {
                navigate("/dashboard/labor-documents");
            }, 1000);

        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message: error.message || "Error al crear documento laboral",
                severity: "error",
            });
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
            <Paper sx={{ p: 4, borderRadius: 4 }}>
                <Typography variant="h5" fontWeight="bold" mb={3} sx={{ paddingBottom: 3 }}>
                    Crear Documento Laboral
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Autocomplete
                            options={usuarios}
                            value={usuarios.find(u => String(u.id) === String(form.user_id)) || null}
                            getOptionLabel={(option) => `${option.name || ""} ${option.apellido || ""}`.trim()}
                            filterOptions={(options, state) => {
                                const query = state.inputValue.toLowerCase();
                                return options.filter((option) => {
                                    const fullName = `${option.name || ""} ${option.apellido || ""}`.toLowerCase();
                                    const rut = (option.rut || "").toLowerCase();
                                    return fullName.includes(query) || rut.includes(query);
                                });
                            }}
                            renderOption={(props, option) => {
                                const { key, ...restProps } = props;
                                return (
                                    <li key={key} {...restProps}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {option.name} {option.apellido}
                                            </Typography>
                                            {option.rut && (
                                                <Typography variant="body2" sx={{ color: "#722F37", fontWeight: 600 }}>
                                                    {option.rut}
                                                </Typography>
                                            )}
                                        </Box>
                                    </li>
                                );
                            }}
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
                            Adjuntar archivo *
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
                                onClick={handleSave}
                                sx={{
                                    textTransform: "none",
                                    backgroundColor: "#6a1936",
                                    "&:hover": {
                                        backgroundColor: "#4a1025",
                                    }
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
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}