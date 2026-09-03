import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Lock from "@mui/icons-material/Lock";
import ArrowBack from "@mui/icons-material/ArrowBack";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ErrorOutlined from "@mui/icons-material/ErrorOutlined";

import { resetPassword } from "../../services/api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Redirect to login after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Guard: if no token or email in URL, show invalid link state
  const isValidLink = token && email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden. Por favor verifica e intenta de nuevo.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Ocurrió un error. El enlace puede haber expirado. Solicita uno nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "lab(95.3886% .58049 3.77289)",
      "& fieldset": { borderColor: "#gray" },
      "&:hover fieldset": { borderColor: "#70363a" },
      "&.Mui-focused fieldset": { borderColor: "#70363a" },
    },
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
              Crea tu nueva contraseña
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-md leading-relaxed">
              Elige una contraseña segura para proteger el acceso a tu cuenta en la Intranet Axioma.
            </p>
          </div>

          <p className="text-sm text-primary-foreground/60">
            © 2026 Axioma Ingenieros y Consultores S.A. Todos los derechos reservados.
          </p>
        </div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-card/5" />
        <div className="absolute top-1/4 -right-16 w-64 h-64 rounded-full bg-card/5" />
      </div>

      {/* Panel derecho */}
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

          {/* Enlace inválido */}
          {!isValidLink && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-red-50">
                  <ErrorOutlined style={{ fontSize: 48, color: "#b91c1c" }} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Enlace inválido</h1>
                <p className="mt-2 text-muted-foreground">
                  Este enlace de recuperación no es válido o ha expirado. Solicita uno nuevo desde la página de inicio de sesión.
                </p>
              </div>
              <Link
                to="/auth/forgot-password"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: "var(--primary)" }}
              >
                Solicitar nuevo enlace
              </Link>
            </div>
          )}

          {/* Éxito */}
          {isValidLink && success && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "color-mix(in srgb, var(--primary) 15%, transparent)" }}
                >
                  <CheckCircle style={{ fontSize: 48, color: "var(--primary)" }} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">¡Contraseña actualizada!</h1>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Tu contraseña ha sido restablecida correctamente. Serás redirigido al inicio de sesión en unos segundos...
                </p>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: "var(--primary)" }}
              >
                <ArrowBack fontSize="small" />
                Ir al inicio de sesión ahora
              </Link>
            </div>
          )}

          {/* Formulario */}
          {isValidLink && !success && (
            <>
              <div className="text-center lg:text-left">
                <h1 className="text-2xl font-bold text-foreground">Nueva contraseña</h1>
                <p className="mt-2 text-muted-foreground">
                  Crea una nueva contraseña para tu cuenta <strong className="text-foreground">{email}</strong>.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nueva contraseña */}
                <div className="space-y-2">
                  <FormLabel htmlFor="password" className="text-foreground">
                    Nueva Contraseña
                  </FormLabel>
                  <div className="relative">
                    <TextField
                      id="password"
                      fullWidth
                      required
                      placeholder="Mínimo 6 caracteres"
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        startAdornment: <Lock sx={{ mr: 1, color: "text.secondary" }} />,
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                      sx={textFieldSx}
                    />
                  </div>
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-2">
                  <FormLabel htmlFor="password_confirmation" className="text-foreground">
                    Confirmar Nueva Contraseña
                  </FormLabel>
                  <div className="relative">
                    <TextField
                      id="password_confirmation"
                      fullWidth
                      required
                      placeholder="Repite la contraseña"
                      variant="outlined"
                      type={showPasswordConfirmation ? "text" : "password"}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      InputProps={{
                        startAdornment: <Lock sx={{ mr: 1, color: "text.secondary" }} />,
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            edge="end"
                            size="small"
                            aria-label={showPasswordConfirmation ? "Ocultar contraseña" : "Mostrar contraseña"}
                          >
                            {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                      sx={textFieldSx}
                    />
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div
                    className="rounded-lg p-3 text-sm"
                    style={{
                      backgroundColor: "#fef2f2",
                      border: "1px solid #fecaca",
                      color: "#b91c1c",
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
                      Guardando...
                    </div>
                  ) : (
                    "Guardar nueva contraseña"
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
