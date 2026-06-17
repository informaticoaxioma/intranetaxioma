import { useState, useEffect } from "react"
import {
  Eye,
  Download,
  Edit,
} from "lucide-react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Breadcrumbs,
  Tooltip,
  Button,
} from "@mui/material"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { getVacations, approveVacation , rejectVacation} from "../../services/api";

// ==========================
// ICONOS CUSTOM
// ==========================

function FolderIcon({ color = "currentColor" }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill={color}>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  )
}

function FileIcon({ type }) {
  const colors = {
    pdf: "#E53935",
    doc: "#1E88E5",
    docx: "#1E88E5",
    xls: "#43A047",
    xlsx: "#43A047",
    ppt: "#FB8C00",
    pptx: "#FB8C00",
    img: "#8E24AA",
    zip: "#6D4C41",
    default: "#722F37",
  }

  const color = colors[type] || colors.default

  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" fill={`${color}20`} />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />

      <text x="12" y="16" textAnchor="middle" fontSize="6" fill={color} fontWeight="bold">
        {type.toUpperCase()}
      </text>
    </svg>
  )
}

// ==========================
// COMPONENTE
// ==========================

export default function VacationsPage() {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("")
    const [vacations, setVacations] = useState([]);


    const vacationsFiltrados =
        vacations.filter((vacation) => {

            return (

                vacation.titulo
                    ?.toLowerCase()
                    .includes(
                        busqueda.toLowerCase()
                    )

                ||

                vacation.user?.name
                    ?.toLowerCase()
                    .includes(
                        busqueda.toLowerCase()
                    )
            );
        });


    const handleApprove = async (id) => {

        try {

            await approveVacation(id);

            const data =
                await getVacations();

            setVacations(data);

        } catch (error) {

            console.error(error);
        }
    };

    const handleReject = async (id) => {

        try {

            await rejectVacation(id);

            const data =
                await getVacations();

            setVacations(data);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        const loadVacations = async () => {

            try {

                const data =
                    await getVacations();

                setVacations(data);

            } catch (error) {

                console.error(error);
            }
        };

        loadVacations();

    }, []);

  return (
    <Box className="p-6 max-w-[1400px] mx-auto">

      {/* HEADER */}
        <Breadcrumbs className="mb-4">
        <Link
            to="/dashboard"
            className="text-gray-500 hover:underline"
        >
            Inicio
        </Link>

        <Typography color="text.primary">
            Vacaciones
        </Typography>
        </Breadcrumbs>

      <Box
        className="flex flex-wrap justify-between items-center gap-4 mb-8"
      >
        <Box>
          <Typography
            variant="h4"
            className="font-bold text-[#4A1C23]"
          >
            Centro de Solicitudes de Vacaciones
          </Typography>

          <Typography className="text-gray-500 mt-1">
            Accede a las solicitudes de vacaciones del Axioma
          </Typography>
        </Box>

      </Box>


      {/* FILTROS */}
      <Box className="flex flex-col lg:flex-row justify-between gap-4 mb-6">


        <Box className="flex items-center gap-3">

          <TextField
            size="small"
            placeholder="Buscar solicitudes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />


        </Box>
      </Box>
        <TableContainer component={Paper}>
            <Table>

                <TableHead>
                    <TableRow>

                        <TableCell>
                            Colaborador
                        </TableCell>

                        <TableCell>
                            Fecha Inicio
                        </TableCell>

                        <TableCell>
                            Fecha Fin
                        </TableCell>

                        <TableCell>
                            Días
                        </TableCell>

                        <TableCell>
                            Comentario
                        </TableCell>

                        <TableCell>
                            Estado
                        </TableCell>

                        <TableCell>
                            Aprobado Por
                        </TableCell>

                        <TableCell>
                            Comentario Administrador
                        </TableCell>

                        <TableCell align="center">
                            Acciones
                        </TableCell>

                    </TableRow>
                </TableHead>

                <TableBody>

                    {vacationsFiltrados.map((vacation) => (

                        <TableRow key={vacation.id} hover>

                            <TableCell>
                                {vacation.user?.name}
                            </TableCell>

                            <TableCell>
                                {vacation.fecha_inicio}
                            </TableCell>

                            <TableCell>
                                {vacation.fecha_fin}
                            </TableCell>

                            <TableCell>
                                {vacation.dias_solicitados}
                            </TableCell>

                            <TableCell>
                                {vacation.comentario}
                            </TableCell>

                            <TableCell>

                                <Chip
                                    label={vacation.estado}
                                    color={
                                        vacation.estado === "aprobado"
                                            ? "success"
                                            : vacation.estado === "rechazado"
                                            ? "error"
                                            : "warning"
                                    }
                                    size="small"
                                />

                            </TableCell>

                            <TableCell>
                                {vacation.aprobado_por || "-"}
                            </TableCell>

                            <TableCell>
                                {vacation.comentario_admin || "-"}
                            </TableCell>

                            <TableCell>

                                <Box
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                    "
                                >

                                    {vacation.estado === "pendiente" && (
                                        <>
                                            <Tooltip title="Aprobar">

                                                <IconButton
                                                    color="success"
                                                    onClick={() =>
                                                        handleApprove(
                                                            vacation.id
                                                        )
                                                    }
                                                >
                                                    ✓
                                                </IconButton>

                                            </Tooltip>

                                            <Tooltip title="Rechazar">

                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        handleReject(
                                                            vacation.id
                                                        )
                                                    }
                                                >
                                                    ✕
                                                </IconButton>

                                            </Tooltip>
                                        </>
                                    )}

                                </Box>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>
        </TableContainer>
    </Box>
  )
}