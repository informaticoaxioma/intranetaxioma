"use client"

import type React from "react"

import { useState } from "react"
import Button from '@mui/material/Button';
import Input  from "@mui/material/Input";
import Label from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Lock from "@mui/icons-material/Lock";
import IconButton from "@mui/material/IconButton";
import Mail from "@mui/icons-material/Mail";
import Business from "@mui/icons-material/Business";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useRouter } from "next/navigation";



export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simular login
    await new Promise((res) => setTimeout(res, 1500));

    router.push("/dashboard");
    setIsLoading(false)
  }
  const handleToggle = () => setShowPassword(prev => !prev);

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/20" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-card/10 backdrop-blur flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-card/10 backdrop-blur flex items-center justify-center">
                    <Business className="w-7 h-7" />
                </div>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Axioma</h2>
              <p className="text-sm text-primary-foreground/70">Ingenieros y Consultores S.A.</p>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight text-balance">
              Bienvenido a nuestra Intranet Corporativa de Axioma
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-md leading-relaxed">
              Accede a todos los recursos, herramientas y comunicaciones de la empresa desde un solo lugar.
            </p>
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-primary-foreground/70">Empleados</p>
              </div>
              <div>
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-sm text-primary-foreground/70">Disponibilidad</p>
              </div>
              <div>
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-primary-foreground/70">Seguro</p>
              </div>
            </div>
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
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                 <Business className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Axioma</h2>
              <p className="text-sm text-muted-foreground">Ingenieros y Consultores S.A.</p>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-foreground">Iniciar Sesión</h1>
            <p className="mt-2 text-muted-foreground">Ingresa tus credenciales para acceder a la intranet</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Correo Electrónico
              </Label>
              <div className="relative">
                <TextField
                id="email"
                fullWidth
                required
                placeholder="Correo Electrónico"
                variant="outlined"
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <MailOutlineIcon />
                    </InputAdornment>
                    ),
                }}
                sx={{
                    "& .MuiOutlinedInput-root": {
                    borderRadius: "8px", // bordes redondeados
                    backgroundColor: "lab(95.3886% .58049 3.77289)", // color de fondo similar a tu imagen
                    "& fieldset": {
                        borderColor: "#gray", // borde normal
                    },
                    "&:hover fieldset": {
                        borderColor: "#70363a", // borde al hover
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#70363a", // borde al foco
                    },
                    },
                }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Contraseña
              </Label>
              <div className="relative">
                <TextField
                  fullWidth
                  id="password"
                  required
                  placeholder="••••••••"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleToggle} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      backgroundColor: "lab(95.3886% .58049 3.77289)",
                      color: "#000",
                      "& fieldset": {
                        borderColor: "#gray",
                      },
                      "&:hover fieldset": {
                        borderColor: "#8a3e40",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#70363a",
                      },
                    },
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <VisibilityOff className="w-5 h-5" /> : <Visibility className="w-5 h-5" />}
                </button>
                
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onChange={(event, checked) => setRememberMe(checked)}
                sx={{
                  color: "#70363a",
                  "&.Mui-checked": {
                    color: "#70363a",
                  },
                }}
              />

              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-700"
              >
                Recuérdame
              </label>
              </div>
              <a href="/auth/forgot-password" className="text-sm text-primary hover:text-accent transition-colors font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <Button
              type="submit"
              className="
                w-full h-12
                bg-primary text-primary-foreground
                hover:bg-accent
                font-semibold text-base
                transition-colors duration-200
                
              "
              sx={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                fontWeight: 400,
                fontSize: "1rem", // text-base
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "var(--accent)",
                },
              }}

              disabled={isLoading}
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
                Ingresando...
              </div>
              ) : (
                "Ingresar"
              )}
            </Button>


          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-4 text-muted-foreground">¿Necesitas ayuda?</span>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">Contacta al departamento de TI para soporte técnico</p>
            <a
              href="mailto:informatico.inc@axioma.cl"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors font-medium"
            >
              informatico.inc@axioma.cl
            </a>
          </div>

          <p className="lg:hidden text-center text-xs text-muted-foreground pt-4">
            © 2026 Axioma Ingenieros y Consultores S.A. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
