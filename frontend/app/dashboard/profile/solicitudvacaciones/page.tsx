"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { MuiProvider } from "@/app/components/mui-provider"
import Grid from "@mui/material/GridLegacy";

export default function SolicitudVacacionesPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    dias: 0,
  });

  // calcular días automáticamente
  const calcularDias = (inicio: string, fin: string) => {
    if (!inicio || !fin) return 0;

    const start = new Date(inicio);
    const end = new Date(fin);

    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

    return diff > 0 ? diff : 0;
  };

  const handleChange = (field: string, value: string) => {
    const updated = {
      ...form,
      [field]: value,
    };

    // recalcular días si cambian fechas
    if (field === "fecha_inicio" || field === "fecha_fin") {
      updated.dias = calcularDias(
        field === "fecha_inicio" ? value : form.fecha_inicio,
        field === "fecha_fin" ? value : form.fecha_fin
      );
    }

    setForm(updated);
  };

  const handleSubmit = () => {
    if (!form.fecha_inicio || !form.fecha_fin) {
      alert("Debes completar las fechas");
      return;
    }

    if (form.dias <= 0) {
      alert("Rango de fechas inválido");
      return;
    }

    console.log("Solicitud enviada:", form);

    // aquí puedes hacer POST a Laravel

    router.push("/dashboard/profile");
  };

  return (
    <MuiProvider>
        <Box p={2}>
        <Card>
            <CardHeader
            title={
                <Typography variant="h6" fontWeight="bold">
                Solicitud de Vacaciones
                </Typography>
            }
            subheader="Completa la información para solicitar vacaciones"
            />

            <CardContent>
            <Grid container spacing={2}>
                
                {/* Fecha inicio */}
                <Grid item xs={12} md={6}>
                <TextField
                    label="Fecha de salida"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={form.fecha_inicio}
                    onChange={(e) =>
                    handleChange("fecha_inicio", e.target.value)
                    }
                />
                </Grid>

                {/* Fecha fin */}
                <Grid item xs={12} md={6}>
                <TextField
                    label="Fecha de retorno"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={form.fecha_fin}
                    onChange={(e) =>
                    handleChange("fecha_fin", e.target.value)
                    }
                />
                </Grid>

                {/* Días calculados */}
                <Grid item xs={12}>
                <TextField
                    label="Días solicitados"
                    fullWidth
                    value={form.dias}
                    disabled
                />
                </Grid>

                {/* Botones */}
                <Grid item xs={12} display="flex" gap={2}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                    textTransform: "none",
                    backgroundColor: "#6a1936",
                    fontWeight: "600",
                    "&:hover": {
                        backgroundColor: "#4a1025",
                    },
                    }}
                >
                    Enviar solicitud
                </Button>

                <Button
                    variant="outlined"
                    onClick={() => router.back()}
                >
                    Cancelar
                </Button>
                </Grid>
            </Grid>
            </CardContent>
        </Card>
        </Box>
    </MuiProvider>
  );
}