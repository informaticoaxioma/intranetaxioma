"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
import LockResetIcon from "@mui/icons-material/LockReset";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!password || password !== confirm) return;

    console.log({ token, password });

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
                <LockResetIcon sx={{ color: "#6a1936", fontSize: 30 }} />
              </Box>

              <Typography variant="h5" fontWeight="bold">
                Nueva contraseña
              </Typography>

              <TextField
                label="Nueva contraseña"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <TextField
                label="Confirmar contraseña"
                type="password"
                fullWidth
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#6a1936",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#4a1025" },
                }}
              >
                Cambiar contraseña
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
              Contraseña actualizada
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ya puedes iniciar sesión con tu nueva contraseña.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              href="/auth/login"
              sx={{
                textTransform: "none",
                backgroundColor: "#6a1936",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#4a1025" },
              }}
            >
              Ir al login
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}