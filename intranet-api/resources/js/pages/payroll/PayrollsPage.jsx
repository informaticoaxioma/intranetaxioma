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
import { getPayrolls, downloadPayroll, previewPayroll } from "../../services/api";

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

export default function PayrollsPage() {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("")
    const [vistaMode, setVistaMode] = useState("list")
    const [payrolls, setPayrolls] = useState([]);

    const payrollsFiltrados =
        payrolls.filter((payroll) => {

            return (

                payroll.titulo
                    ?.toLowerCase()
                    .includes(
                        busqueda.toLowerCase()
                    )

                ||

                payroll.user?.name
                    ?.toLowerCase()
                    .includes(
                        busqueda.toLowerCase()
                    )
            );
        });


    const handleDownload = async (id,archivo) => {
        try {
            await downloadPayroll(id, archivo);
        } catch (error) {
            console.error(error);
            setSnackbar({
                open: true,
                message:
                    "Error al descargar la liquidación",
                severity: "error",
            });
        }
    };

    const getFileType = (path) => {
        return path?.split(".").pop()?.toUpperCase() || "N/A";
    };

    useEffect(() => {

        const loadPayrolls = async () => {

            try {

                const data =
                    await getPayrolls();

                setPayrolls(data);

            } catch (error) {

                console.error(error);
            }
        };

        loadPayrolls();

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
            Liquidaciones
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
            Centro de Liquidaciones de Sueldo
          </Typography>

          <Typography className="text-gray-500 mt-1">
            Accede a las liquidaciones de sueldo de todos los colaboradores
          </Typography>
        </Box>

        <Button
          variant="contained"
          className="!bg-[#6a1936] hover:!bg-[#4a1025]"
           component={Link}
            to="/dashboard/payrolls/crear"
        >
          Subir Liquidación
        </Button>
      </Box>


      {/* FILTROS */}
      <Box className="flex flex-col lg:flex-row justify-between gap-4 mb-6">


        <Box className="flex items-center gap-3">

          <TextField
            size="small"
            placeholder="Buscar liquidaciones..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />


        </Box>
      </Box>

      {/* TABLA */}
      {vistaMode === "list" ? (
        <TableContainer component={Paper}>

          <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        Liquidación
                    </TableCell>

                    <TableCell>
                        Colaborador
                    </TableCell>

                    <TableCell>
                        Período
                    </TableCell>

                    <TableCell>
                        Tamaño
                    </TableCell>

                    <TableCell>
                        Fecha Modificación
                    </TableCell>

                    <TableCell>
                        Acciones
                    </TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
              {payrollsFiltrados.map((payroll) => (
                <TableRow
                    key={payroll.id}
                >
                    <TableCell>
                        <Box className="flex items-center gap-3">
                            <FileIcon type="PDF" />
                            <Box>
                                <Typography
                                    className="font-semibold text-[#4A1C23]"
                                >
                                    {payroll.titulo}
                                </Typography>

                                <Chip
                                    label="PDF"
                                    size="small"
                                />
                            </Box>
                        </Box>
                    </TableCell>
                    <TableCell>
                        {payroll.user?.name}
                    </TableCell>
                    <TableCell>
                        {
                            payroll.periodo
                                ?.substring(0, 7)
                        }
                    </TableCell>
                    <TableCell>
                        {
                            (
                                payroll.tamano_archivo /
                                1024
                            ).toFixed(1)
                        } KB
                    </TableCell>
                    <TableCell>
                        {
                            payroll.updated_at
                                ?.substring(0, 10)
                        }
                    </TableCell>
                  <TableCell>
                    <Box className="flex items-center gap-1">

                    <Tooltip title="Vista previa">
                      <IconButton
                          onClick={() =>
                              previewPayroll(
                                  payroll.id
                              )
                          }
                      >
                          <Eye size={18} />
                      </IconButton>
                    </Tooltip>

                      <Tooltip title="Descargar">
                        <IconButton
                            onClick={() =>
                                handleDownload(
                                    payroll.id,
                                    payroll.archivo
                                )
                            }
                        >
                            <Download size={18} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Editar">
                          <IconButton
                              onClick={() =>
                                  navigate(
                                      `/dashboard/payrolls/editar/${payroll.id}`
                                  )
                              }
                          >
                              <Edit size={18} />
                          </IconButton>
                      </Tooltip>

                    </Box>

                  </TableCell>

                </TableRow>
              ))}

            </TableBody>

          </Table>

        </TableContainer>
      ) : (
        <Grid container spacing={2}>

          {documentosFiltrados.map((doc) => (
            <Grid key={doc.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, }} >

              <Card className="hover:-translate-y-1 transition-all duration-200 h-full">

                <CardContent>


                  <Typography className="font-semibold text-[#4A1C23] mb-2">
                    {doc.nombre}
                  </Typography>

                  <Chip
                    label={doc.categoria}
                    size="small"
                    className="mb-3"
                  />

                  <Box className="flex justify-between text-sm text-gray-500">
                    <span>{doc.tamano_archivo}</span>
                    <span>{doc.updated_at}</span>
                  </Box>

                  <Box className="flex justify-end gap-1 mt-4">

                    <IconButton>
                      <IconEye size={18} />
                    </IconButton>

                    <IconButton>
                      <IconDownload size={18} />
                    </IconButton>

                  </Box>

                </CardContent>

              </Card>

            </Grid>
          ))}

        </Grid>
      )}
    </Box>
  )
}