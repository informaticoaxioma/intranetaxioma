import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#7b1e3f", // Burdeo corporativo
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e4d3dd",
    },
  },
  shape: {
    borderRadius: 8,
  },
});
