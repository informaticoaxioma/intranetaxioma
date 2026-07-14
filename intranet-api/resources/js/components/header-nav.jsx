import React, { useState, useEffect } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";

export function HeaderNav({ onMenuClick }) {

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [anchorUser, setAnchorUser] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | RESPONSIVE
    |--------------------------------------------------------------------------
    */

    const theme = useTheme();

    const isMobile = useMediaQuery(
        theme.breakpoints.down("sm")
    );

    const isTablet = useMediaQuery(
        theme.breakpoints.down("md")
    );

    /*
    |--------------------------------------------------------------------------
    | NAVIGATION
    |--------------------------------------------------------------------------
    */

    const navigate = useNavigate();

    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");
    };

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */
    const { user } = useAuth();

    return (

        <AppBar
            position="static"
            elevation={0}
            sx={{
                backgroundColor: "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
            }}
        >

            <Toolbar
                sx={{
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                {/* BURGER MENU FOR MOBILE */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 1, display: { md: "none" }, color: "text.primary" }}
                >
                    <MenuIcon />
                </IconButton>

                {/* SEARCH */}

                {
                    !isMobile && (

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                width: isTablet ? 250 : 380,
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                backgroundColor: "action.hover",
                                gap: 1,
                            }}
                        >
                            <SearchIcon
                                fontSize="small"
                                sx={{
                                    opacity: 0.7,
                                }}
                            />

                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                }}
                            >
                                Busca la información que necesites en tu intranet
                            </Typography>
                        </Box>
                    )
                }

                {/* RIGHT SECTION */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >

                    {/* MOBILE SEARCH */}

                    {
                        isMobile && (

                            <IconButton>

                                <SearchIcon />

                            </IconButton>
                        )
                    }

                    {/* USER PROFILE */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            cursor: "pointer",
                        }}
                        onClick={(e) =>
                            setAnchorUser(
                                e.currentTarget
                            )
                        }
                    >

                        <Avatar
                            src={
                                user?.path_foto_perfil
                                    ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/storage/${user.path_foto_perfil}`
                                    : undefined
                            }
                            sx={{
                                width: 32,
                                height: 32,
                                backgroundColor: "#7b1e3f",
                            }}
                        >
                            {`${user?.name?.[0] || ""}${user?.apellido?.[0] || ""}`.toUpperCase() || "U"}
                        </Avatar>

                        {
                            !isMobile && (

                                <Box
                                    display="flex"
                                >

                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "text.primary",
                                        }}
                                    >
                                        {user ? `${user.name} ${user.apellido}` : "Invitado"}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            color: "text.secondary",
                                        }}
                                    >
                                        {user ? user.cargo : "Visitante"}
                                    </Typography>

                                </Box>
                            )
                        }

                        {
                            !isMobile && (

                                <KeyboardArrowDownIcon
                                    fontSize="small"
                                />
                            )
                        }

                    </Box>

                    {/* USER MENU */}

                    <Menu
                        anchorEl={anchorUser}
                        open={Boolean(anchorUser)}
                        onClose={() =>
                            setAnchorUser(null)
                        }
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                    >

                        <Typography
                            variant="body2"
                            sx={{
                                px: 2,
                                py: 1,
                                fontWeight: 600,
                            }}
                        >
                            Mi Cuenta
                        </Typography>

                        <Divider />

                        {user ? (
                            <>
                                <MenuItem
                                    onClick={() => {
                                        navigate("/dashboard/profile");
                                        setAnchorUser(null);
                                    }}
                                >
                                    Ver Perfil
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                    Cerrar Sesión
                                </MenuItem>
                            </>
                        ) : (
                            <MenuItem
                                onClick={() => {
                                    navigate("/");
                                    setAnchorUser(null);
                                }}
                            >
                                Iniciar Sesión
                            </MenuItem>
                        )}

                    </Menu>

                </Box>

            </Toolbar>

        </AppBar>
    );
}
