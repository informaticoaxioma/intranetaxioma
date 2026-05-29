import React from "react";

import ReactDOM from "react-dom/client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { muiTheme } from "./lib/theme";
import AppRouter from "./router/AppRouter";

function App() {

    return (
        <ThemeProvider theme={muiTheme}> 
            <CssBaseline />
            <AppRouter />
        </ThemeProvider>  
    );
}

ReactDOM.createRoot(
    document.getElementById("app")
).render(<App />);