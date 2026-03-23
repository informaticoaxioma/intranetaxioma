"use client"

import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications"
import SearchIcon from "@mui/icons-material/Search"
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import InputBase from "@mui/material/InputBase";

import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"

import Link from "next/link"

export function HeaderNav() {
    const [anchorNotif, setAnchorNotif] = useState<null | HTMLElement>(null);
    const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

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
      <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>

        {/* SEARCH AREA */}
        {!isMobile && (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              width: isTablet ? 250 : 380,
              px: 2,
              py: 0.5,
              borderRadius: 2,
              backgroundColor: "action.hover",
            }}
          >
            <SearchIcon
              fontSize="small"
              sx={{
                position: "absolute",
                left: 8,
                opacity: 0.7,
              }}
            />
            
            <InputBase
              placeholder="Buscar en la intranet…"
              sx={{
                ml: 4,
                width: "100%",
                fontSize: 14,
              }}
            />
          </Box>
        )}

        {/* RIGHT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {/* Search Icon only mobile */}
          {isMobile && (
            <IconButton>
              <SearchIcon />
            </IconButton>
          )}

          {/* Notifications */}
          <Tooltip title="Notificaciones">
            <IconButton
              onClick={(e) => setAnchorNotif(e.currentTarget)}
              size="large"
            >
            <Badge
              badgeContent={3}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#7b1e3f", // BURDEO
                  color: "white",
                },
              }}
            >
              <NotificationsIcon />
            </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorNotif}
            open={Boolean(anchorNotif)}
            onClose={() => setAnchorNotif(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Typography variant="body2" sx={{ px: 2, py: 1, fontWeight: 600 }}>
              Notificaciones
            </Typography>
            <Divider />

            <MenuItem sx={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Typography variant="body2">Nueva política de vacaciones</Typography>
              <Typography variant="caption" color="text.secondary">Hace 2 horas</Typography>
            </MenuItem>

            <MenuItem sx={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Typography variant="body2">Reunión de equipo programada</Typography>
              <Typography variant="caption" color="text.secondary">Hace 5 horas</Typography>
            </MenuItem>

            <MenuItem sx={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Typography variant="body2">Documento pendiente de revisión</Typography>
              <Typography variant="caption" color="text.secondary">Ayer</Typography>
            </MenuItem>
          </Menu>

          {/* User / Profile */}
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.2, cursor: "pointer" }}
            onClick={(e) => setAnchorUser(e.currentTarget)}
          >
            <Avatar sx={{ width: 32, height: 32, backgroundColor: "#7b1e3f" }}>JD</Avatar>

            {!isMobile && (
              <Box display="flex" flexDirection="column" textAlign="left">
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
                  Carolina Perez
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  Coordinadora de Contratos
                </Typography>
              </Box>
            )}

            {!isMobile && (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </Box>

          <Menu
            anchorEl={anchorUser}
            open={Boolean(anchorUser)}
            onClose={() => setAnchorUser(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >

            <Divider />
            <Typography variant="body2" sx={{ px: 2, py: 1, fontWeight: 600 }}>
              Mi Cuenta
            </Typography>
            <Divider />

            <MenuItem component={Link} href="/dashboard/profile">
              Ver Perfil
            </MenuItem>


            <Divider />

            <MenuItem component={Link} href="/">
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
