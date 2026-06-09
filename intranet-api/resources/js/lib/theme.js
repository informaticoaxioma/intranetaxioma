import { createTheme } from "@mui/material/styles";

// Paleta corporativa Axioma
export const muiTheme = createTheme({

    palette: {

        primary: {

            main: "#722F37",

            dark: "#4A1C23",

            light: "#8B4049",

            contrastText: "#FFFFFF",
        },

        secondary: {

            main: "#E8E0D5",

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

            gold: "#b79c51",
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

        button: {

            fontWeight: 500,
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

                    borderRadius: 10,

                    paddingTop: 10,

                    paddingBottom: 10,
                },
            },
        },

        MuiCard: {

            styleOverrides: {

                root: {

                    borderRadius: 14,

                    boxShadow:
                        "0 2px 8px rgba(74, 28, 35, 0.08)",
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

        MuiTextField: {

            defaultProps: {

                variant: "outlined",

                fullWidth: true,
            },
        },

        MuiOutlinedInput: {

            styleOverrides: {

                root: {

                    borderRadius: 10,

                    backgroundColor: "#FFFFFF",

                    "& fieldset": {

                        borderColor: "#D4C9BA",
                    },

                    "&:hover fieldset": {

                        borderColor: "#722F37",
                    },

                    "&.Mui-focused fieldset": {

                        borderColor: "#722F37",
                    },
                },
            },
        },

        MuiCheckbox: {

            styleOverrides: {

                root: {

                    color: "#722F37",

                    "&.Mui-checked": {

                        color: "#722F37",
                    },
                },
            },
        },

        MuiAppBar: {

            styleOverrides: {

                root: {

                    backgroundColor: "#722F37",
                },
            },
        },

        MuiDrawer: {

            styleOverrides: {

                paper: {

                    backgroundColor: "#4A1C23",

                    color: "#FFFFFF",
                },
            },
        },
    },
});
