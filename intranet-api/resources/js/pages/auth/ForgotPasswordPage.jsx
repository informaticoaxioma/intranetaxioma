import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Mail from "@mui/icons-material/Mail";
import ArrowBack from "@mui/icons-material/ArrowBack";
import CheckCircle from "@mui/icons-material/CheckCircle";

import { forgotPassword } from "../../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Ocurrió un error. Por favor intenta más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/20" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 overflow-hidden rounded-xl bg-white flex items-center justify-center">
              <img src="/imagenes/logoAxioma.jpg" alt="Logo Axioma" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Axioma</h2>
              <p className="text-sm text-primary-foreground/70">Ingenieros y Consultores S.A.</p>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-balance">
              Recupera el acceso a tu cuenta
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-md leading-relaxed">
              Te enviaremos un enlace seguro a tu correo corporativo para que puedas restablecer tu contraseña.
            </p>
          </div>

          <p className="text-sm text-primary-foreground/60">
            © 2026 Axioma Ingenieros y Consultores S.A. Todos los derechos reservados.
          </p>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-card/5" />
        <div className="absolute top-1/4 -right-16 w-64 h-64 rounded-full bg-card/5" />
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-card">
        <div className="w-full max-w-md space-y-8">
          {/* Logo móvil */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 overflow-hidden rounded-xl bg-white flex items-center justify-center">
              <img src="/imagenes/logoAxioma.jpg" alt="Logo Axioma" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Axioma</h2>
              <p className="text-sm text-muted-foreground">Ingenieros y Consultores S.A.</p>
            </div>
          </div>

          {submitted ? (
            /* Estado de éxito */
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "color-mix(in srgb, var(--primary) 15%, transparent)" }}>
                  <CheckCircle style={{ fontSize: 48, color: "var(--primary)" }} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">¡Correo enviado!</h1>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Si el correo <strong className="text-foreground">{email}</strong> está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                </p>
              </div>
              <div
                className="rounded-xl p-4 text-sm text-left"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)"
                }}
              >
                <p className="font-semibold text-foreground mb-1">¿No recibiste el correo?</p>
                <p className="text-muted-foreground">
                  Revisa tu carpeta de spam o correo no deseado. El enlace expira en <strong>60 minutos</strong>.
                </p>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: "var(--primary)" }}
              >
                <ArrowBack fontSize="small" />
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            /* Formulario de ingreso de email */
            <>
              <div className="text-center lg:text-left">
                <h1 className="text-2xl font-bold text-foreground">¿Olvidaste tu contraseña?</h1>
                <p className="mt-2 text-muted-foreground">
                  Ingresa tu correo corporativo y te enviaremos un enlace para restablecerla.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <FormLabel htmlFor="email" className="text-foreground">
                    Correo Electrónico
                  </FormLabel>
                  <TextField
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    placeholder="tucorreo@axioma.cl"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <Mail sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "lab(95.3886% .58049 3.77289)",
                        "& fieldset": { borderColor: "#gray" },
                        "&:hover fieldset": { borderColor: "#70363a" },
                        "&.Mui-focused fieldset": { borderColor: "#70363a" },
                      },
                    }}
                  />
                </div>

                {error && (
                  <div
                    className="rounded-lg p-3 text-sm"
                    style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c"
                    }}
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    height: "48px",
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: "8px",
                    transition: "background-color 0.2s ease",
                    "&:hover": { backgroundColor: "var(--accent)" },
                    "&.Mui-disabled": { opacity: 0.7 },
                  }}
                >
                  {isLoading ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary-foreground)" }}>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: "2px solid rgba(255,255,255,.30)",
                          borderTopColor: "var(--primary-foreground)",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Enviando...
                    </div>
                  ) : (
                    "Enviar enlace de recuperación"
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{ color: "var(--primary)" }}
                  >
                    <ArrowBack fontSize="small" />
                    Volver al inicio de sesión
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
