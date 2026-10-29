import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
} from "@mui/material";

import {
  ConfirmationNumber,
  SupportAgent,
  Refresh,
  Search,
  CheckCircle,
  PendingActions,
  Autorenew,
  Close,
  Person,
  AccessTime,
  PriorityHigh,
  ViewKanban,
  ViewList,
  DragIndicator,
  Image,
  ZoomIn,
  Forum,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { isTechAdmin } from "../../router/TechAdminRoute";
import { getAdminTickets, getAdminTicketStats, updateTicket, getTechUsers } from "../../services/api";
import TicketChat from "../../components/TicketChat";

const statusConfig = {
  pendiente: { label: "Pendiente", color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
  en_proceso: { label: "En Proceso", color: "#1d4ed8", bg: "#dbeafe", border: "#bfdbfe" },
  resuelto: { label: "Resuelto", color: "#15803d", bg: "#dcfce7", border: "#bbf7d0" },
  cerrado: { label: "Cerrado", color: "#475569", bg: "#f1f5f9", border: "#e2e8f0" },
};

const priorityConfig = {
  baja: { label: "Baja", color: "#475569", bg: "#f1f5f9" },
  media: { label: "Media", color: "#1d4ed8", bg: "#eff6ff" },
  alta: { label: "Alta", color: "#c2410c", bg: "#fff7ed" },
  urgente: { label: "Urgente", color: "#b91c1c", bg: "#fef2f2" },
};

const KANBAN_COLUMNS = [
  {
    id: "pendiente",
    label: "Pendientes",
    color: "#b45309",
    bg: "#fffbeb",
    activeDropBg: "#fef3c7",
    border: "#f59e0b",
    badgeBg: "#fef3c7",
    badgeBorder: "#fde68a",
    icon: PendingActions,
  },
  {
    id: "en_proceso",
    label: "En Proceso",
    color: "#1d4ed8",
    bg: "#eff6ff",
    activeDropBg: "#dbeafe",
    border: "#3b82f6",
    badgeBg: "#dbeafe",
    badgeBorder: "#bfdbfe",
    icon: Autorenew,
  },
  {
    id: "resuelto",
    label: "Resueltos",
    color: "#15803d",
    bg: "#f0fdf4",
    activeDropBg: "#dcfce7",
    border: "#22c55e",
    badgeBg: "#dcfce7",
    badgeBorder: "#bbf7d0",
    icon: CheckCircle,
  },
  {
    id: "cerrado",
    label: "Cerrados",
    color: "#475569",
    bg: "#f8fafc",
    activeDropBg: "#f1f5f9",
    border: "#94a3b8",
    badgeBg: "#f1f5f9",
    badgeBorder: "#e2e8f0",
    icon: Close,
  },
];

export default function TicketsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, pendientes: 0, en_proceso: 0, resueltos: 0, urgentes: 0 });
  const [loading, setLoading] = useState(true);

  // Modo de vista: 'planner' (Kanban con Drag & Drop) o 'table' (Tabla)
  const [viewMode, setViewMode] = useState("planner");

  // Estado de Drag & Drop
  const [draggingTicketId, setDraggingTicketId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Filtros
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [priorityFilter, setPriorityFilter] = useState("todas");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [assignedToFilter, setAssignedToFilter] = useState("todos");

  // Usuarios del Departamento de Tecnología para asignación de responsables
  const [techUsers, setTechUsers] = useState([]);

  // Modal de Detalle / Gestión
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState("pendiente");
  const [editPriority, setEditPriority] = useState("media");
  const [editAdminNotes, setEditAdminNotes] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewImageZoom, setPreviewImageZoom] = useState(null);
  const [activeChatTicket, setActiveChatTicket] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Cargar usuarios de tecnología
  useEffect(() => {
    const fetchTechUsers = async () => {
      try {
        const users = await getTechUsers();
        setTechUsers(users);
      } catch (err) {
        console.error("Error al cargar usuarios de tecnología:", err);
      }
    };
    fetchTechUsers();
  }, []);

  const loadData = async () => {
    if (user && !isTechAdmin(user)) return;
    setLoading(true);
    try {
      const [ticketsData, statsData] = await Promise.all([
        getAdminTickets({
          search,
          status: statusFilter,
          priority: priorityFilter,
          category: categoryFilter,
          assigned_to: assignedToFilter,
        }),
        getAdminTicketStats(),
      ]);

      setTickets(ticketsData);
      setStats(statsData);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Error al cargar tickets", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, priorityFilter, categoryFilter, assignedToFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  // Manejador del Drag & Drop al soltar en una columna
  const handleDropOnColumn = async (newStatus) => {
    if (!draggingTicketId) return;

    const ticketToMove = tickets.find((t) => t.id === draggingTicketId);
    if (!ticketToMove || ticketToMove.status === newStatus) {
      setDraggingTicketId(null);
      setDragOverColumn(null);
      return;
    }

    const previousStatus = ticketToMove.status;
    const previousTickets = [...tickets];

    // Actualización optimista en interfaz
    setTickets((prev) =>
      prev.map((t) => (t.id === draggingTicketId ? { ...t, status: newStatus } : t))
    );
    setDraggingTicketId(null);
    setDragOverColumn(null);

    try {
      await updateTicket(ticketToMove.id, { status: newStatus });
      setSnackbar({
        open: true,
        message: `Ticket ${ticketToMove.code || `AXM-${ticketToMove.id}`} cambiado a "${statusConfig[newStatus]?.label || newStatus}".`,
        severity: "success",
      });

      // Refrescar KPIs
      const statsData = await getAdminTicketStats();
      setStats(statsData);
    } catch (err) {
      // Revertir ante error
      setTickets(previousTickets);
      setSnackbar({
        open: true,
        message: err.message || "Error al actualizar el estado del ticket",
        severity: "error",
      });
    }
  };

  const handleOpenManage = (ticket) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.status || "pendiente");
    setEditPriority(ticket.priority || "media");
    setEditAdminNotes(ticket.admin_notes || "");
    setEditAssignedTo(ticket.assigned_to ? String(ticket.assigned_to) : "");
    setManageDialogOpen(true);
  };

  const handleSaveManage = async () => {
    if (!selectedTicket) return;
    setSaving(true);
    try {
      const res = await updateTicket(selectedTicket.id, {
        status: editStatus,
        priority: editPriority,
        admin_notes: editAdminNotes,
        assigned_to: editAssignedTo ? Number(editAssignedTo) : null,
      });

      setSnackbar({ open: true, message: res.message || "Ticket actualizado.", severity: "success" });
      setManageDialogOpen(false);
      loadData();
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Error al guardar cambios", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (user && !isTechAdmin(user)) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <Card sx={{ maxWidth: 520, textAlign: "center", p: 3, borderRadius: 3, border: "1px solid #fee2e2", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
          <CardContent>
            <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "#fee2e2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 2 }}>
              <ConfirmationNumber sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#991b1b", mb: 1 }}>
              Acceso Restringido a la Ticketera
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 3 }}>
              El módulo de administración y gestión de tickets está reservado exclusivamente para los administradores del <strong>Departamento de Tecnología (TI)</strong>.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/dashboard")}
              sx={{
                bgcolor: "#722F37",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { bgcolor: "#5A1E24" },
              }}
            >
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#4A1C23" }}>
            Ticketera y Mesa de Ayuda
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Gestión, seguimiento y resolución de solicitudes técnicas de colaboradores
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          {/* SWITCHER DE VISTAS (PLANNER KANBAN / TABLA) */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, next) => next && setViewMode(next)}
            size="small"
            sx={{
              bgcolor: "#FAF7F2",
              border: "1px solid #E8E0D5",
              borderRadius: 2,
              "& .MuiToggleButton-root": {
                fontWeight: 700,
                fontSize: "0.82rem",
                textTransform: "none",
                px: 2,
                py: 0.8,
                color: "#4A1C23",
                border: "none",
                "&.Mui-selected": {
                  bgcolor: "#722F37",
                  color: "#FFFFFF",
                  "&:hover": { bgcolor: "#4A1C23" },
                },
              },
            }}
          >
            <ToggleButton value="planner">
              <ViewKanban sx={{ fontSize: 18, mr: 0.7 }} />
              Planner / Tablero
            </ToggleButton>
            <ToggleButton value="table">
              <ViewList sx={{ fontSize: 18, mr: 0.7 }} />
              Tabla
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadData}
            sx={{
              borderColor: "#E8E0D5",
              color: "#4A1C23",
              fontWeight: 600,
              py: 0.8,
              borderRadius: 2,
              "&:hover": { borderColor: "#722F37", backgroundColor: "#FAF7F2" },
            }}
          >
            Actualizar
          </Button>
        </Box>
      </Box>

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Card sx={{ borderRadius: 2.5, border: "1px solid #E8E0D5", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>
                  Total Tickets
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mt: 0.5 }}>
                  {stats.total}
                </Typography>
              </Box>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#F5F1EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ConfirmationNumber sx={{ color: "#722F37", fontSize: 24 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2.5, border: "1px solid #fde68a", bgcolor: "#fffbeb", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#b45309", fontWeight: 700, textTransform: "uppercase" }}>
                  Pendientes
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#b45309", mt: 0.5 }}>
                  {stats.pendientes}
                </Typography>
              </Box>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PendingActions sx={{ color: "#b45309", fontSize: 24 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2.5, border: "1px solid #bfdbfe", bgcolor: "#eff6ff", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#1d4ed8", fontWeight: 700, textTransform: "uppercase" }}>
                  En Proceso
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#1d4ed8", mt: 0.5 }}>
                  {stats.en_proceso}
                </Typography>
              </Box>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Autorenew sx={{ color: "#1d4ed8", fontSize: 24 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2.5, border: "1px solid #bbf7d0", bgcolor: "#f0fdf4", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#15803d", fontWeight: 700, textTransform: "uppercase" }}>
                  Resueltos
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#15803d", mt: 0.5 }}>
                  {stats.resueltos}
                </Typography>
              </Box>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle sx={{ color: "#15803d", fontSize: 24 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2.5, border: "1px solid #fecaca", bgcolor: "#fef2f2", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#b91c1c", fontWeight: 700, textTransform: "uppercase" }}>
                  Urgentes
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#b91c1c", mt: 0.5 }}>
                  {stats.urgentes}
                </Typography>
              </Box>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PriorityHigh sx={{ color: "#b91c1c", fontSize: 24 }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>

      {/* AVISO DE MENSAJES NUEVOS SIN LEER (ADMIN) */}
      {stats.con_mensajes_nuevos > 0 && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2.5,
            bgcolor: "#fef2f2",
            border: "1.5px solid #f87171",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            boxShadow: "0 4px 14px rgba(239, 68, 68, 0.12)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Forum sx={{ color: "#b91c1c", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#991b1b", display: "flex", alignItems: "center", gap: 1 }}>
                <span>🔔 ¡Atención! Tienes {stats.con_mensajes_nuevos} ticket{stats.con_mensajes_nuevos !== 1 ? "s" : ""} con nuevos mensajes sin leer de colaboradores.</span>
              </Typography>
              <Typography variant="caption" sx={{ color: "#b91c1c", display: "block" }}>
                Revisa los tickets identificados con la etiqueta roja pulsante para darles respuesta oportuna.
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* FILTROS Y BÚSQUEDA */}
      <Card sx={{ borderRadius: 2.5, border: "1px solid #E8E0D5", mb: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <CardContent sx={{ p: 2.5 }}>
          <form onSubmit={handleSearchSubmit}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
              <TextField
                placeholder="Buscar por código (AXM-XXXX), colaborador o asunto..."
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ flex: { xs: "1 1 100%", md: "1 1 300px" } }}
                InputProps={{
                  startAdornment: <Search sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />,
                }}
              />

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="todos">Todos los estados</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="en_proceso">En Proceso</MenuItem>
                  <MenuItem value="resuelto">Resuelto</MenuItem>
                  <MenuItem value="cerrado">Cerrado</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Prioridad"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="todas">Todas las prioridades</MenuItem>
                  <MenuItem value="urgente">Urgente</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                  <MenuItem value="media">Media</MenuItem>
                  <MenuItem value="baja">Baja</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 170 }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Categoría"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="todas">Todas las categorías</MenuItem>
                  <MenuItem value="Soporte TI">Soporte TI</MenuItem>
                  <MenuItem value="Sistemas / Software">Sistemas / Software</MenuItem>
                  <MenuItem value="Hardware / Equipos">Hardware / Equipos</MenuItem>
                  <MenuItem value="Cuentas y Accesos">Cuentas y Accesos</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 190 }}>
                <InputLabel>Responsable</InputLabel>
                <Select
                  value={assignedToFilter}
                  label="Responsable"
                  onChange={(e) => setAssignedToFilter(e.target.value)}
                >
                  <MenuItem value="todos">Todos los responsables</MenuItem>
                  <MenuItem value="sin_asignar">⚠️ Sin asignar</MenuItem>
                  {techUsers.map((tech) => (
                    <MenuItem key={tech.id} value={String(tech.id)}>
                      {tech.name} {tech.apellido}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
                  fontWeight: 600,
                  px: 3,
                  "&:hover": { background: "linear-gradient(135deg, #8B4049 0%, #5A1E24 100%)" },
                }}
              >
                Buscar
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* VISTA PLANNER (KANBAN CON DRAG & DROP) */}
      {viewMode === "planner" ? (
        <Box sx={{ position: "relative" }}>
          {loading ? (
            <Box sx={{ py: 10, textAlign: "center", bgcolor: "#FAF8F5", borderRadius: 3, border: "1px solid #E8E0D5" }}>
              <CircularProgress size={40} sx={{ color: "#722F37" }} />
              <Typography variant="body2" sx={{ mt: 1.5, color: "text.secondary", fontWeight: 600 }}>
                Cargando tablero planner...
              </Typography>
            </Box>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
              {KANBAN_COLUMNS.map((col) => {
                const ColumnIcon = col.icon;
                const columnTickets = tickets.filter((t) => t.status === col.id);
                const isDragOver = dragOverColumn === col.id;

                return (
                  <Box
                    key={col.id}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (dragOverColumn !== col.id) setDragOverColumn(col.id);
                    }}
                    onDragLeave={(e) => {
                      if (e.currentTarget.contains(e.relatedTarget)) return;
                      setDragOverColumn(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropOnColumn(col.id);
                    }}
                    sx={{
                      bgcolor: isDragOver ? col.activeDropBg : "#FAF8F5",
                      border: isDragOver ? `2.5px dashed ${col.border}` : "1.5px solid #E8E0D5",
                      borderTop: `4px solid ${col.border}`,
                      borderRadius: 3,
                      minHeight: 520,
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.2s ease-in-out",
                      boxShadow: isDragOver ? "0 8px 24px rgba(0,0,0,0.08)" : "0 2px 8px rgba(0,0,0,0.02)",
                    }}
                  >
                    {/* CABECERA DE COLUMNA */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                        pb: 1.5,
                        borderBottom: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ColumnIcon sx={{ fontSize: 20, color: col.color }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#1e293b", fontSize: "0.95rem" }}>
                          {col.label}
                        </Typography>
                      </Box>
                      <Chip
                        label={columnTickets.length}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.75rem",
                          bgcolor: col.badgeBg,
                          color: col.color,
                          border: `1px solid ${col.badgeBorder}`,
                          minWidth: 28,
                          height: 24,
                        }}
                      />
                    </Box>

                    {/* LISTA DE TARJETAS ARRASTRABLES */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8, flex: 1 }}>
                      {columnTickets.length === 0 ? (
                        <Box
                          sx={{
                            p: 3,
                            textAlign: "center",
                            border: "1px dashed #cbd5e1",
                            borderRadius: 2,
                            bgcolor: "rgba(255,255,255,0.6)",
                            my: "auto",
                          }}
                        >
                          <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                            Arrastra un ticket aquí para cambiar a {col.label.toLowerCase()}
                          </Typography>
                        </Box>
                      ) : (
                        columnTickets.map((ticket) => {
                          const priorityInfo = priorityConfig[ticket.priority] || priorityConfig.media;
                          const isDragging = draggingTicketId === ticket.id;

                          return (
                            <Card
                              key={ticket.id}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData("text/plain", ticket.id);
                                e.dataTransfer.effectAllowed = "move";
                                setDraggingTicketId(ticket.id);
                              }}
                              onDragEnd={() => {
                                setDraggingTicketId(null);
                                setDragOverColumn(null);
                              }}
                              onClick={() => handleOpenManage(ticket)}
                              sx={{
                                borderRadius: 2,
                                border: "1px solid #E8E0D5",
                                bgcolor: "#FFFFFF",
                                boxShadow: isDragging ? "0 12px 28px rgba(0,0,0,0.15)" : "0 2px 6px rgba(0,0,0,0.04)",
                                opacity: isDragging ? 0.45 : 1,
                                cursor: "grab",
                                "&:active": { cursor: "grabbing" },
                                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 6px 16px rgba(74,28,35,0.08)",
                                  borderColor: "#722F37",
                                },
                              }}
                            >
                              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                {/* TOP: CÓDIGO + PRIORIDAD + DRAG ICON */}
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Chip
                                      label={ticket.code || `AXM-${ticket.id}`}
                                      size="small"
                                      sx={{
                                        fontWeight: 800,
                                        fontSize: "0.72rem",
                                        bgcolor: "rgba(114, 47, 55, 0.08)",
                                        color: "#722F37",
                                        border: "1px solid rgba(114, 47, 55, 0.2)",
                                        borderRadius: 1,
                                        height: 22,
                                      }}
                                    />
                                    <Chip
                                      size="small"
                                      label={priorityInfo.label}
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "0.7rem",
                                        color: priorityInfo.color,
                                        bgcolor: priorityInfo.bg,
                                        border: "1px solid",
                                        borderColor: "currentColor",
                                        height: 22,
                                      }}
                                    />
                                  </Box>
                                  <Tooltip title="Arrastra para mover de columna">
                                    <DragIndicator sx={{ color: "#94a3b8", fontSize: 18 }} />
                                  </Tooltip>
                                </Box>

                                {/* ASUNTO */}
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: 700,
                                    color: "#1e293b",
                                    lineHeight: 1.35,
                                    mb: 1,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {ticket.title}
                                </Typography>

                                {/* CATEGORÍA Y BADGE FOTO */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
                                  <Chip
                                    size="small"
                                    label={ticket.category}
                                    sx={{
                                      fontSize: "0.7rem",
                                      bgcolor: "#f1f5f9",
                                      color: "#475569",
                                      height: 20,
                                    }}
                                  />
                                  {ticket.imagen_url && (
                                    <Chip
                                      size="small"
                                      icon={<Image sx={{ fontSize: "13px !important", color: "#0284c7 !important" }} />}
                                      label="Foto"
                                      sx={{
                                        fontSize: "0.68rem",
                                        bgcolor: "#e0f2fe",
                                        color: "#0369a1",
                                        border: "1px solid #bae6fd",
                                        height: 20,
                                        fontWeight: 700,
                                        px: 0.5,
                                      }}
                                    />
                                  )}
                                  {ticket.unread_messages_count > 0 ? (
                                    <Tooltip title={`${ticket.unread_messages_count} nuevo${ticket.unread_messages_count !== 1 ? "s" : ""} mensaje${ticket.unread_messages_count !== 1 ? "s" : ""} sin leer del colaborador`}>
                                      <Chip
                                        size="small"
                                        icon={<Forum sx={{ fontSize: "12px !important", color: "#b91c1c !important" }} />}
                                        label={`${ticket.unread_messages_count} NUEVO${ticket.unread_messages_count !== 1 ? "S" : ""}`}
                                        sx={{
                                          fontSize: "0.68rem",
                                          bgcolor: "#fef2f2",
                                          color: "#b91c1c",
                                          border: "1.5px solid #ef4444",
                                          height: 20,
                                          fontWeight: 900,
                                          px: 0.3,
                                          animation: "pulse 1.8s infinite",
                                          boxShadow: "0 0 8px rgba(239, 68, 68, 0.4)",
                                        }}
                                      />
                                    </Tooltip>
                                  ) : ticket.messages_count > 0 ? (
                                    <Tooltip title={`${ticket.messages_count} mensaje${ticket.messages_count !== 1 ? "s" : ""} en conversación`}>
                                      <Chip
                                        size="small"
                                        icon={<Forum sx={{ fontSize: "12px !important", color: "#722F37 !important" }} />}
                                        label={`${ticket.messages_count}`}
                                        sx={{
                                          fontSize: "0.68rem",
                                          bgcolor: "rgba(114, 47, 55, 0.08)",
                                          color: "#722F37",
                                          border: "1px solid rgba(114, 47, 55, 0.25)",
                                          height: 20,
                                          fontWeight: 800,
                                          px: 0.3,
                                        }}
                                      />
                                    </Tooltip>
                                  ) : null}
                                </Box>

                                {/* SOLICITANTE */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    pt: 1.2,
                                    borderTop: "1px solid #f1f5f9",
                                  }}
                                >
                                  <Avatar
                                    src={ticket.user?.path_foto_perfil || ticket.user?.foto_perfil}
                                    sx={{ width: 26, height: 26, bgcolor: "#722F37", fontSize: "0.75rem", fontWeight: 700 }}
                                  >
                                    {ticket.user?.name?.[0] || "U"}
                                  </Avatar>
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontWeight: 700,
                                        color: "#334155",
                                        display: "block",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {ticket.user?.name} {ticket.user?.apellido}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.68rem", display: "block" }}>
                                      {ticket.created_at
                                        ? new Date(ticket.created_at).toLocaleDateString("es-CL", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : ""}
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* RESPONSABLE ASIGNADO */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    pt: 1,
                                    mt: 1,
                                    borderTop: "1px dashed #e2e8f0",
                                  }}
                                >
                                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.68rem" }}>
                                    Responsable:
                                  </Typography>
                                  {ticket.assigned_user ? (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, maxWidth: "70%" }}>
                                      <Avatar
                                        src={ticket.assigned_user.path_foto_perfil || ticket.assigned_user.foto_perfil}
                                        sx={{ width: 20, height: 20, bgcolor: "#1e293b", fontSize: "0.65rem", fontWeight: 700 }}
                                      >
                                        {ticket.assigned_user.name?.[0] || "T"}
                                      </Avatar>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontWeight: 700,
                                          color: "#0f172a",
                                          fontSize: "0.72rem",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                        }}
                                      >
                                        {ticket.assigned_user.name} {ticket.assigned_user.apellido}
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <Chip
                                      label="Sin asignar"
                                      size="small"
                                      sx={{
                                        fontSize: "0.65rem",
                                        height: 19,
                                        bgcolor: "#fef3c7",
                                        color: "#92400e",
                                        border: "1px solid #fde68a",
                                        fontWeight: 700,
                                      }}
                                    />
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          );
                        })
                      )}
                    </Box>
                  </Box>
                );
              })}
            </div>
          )}
        </Box>
      ) : (
        /* VISTA TABLA DE TICKETS */
        <Card sx={{ borderRadius: 2.5, border: "1px solid #E8E0D5", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: "#FAF7F2", borderBottom: "2px solid #E8E0D5" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "#4A1C23" }}>Código</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4A1C23" }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4A1C23" }}>Colaborador</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4A1C23" }}>Asunto y Categoría</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4A1C23" }}>Responsable</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4A1C23" }} align="center">Prioridad</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4A1C23" }} align="center">Estado</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4A1C23" }} align="center">Acción</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <CircularProgress size={36} sx={{ color: "#722F37" }} />
                      <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                        Cargando tickets...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <SupportAgent sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#64748b" }}>
                        No se encontraron tickets
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                        No hay registros que coincidan con los filtros aplicados.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => {
                    const statusInfo = statusConfig[ticket.status] || statusConfig.pendiente;
                    const priorityInfo = priorityConfig[ticket.priority] || priorityConfig.media;

                    return (
                      <TableRow
                        key={ticket.id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "#FAF7F2" },
                          transition: "background-color 0.15s ease",
                        }}
                      >
                        {/* CÓDIGO */}
                        <TableCell>
                          <Chip
                            label={ticket.code || `AXM-${ticket.id}`}
                            sx={{
                              fontWeight: 800,
                              letterSpacing: "0.5px",
                              bgcolor: "rgba(114, 47, 55, 0.08)",
                              color: "#722F37",
                              border: "1px solid rgba(114, 47, 55, 0.2)",
                              borderRadius: 1.5,
                            }}
                          />
                        </TableCell>

                        {/* FECHA */}
                        <TableCell sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                          {ticket.created_at
                            ? new Date(ticket.created_at).toLocaleDateString("es-CL", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </TableCell>

                        {/* COLABORADOR */}
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar
                              src={ticket.user?.path_foto_perfil || ticket.user?.foto_perfil}
                              sx={{ width: 34, height: 34, bgcolor: "#722F37", fontSize: "0.85rem", fontWeight: 700 }}
                            >
                              {ticket.user?.name?.[0] || "U"}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                                {ticket.user?.name} {ticket.user?.apellido}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                                {ticket.user?.departamento || ticket.user?.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        {/* ASUNTO & CATEGORÍA */}
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
                            {ticket.title}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <Chip
                              size="small"
                              label={ticket.category}
                              sx={{ fontSize: "0.75rem", bgcolor: "#f1f5f9", color: "#475569" }}
                            />
                            {ticket.imagen_url && (
                              <Chip
                                size="small"
                                icon={<Image sx={{ fontSize: "13px !important", color: "#0284c7 !important" }} />}
                                label="Foto"
                                sx={{
                                  fontSize: "0.72rem",
                                  bgcolor: "#e0f2fe",
                                  color: "#0369a1",
                                  border: "1px solid #bae6fd",
                                  height: 22,
                                  fontWeight: 700,
                                }}
                              />
                            )}
                            {ticket.unread_messages_count > 0 ? (
                              <Tooltip title={`${ticket.unread_messages_count} nuevo${ticket.unread_messages_count !== 1 ? "s" : ""} mensaje${ticket.unread_messages_count !== 1 ? "s" : ""} sin leer del colaborador`}>
                                <Chip
                                  size="small"
                                  icon={<Forum sx={{ fontSize: "13px !important", color: "#b91c1c !important" }} />}
                                  label={`${ticket.unread_messages_count} NUEVO${ticket.unread_messages_count !== 1 ? "S" : ""}`}
                                  sx={{
                                    fontSize: "0.72rem",
                                    bgcolor: "#fef2f2",
                                    color: "#b91c1c",
                                    border: "1.5px solid #ef4444",
                                    height: 22,
                                    fontWeight: 900,
                                    animation: "pulse 1.8s infinite",
                                    boxShadow: "0 0 8px rgba(239, 68, 68, 0.35)",
                                  }}
                                />
                              </Tooltip>
                            ) : ticket.messages_count > 0 ? (
                              <Tooltip title={`${ticket.messages_count} mensaje${ticket.messages_count !== 1 ? "s" : ""} en conversación`}>
                                <Chip
                                  size="small"
                                  icon={<Forum sx={{ fontSize: "13px !important", color: "#722F37 !important" }} />}
                                  label={`${ticket.messages_count}`}
                                  sx={{
                                    fontSize: "0.72rem",
                                    bgcolor: "rgba(114, 47, 55, 0.08)",
                                    color: "#722F37",
                                    border: "1px solid rgba(114, 47, 55, 0.25)",
                                    height: 22,
                                    fontWeight: 800,
                                  }}
                                />
                              </Tooltip>
                            ) : null}
                          </Box>
                        </TableCell>

                        {/* RESPONSABLE */}
                        <TableCell>
                          {ticket.assigned_user ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar
                                src={ticket.assigned_user.path_foto_perfil || ticket.assigned_user.foto_perfil}
                                sx={{ width: 28, height: 28, bgcolor: "#1e293b", fontSize: "0.75rem", fontWeight: 700 }}
                              >
                                {ticket.assigned_user.name?.[0] || "T"}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.82rem" }}>
                                  {ticket.assigned_user.name} {ticket.assigned_user.apellido}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem", display: "block" }}>
                                  {ticket.assigned_user.cargo || "Departamento de TI"}
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Chip
                              label="Sin asignar"
                              size="small"
                              sx={{
                                bgcolor: "#fef3c7",
                                color: "#92400e",
                                border: "1px solid #fde68a",
                                fontWeight: 700,
                                fontSize: "0.72rem",
                                height: 22,
                              }}
                            />
                          )}
                        </TableCell>

                        {/* PRIORIDAD */}
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={priorityInfo.label}
                            sx={{
                              fontWeight: 700,
                              color: priorityInfo.color,
                              bgcolor: priorityInfo.bg,
                              border: "1px solid",
                              borderColor: "currentColor",
                            }}
                          />
                        </TableCell>

                        {/* ESTADO */}
                        <TableCell align="center">
                          <Chip
                            size="small"
                            label={statusInfo.label}
                            sx={{
                              fontWeight: 700,
                              color: statusInfo.color,
                              bgcolor: statusInfo.bg,
                              border: `1px solid ${statusInfo.border}`,
                            }}
                          />
                        </TableCell>

                        {/* ACCIÓN */}
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenManage(ticket)}
                            sx={{
                              background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
                              textTransform: "none",
                              fontWeight: 700,
                              borderRadius: 1.5,
                              boxShadow: "0 2px 8px rgba(114, 47, 55, 0.25)",
                              "&:hover": { background: "linear-gradient(135deg, #8B4049 0%, #5A1E24 100%)" },
                            }}
                          >
                            Gestionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* DIALOG DE GESTIÓN DE TICKET */}
      {selectedTicket && (
        <Dialog
          open={manageDialogOpen}
          onClose={() => setManageDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <ConfirmationNumber sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                  Ticket {selectedTicket.code || `AXM-${selectedTicket.id}`}
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.85)" }}>
                  Ingresado el{" "}
                  {selectedTicket.created_at
                    ? new Date(selectedTicket.created_at).toLocaleDateString("es-CL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </Typography>
              </Box>
            </Box>

            <IconButton onClick={() => setManageDialogOpen(false)} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ pt: 3, pb: 2 }}>
            {/* INFO SOLICITANTE */}
            <Box
              sx={{
                bgcolor: "#FAF7F2",
                border: "1px solid #E8E0D5",
                borderRadius: 2,
                p: 2.5,
                mb: 3,
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                alignItems: "center",
              }}
            >
              <Avatar
                src={selectedTicket.user?.path_foto_perfil || selectedTicket.user?.foto_perfil}
                sx={{ width: 48, height: 48, bgcolor: "#722F37", fontWeight: 700 }}
              >
                {selectedTicket.user?.name?.[0]}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#4A1C23" }}>
                  {selectedTicket.user?.name} {selectedTicket.user?.apellido}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {selectedTicket.user?.email} &bull; {selectedTicket.user?.departamento || "General"}
                </Typography>
              </Box>
              <Box>
                <Chip
                  label={selectedTicket.category}
                  sx={{ bgcolor: "#E8E0D5", color: "#4A1C23", fontWeight: 700 }}
                />
              </Box>
            </Box>

            {/* ASUNTO Y DESCRIPCIÓN */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>
                Asunto del Requerimiento
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
                {selectedTicket.title}
              </Typography>

              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase" }}>
                Descripción Detallada
              </Typography>
              <Box
                sx={{
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 2,
                  p: 2.5,
                  mt: 0.5,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  color: "#334155",
                  fontSize: "0.95rem",
                }}
              >
                {selectedTicket.description}
              </Box>

              {/* FOTOGRAFÍA ADJUNTA SI EXISTE */}
              {selectedTicket.imagen_url && (
                <Box sx={{ mt: 2.5 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", display: "block", mb: 1 }}>
                    Fotografía / Evidencia Adjunta
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2.5,
                    }}
                  >
                    <Box
                      component="img"
                      src={selectedTicket.imagen_url}
                      alt="Evidencia adjunta"
                      onClick={() => setPreviewImageZoom(selectedTicket.imagen_url)}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 2,
                        cursor: "pointer",
                        border: "2px solid #cbd5e1",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#722F37",
                          transform: "scale(1.04)",
                        },
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
                        Captura o fotografía del solicitante
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1 }}>
                        Haz clic en la imagen o en el botón para ver en resolución completa
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ZoomIn />}
                        onClick={() => setPreviewImageZoom(selectedTicket.imagen_url)}
                        sx={{
                          borderRadius: 1.5,
                          textTransform: "none",
                          fontSize: "0.8rem",
                          color: "#722F37",
                          borderColor: "rgba(114, 47, 55, 0.3)",
                          "&:hover": { borderColor: "#722F37", bgcolor: "rgba(114, 47, 55, 0.04)" },
                        }}
                      >
                        Ampliar Fotografía
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
              {/* SECCIÓN DESTACADA: CHAT Y SEGUIMIENTO CON EL SOLICITANTE */}
              <Paper
                elevation={0}
                sx={{
                  mt: 2.5,
                  p: 2,
                  bgcolor: (selectedTicket.unread_messages_count > 0) ? "#FFF5F5" : "#FAF7F2",
                  border: (selectedTicket.unread_messages_count > 0) ? "1.5px solid #ef4444" : "1px solid #E8E0D5",
                  borderLeft: (selectedTicket.unread_messages_count > 0) ? "6px solid #dc2626" : "5px solid #722F37",
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Badge badgeContent={selectedTicket.unread_messages_count || 0} color="error">
                    <Forum sx={{ color: (selectedTicket.unread_messages_count > 0) ? "#dc2626" : "#722F37", fontSize: 28 }} />
                  </Badge>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: (selectedTicket.unread_messages_count > 0) ? "#991b1b" : "#4A1C23" }}>
                      Seguimiento y Conversación con el Solicitante
                      {selectedTicket.unread_messages_count > 0 && (
                        <Chip
                          label={`¡${selectedTicket.unread_messages_count} NUEVO${selectedTicket.unread_messages_count > 1 ? "S" : ""} MENSAJE${selectedTicket.unread_messages_count > 1 ? "S" : ""} SIN LEER!`}
                          size="small"
                          color="error"
                          sx={{ ml: 1, fontWeight: 800, fontSize: "0.68rem", height: 20 }}
                        />
                      )}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {selectedTicket.unread_messages_count > 0
                        ? "El solicitante ha enviado nuevos mensajes que aún no has revisado."
                        : selectedTicket.messages_count > 0
                        ? `Hay ${selectedTicket.messages_count} observación${selectedTicket.messages_count !== 1 ? "es" : ""} / mensaje${selectedTicket.messages_count !== 1 ? "s" : ""} en este ticket.`
                        : "Sin observaciones adicionales aún. Puedes abrir el chat para escribirle al colaborador."}
                    </Typography>
                  </Box>
                </Box>
                <Badge badgeContent={selectedTicket.unread_messages_count || 0} color="error">
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Forum />}
                    onClick={() => setActiveChatTicket(selectedTicket)}
                    sx={{
                      background: (selectedTicket.unread_messages_count > 0)
                        ? "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)"
                        : "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
                      color: "#ffffff",
                      fontWeight: 700,
                      textTransform: "none",
                      borderRadius: 2,
                      px: 2.5,
                      py: 0.8,
                      boxShadow: (selectedTicket.unread_messages_count > 0)
                        ? "0 3px 10px rgba(220, 38, 38, 0.35)"
                        : "0 2px 8px rgba(114, 47, 55, 0.25)",
                      "&:hover": {
                        background: (selectedTicket.unread_messages_count > 0)
                          ? "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)"
                          : "linear-gradient(135deg, #8B4049 0%, #5A1E24 100%)",
                      },
                    }}
                  >
                    Abrir Chat del Ticket {selectedTicket.messages_count > 0 ? `(${selectedTicket.messages_count})` : ""}
                  </Button>
                </Badge>
              </Paper>
            </Box>

            {/* FORMULARIO DE ACCIONES ADMIN */}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#4A1C23", mb: 2 }}>
              Gestión y Estado del Ticket
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
              <FormControl sx={{ minWidth: 180, flex: 1 }}>
                <InputLabel>Estado del Ticket</InputLabel>
                <Select
                  value={editStatus}
                  label="Estado del Ticket"
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <MenuItem value="pendiente">🟡 Pendiente</MenuItem>
                  <MenuItem value="en_proceso">🔵 En Proceso</MenuItem>
                  <MenuItem value="resuelto">🟢 Resuelto</MenuItem>
                  <MenuItem value="cerrado">⚪ Cerrado</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 180, flex: 1 }}>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={editPriority}
                  label="Prioridad"
                  onChange={(e) => setEditPriority(e.target.value)}
                >
                  <MenuItem value="baja">Baja</MenuItem>
                  <MenuItem value="media">Media</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                  <MenuItem value="urgente">🚨 Urgente</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 220, flex: 1.2 }}>
                <InputLabel>Responsable (TI)</InputLabel>
                <Select
                  value={editAssignedTo}
                  label="Responsable (TI)"
                  onChange={(e) => setEditAssignedTo(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Sin asignar / Sin responsable</em>
                  </MenuItem>
                  {techUsers.map((tech) => (
                    <MenuItem key={tech.id} value={String(tech.id)}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                          src={tech.path_foto_perfil || tech.foto_perfil}
                          sx={{ width: 24, height: 24, fontSize: "0.75rem", bgcolor: "#722F37" }}
                        >
                          {tech.name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {tech.name} {tech.apellido}
                          </Typography>
                          {tech.cargo && (
                            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem", display: "block", lineHeight: 1 }}>
                              {tech.cargo}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Notas de resolución / Respuesta técnica (opcional)"
              multiline
              rows={4}
              fullWidth
              value={editAdminNotes}
              onChange={(e) => setEditAdminNotes(e.target.value)}
              placeholder="Indica la solución aplicada, instrucciones para el colaborador o notas de seguimiento..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&.Mui-focused fieldset": { borderColor: "#722F37" },
                },
                "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
              }}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
              <Button
                variant="outlined"
                startIcon={<Forum />}
                onClick={() => setActiveChatTicket(selectedTicket)}
                sx={{
                  color: "#722F37",
                  borderColor: "#722F37",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": { borderColor: "#4A1C23", bgcolor: "rgba(114, 47, 55, 0.04)" },
                }}
              >
                Chat con Solicitante {selectedTicket.messages_count > 0 ? `(${selectedTicket.messages_count})` : ""}
              </Button>
            </Box>
            <Button
              onClick={() => setManageDialogOpen(false)}
              sx={{ color: "text.secondary", fontWeight: 600 }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              disabled={saving}
              onClick={handleSaveManage}
              sx={{
                background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
                fontWeight: 700,
                px: 3.5,
                py: 1,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(114, 47, 55, 0.3)",
                "&:hover": { background: "linear-gradient(135deg, #8B4049 0%, #5A1E24 100%)" },
              }}
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* MODAL DE CHAT Y SEGUIMIENTO DEL TICKET */}
      {activeChatTicket && (
        <TicketChat
          ticket={activeChatTicket}
          onClose={() => {
            setActiveChatTicket(null);
            loadData();
          }}
          onMessageSent={() => {
            loadData();
          }}
          onMessagesRead={(readTicketId) => {
            setTickets((prev) =>
              prev.map((t) => (t.id === readTicketId ? { ...t, unread_messages_count: 0 } : t))
            );
            if (selectedTicket && selectedTicket.id === readTicketId) {
              setSelectedTicket((prev) => ({ ...prev, unread_messages_count: 0 }));
            }
          }}
        />
      )}

      {/* SNACKBAR NOTIFICACIONES */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 2, boxShadow: 4 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* MODAL ZOOM DE IMAGEN EN TICKET DETAIL */}
      <Dialog
        open={Boolean(previewImageZoom)}
        onClose={() => setPreviewImageZoom(null)}
        maxWidth="lg"
        PaperProps={{ sx: { borderRadius: 3, bgcolor: "transparent", boxShadow: "none", overflow: "hidden" } }}
      >
        <Box sx={{ position: "relative", bgcolor: "#0f172a", p: 1.5, textAlign: "center", borderRadius: 2 }}>
          <IconButton
            onClick={() => setPreviewImageZoom(null)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "white",
              bgcolor: "rgba(0,0,0,0.6)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
            }}
          >
            <Close />
          </IconButton>
          <Box
            component="img"
            src={previewImageZoom}
            alt="Fotografía ampliada"
            sx={{ maxWidth: "100%", maxHeight: "85vh", objectFit: "contain", borderRadius: 1.5, display: "block", mx: "auto" }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}
