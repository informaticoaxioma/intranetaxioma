"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogContent,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;

    setLoading(true);

    // mock backend
    await new Promise((res) => setTimeout(res, 1000));

    setLoading(false);
    setOpenSuccess(true);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          px: 2,
        }}
      >
        <Card sx={{ maxWidth: 420, width: "100%", borderRadius: 4, p: 2 }}>
          <CardContent>
            <Stack spacing={3} alignItems="center" textAlign="center">

              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: "rgba(106, 25, 54, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <EmailIcon sx={{ color: "#6a1936", fontSize: 30 }} />
              </Box>

              <Typography variant="h5" fontWeight="bold">
                Recuperar contraseña
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Ingresa tu correo para recibir el enlace de recuperación.
              </Typography>

              <TextField
                label="Correo electrónico"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#6a1936",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#4a1025" },
                }}
              >
                {loading ? "Enviando..." : "Enviar enlace"}
              </Button>

            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Modal éxito */}
      <Dialog open={openSuccess} onClose={() => setOpenSuccess(false)}>
        <DialogContent>
          <Stack spacing={3} alignItems="center" textAlign="center" sx={{ py: 2 }}>
            <CheckCircleIcon sx={{ color: "green", fontSize: 50 }} />
            <Typography variant="h6" fontWeight="bold">
              Correo enviado
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Revisa tu bandeja para continuar con el proceso.
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}