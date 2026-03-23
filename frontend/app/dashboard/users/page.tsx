"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { muiTheme } from "@/lib/mui-theme"
import Link from "next/link"

import {
  IconSearch,
  IconUserPlus,
  IconEdit2,
  IconTrash2,
  IconMoreVertical,
  IconFilter,
  IconUsers,
  IconShield,
  IconMail,
  IconPhone,
  IconDownload,
} from "@/app/components/icons"

interface User {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string
  departamento: string
  cargo: string
  rol: "admin" | "usuario"
  estado: "activo" | "inactivo" | "pendiente"
  fechaCreacion: string
  ultimoAcceso: string
  avatar?: string
}

const usersData: User[] = [
  {
    id: 1,
    nombre: "Cristobal",
    apellido: "Nuñez",
    email: "cristobal.nunez@empresa.com",
    telefono: "+34 612 345 678",
    departamento: "Tecnología",
    cargo: "Director de TI",
    rol: "admin",
    estado: "activo",
    fechaCreacion: "2023-01-15",
    ultimoAcceso: "2024-03-18",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    email: "maria.gonzalez@empresa.com",
    telefono: "+34 623 456 789",
    departamento: "Recursos Humanos",
    cargo: "Gerente de RRHH",
    rol: "usuario",
    estado: "activo",
    fechaCreacion: "2023-02-20",
    ultimoAcceso: "2024-03-17",
  },
  {
    id: 3,
    nombre: "Juan",
    apellido: "Martínez",
    email: "juan.martinez@empresa.com",
    telefono: "+34 634 567 890",
    departamento: "Finanzas",
    cargo: "Analista Financiero",
    rol: "usuario",
    estado: "activo",
    fechaCreacion: "2023-03-10",
    ultimoAcceso: "2024-03-16",
  },
  {
    id: 4,
    nombre: "Ana",
    apellido: "López",
    email: "ana.lopez@empresa.com",
    telefono: "+34 645 678 901",
    departamento: "Marketing",
    cargo: "Coordinadora de Marketing",
    rol: "usuario",
    estado: "inactivo",
    fechaCreacion: "2023-04-05",
    ultimoAcceso: "2024-02-28",
  },
  {
    id: 5,
    nombre: "Pedro",
    apellido: "Sánchez",
    email: "pedro.sanchez@empresa.com",
    telefono: "+34 656 789 012",
    departamento: "Ventas",
    cargo: "Ejecutivo de Ventas",
    rol: "usuario",
    estado: "pendiente",
    fechaCreacion: "2024-03-01",
    ultimoAcceso: "-",
  },
  {
    id: 6,
    nombre: "Laura",
    apellido: "Fernández",
    email: "laura.fernandez@empresa.com",
    telefono: "+34 667 890 123",
    departamento: "Tecnología",
    cargo: "Desarrolladora Senior",
    rol: "usuario",
    estado: "activo",
    fechaCreacion: "2023-05-15",
    ultimoAcceso: "2024-03-18",
  },
  {
    id: 7,
    nombre: "Miguel",
    apellido: "Torres",
    email: "miguel.torres@empresa.com",
    telefono: "+34 678 901 234",
    departamento: "Operaciones",
    cargo: "Gerente de Operaciones",
    rol: "usuario",
    estado: "activo",
    fechaCreacion: "2023-06-20",
    ultimoAcceso: "2024-03-15",
  },
  {
    id: 8,
    nombre: "Carmen",
    apellido: "Ruiz",
    email: "carmen.ruiz@empresa.com",
    telefono: "+34 689 012 345",
    departamento: "Legal",
    cargo: "Asesora Legal",
    rol: "usuario",
    estado: "activo",
    fechaCreacion: "2023-07-10",
    ultimoAcceso: "2024-03-14",
  },
]

const getRolColor = (rol: string) => {
  switch (rol) {
    case "admin":
      return { bg: "#722F37", color: "#fff" }
    default:
      return { bg: "#E8E0D5", color: "#4A1C23" }
  }
}

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "activo":
      return "success"
    case "inactivo":
      return "error"
    default:
      return "warning"
  }
}

export default function GestionUsuariosPage() {
  const [users, setUsers] = useState<User[]>(usersData)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartamento, setFilterDepartamento] = useState("")
  const [filterRol, setFilterRol] = useState("")
  const [filterEstado, setFilterEstado] = useState("")
  const [tabValue, setTabValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })

  const departamentos = [...new Set(usersData.map((u) => u.departamento))]

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartamento = !filterDepartamento || user.departamento === filterDepartamento
    const matchesRol = !filterRol || user.rol === filterRol
    const matchesEstado = !filterEstado || user.estado === filterEstado
    const matchesTab =
      tabValue === 0 ||
      (tabValue === 1 && user.estado === "activo") ||
      (tabValue === 2 && user.estado === "inactivo") ||
      (tabValue === 3 && user.estado === "pendiente")

    return matchesSearch && matchesDepartamento && matchesRol && matchesEstado && matchesTab
  })

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteClick = () => {
    handleMenuClose()
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      setUsers(users.filter((u) => u.id !== selectedUser.id))
      setSnackbar({ open: true, message: "Usuario eliminado correctamente", severity: "success" })
    }
    setDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const stats = {
    total: users.length,
    activos: users.filter((u) => u.estado === "activo").length,
    inactivos: users.filter((u) => u.estado === "inactivo").length,
    pendientes: users.filter((u) => u.estado === "pendiente").length,
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ color: "#4A1C23", fontWeight: 700 }} >
              Gestión de Usuarios
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Administra los usuarios de la intranet corporativa
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/dashboard/users/crear"
            variant="contained"
            startIcon={<IconUserPlus className="w-5 h-5" />}
            sx={{ borderRadius: 2, fontSize: "1.25rem" }}
          >
            Nuevo Usuario
          </Button>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3, mb: 4 }}>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#722F37" }}>
              <IconUsers className="w-6 h-6 text-white" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Usuarios
              </Typography>
            </Box>
          </Paper>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#22c55e" }}>
              <IconShield className="w-6 h-6 text-white" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {stats.activos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Usuarios Activos
              </Typography>
            </Box>
          </Paper>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#ef4444" }}>
              <IconUsers className="w-6 h-6 text-white" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {stats.inactivos}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Usuarios Inactivos
              </Typography>
            </Box>
          </Paper>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "#f59e0b" }}>
              <IconUsers className="w-6 h-6 text-white" />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {stats.pendientes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pendientes
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Filters and Search */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: { md: "center" }, justifyContent: "space-between" }}>
            <TextField
              placeholder="Buscar por nombre, apellido o email..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch className="w-5 h-5 text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Departamento</InputLabel>
                <Select value={filterDepartamento} label="Departamento" onChange={(e) => setFilterDepartamento(e.target.value)}>
                  <MenuItem value="">Todos</MenuItem>
                  {departamentos.map((dep) => (
                    <MenuItem key={dep} value={dep}>
                      {dep}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Rol</InputLabel>
                <Select value={filterRol} label="Rol" onChange={(e) => setFilterRol(e.target.value)}>
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="usuario">Usuario</MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Exportar usuarios">
                <IconButton sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}>
                  <IconDownload className="w-5 h-5" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tab label={`Todos (${stats.total})`} />
            <Tab label={`Activos (${stats.activos})`} />
            <Tab label={`Inactivos (${stats.inactivos})`} />
            <Tab label={`Pendientes (${stats.pendientes})`} />
          </Tabs>
        </Paper>

        {/* Users Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f8f8" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Departamento</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Cargo</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Último Acceso</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "#722F37" }}>
                          {user.nombre[0]}
                          {user.apellido[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {user.nombre} {user.apellido}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <IconMail className="w-3 h-3" /> {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.departamento}</TableCell>
                    <TableCell>{user.cargo}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                        size="small"
                        sx={{
                          bgcolor: getRolColor(user.rol).bg,
                          color: getRolColor(user.rol).color,
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.estado.charAt(0).toUpperCase() + user.estado.slice(1)}
                        size="small"
                        color={getEstadoColor(user.estado) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.ultimoAcceso}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton component={Link} href={`/dashboard/users/editar/${user.id}`} size="small" sx={{ mr: 1 }}>
                          <IconEdit2 className="w-4 h-4" />
                        </IconButton>
                      </Tooltip>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                        <IconMoreVertical className="w-4 h-4" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>

        {/* Actions Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem component={Link} href={selectedUser ? `/dashboard/users/editar/${selectedUser.id}` : "#"}>
            <ListItemIcon>
              <IconEdit2 className="w-4 h-4" />
            </ListItemIcon>
            <ListItemText>Editar Usuario</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <IconTrash2 className="w-4 h-4 text-red-500" />
            </ListItemIcon>
            <ListItemText>Eliminar Usuario</ListItemText>
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <strong>
                {selectedUser?.nombre} {selectedUser?.apellido}
              </strong>
              ? Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}
