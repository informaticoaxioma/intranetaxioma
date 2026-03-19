"use client"

import { createTheme } from "@mui/material/styles"

// Paleta de colores: burdeo, burdeo oscuro, beige y blanco
export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#722F37", // burdeo
      dark: "#4A1C23", // burdeo oscuro
      light: "#8B4049",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E8E0D5", // beige
      dark: "#D4C9BA",
      light: "#F5F1EB",
      contrastText: "#4A1C23",
    },
    background: {
      default: "#F5F1EB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#4A1C23",
      secondary: "#722F37",
    },
  },
  typography: {
    fontFamily: "Geist, sans-serif",
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(74, 28, 35, 0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
})
