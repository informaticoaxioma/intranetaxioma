import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { muiTheme } from "./lib/theme";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./hooks/AuthContext";


export default function App() {

    return (
    <AuthProvider>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </AuthProvider>
    );
}