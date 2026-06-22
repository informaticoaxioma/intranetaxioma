import { useState, useEffect } from "react";

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
} from "@mui/material";

import {
  Search,
  PersonAdd,
  Edit,
  Delete,
  MoreVert,
  Group,
  Shield,
  Email,
  Download,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../../services/api";

const usersData = [
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
];

const getRolColor = (rol) => {
  switch (rol) {
    case "admin":
      return { bg: "#722F37", color: "#fff" };

    default:
      return { bg: "#E8E0D5", color: "#4A1C23" };
  }
};

const getEstadoColor = (estado_cuenta) => {
  switch (estado_cuenta) {
    case "activo":
      return "success";

    case "inactivo":
      return "error";

    default:
      return "warning";
  }
};

export default function UsersPage() {
  const navigate = useNavigate();

  //const [users, setUsers] = useState(usersData);
  const [users, setUsers] = useState([]);

  useEffect(() => {

      const loadUsers = async () => {

          try {

              const data = await getUsers();

              setUsers(data);

          } catch (error) {

              console.error("Error al cargar usuarios:", error);

          }
      };

      loadUsers();

  }, []);

  

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");

  const [filterDepartamento, setFilterDepartamento] = useState("");

  const [filterRol, setFilterRol] = useState("");

  const [filterEstado, setFilterEstado] = useState("");

  const [tabValue, setTabValue] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const departamentos = [
    ...new Set(usersData.map((u) => u.departamento)),
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartamento =
      !filterDepartamento ||
      user.departamento === filterDepartamento;

    const matchesRol =
      !filterRol ||
      user.role === filterRol;

    const matchesEstado =
      !filterEstado ||
      user.estado_cuenta === filterEstado;

    const matchesTab =
      tabValue === 0 ||
      (tabValue === 1 && user.estado_cuenta === "activo") ||
      (tabValue === 2 && user.estado_cuenta === "inactivo") ||
      (tabValue === 3 && user.estado_cuenta === "pendiente");

    return (
      matchesSearch &&
      matchesDepartamento &&
      matchesRol &&
      matchesEstado &&
      matchesTab
    );
  });

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {

      if (!selectedUser) return;

      try {

          await deleteUser(
              selectedUser.id
          );

          setUsers(
              users.filter(
                  (u) =>
                      u.id !== selectedUser.id
              )
          );

          setSnackbar({
              open: true,
              message: "Usuario eliminado correctamente",
              severity: "success",
          });

      } catch (error) {

          setSnackbar({
              open: true,
              message: error.message,
              severity: "error",
          });

          console.error(error);
      }

      setDeleteDialogOpen(false);
      setSelectedUser(null);
  };

  const stats = {
    total: users.length,

    activos: users.filter(
      (u) => u.estado_cuenta === "activo"
    ).length,

    inactivos: users.filter(
      (u) => u.estado_cuenta === "inactivo"
    ).length,

    pendientes: users.filter(
      (u) => u.estado_cuenta === "pendiente"
    ).length,
  };

  return (
    
    <Box className="max-w-[1400px] mx-auto p-6">

      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: "#4A1C23",
              fontWeight: 700,
            }}
          >
            Gestión de Usuarios
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 0.5 }}
          >
            Administra los usuarios de la intranet corporativa
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() =>
            navigate("/dashboard/users/create")
          }
            className="!bg-[#6a1936] hover:!bg-[#4a1025]"
        >
          Nuevo Usuario
        </Button>

      </Box>

      {/* FILTROS */}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            placeholder="Buscar usuario..."
            size="small"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            sx={{ minWidth: 300 }}

          />

          <FormControl
            size="small"
            sx={{ minWidth: 180 }}
          >
            <InputLabel>
              Departamento
            </InputLabel>

            <Select
              value={filterDepartamento}
              label="Departamento"
              onChange={(e) =>
                setFilterDepartamento(
                  e.target.value
                )
              }
            >
              <MenuItem value="">
                Todos
              </MenuItem>

              {departamentos.map((dep) => (
                <MenuItem
                  key={dep}
                  value={dep}
                >
                  {dep}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* TABS */}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
        >
          <Tab
            label={`Todos (${stats.total})`}
          />

          <Tab
            label={`Activos (${stats.activos})`}
          />

          <Tab
            label={`Inactivos (${stats.inactivos})`}
          />

          <Tab
            label={`Pendientes (${stats.pendientes})`}
          />
        </Tabs>
      </Paper>

      {/* TABLA */}

      <Paper>
        <TableContainer>
          <Table>

            <TableHead>
              <TableRow>
                <TableCell>
                  Usuario
                </TableCell>

                <TableCell>
                  Departamento
                </TableCell>

                <TableCell>
                  Cargo
                </TableCell>

                <TableCell>
                  Rol
                </TableCell>

                <TableCell>
                  Estado
                </TableCell>

                <TableCell align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers
                .slice(
                  page * rowsPerPage,
                  page * rowsPerPage +
                    rowsPerPage
                )
                .map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                  >
                    <TableCell>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#722F37",
                          }}
                        >
                          {user.name[0]}
                          {user.apellido[0]}
                        </Avatar>

                        <Box>
                          <Typography
                            fontWeight={600}
                          >
                            {user.name}{" "}
                            {user.apellido}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {user.email} {user.rut && `| RUT: ${user.rut}`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {user.departamento}
                    </TableCell>

                    <TableCell>
                      {user.cargo}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        sx={{
                          bgcolor:
                            getRolColor(user.role).bg,
                          color:
                            getRolColor(user.role)
                              .color,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={user.estado_cuenta}
                        size="small"
                        color={getEstadoColor(
                          user.estado_cuenta
                        )}
                      />
                    </TableCell>

                    <TableCell align="right">

                      <IconButton
                        onClick={() =>
                          navigate(
                            `/dashboard/users/editar/${user.id}`
                          )
                        }
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        onClick={(e) =>
                          handleMenuOpen(
                            e,
                            user
                          )
                        }
                      >
                        <MoreVert />
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
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) =>
            setPage(newPage)
          }
          onRowsPerPageChange={(e) => {
            setRowsPerPage(
              parseInt(e.target.value, 10)
            );

            setPage(0);
          }}
        />
      </Paper>

      {/* MENU */}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() =>
            navigate(
              `/dashboard/users/editar/${selectedUser?.id}`
            )
          }
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>

          <ListItemText>
            Editar Usuario
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleDeleteClick}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <Delete
              fontSize="small"
              color="error"
            />
          </ListItemIcon>

          <ListItemText>
            Eliminar Usuario
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* DIALOG */}

      <Dialog
        open={deleteDialogOpen}
        onClose={() =>
          setDeleteDialogOpen(false)
        }
      >
        <DialogTitle>
          Confirmar Eliminación
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            ¿Deseas eliminar al usuario{" "}
            <strong>
              {selectedUser?.name}{" "}
              {selectedUser?.apellido}
            </strong>
            ?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setDeleteDialogOpen(false)
            }
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false,
          })
        }
      >
        <Alert
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar({
              ...snackbar,
              open: false,
            })
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
