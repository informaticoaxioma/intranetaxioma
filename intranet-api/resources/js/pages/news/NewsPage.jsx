import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getNews } from "../../services/api";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Grid,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { createNews } from "../../services/api";



const categorias = [
  "Todas",
  "Recursos Humanos",
  "Finanzas",
  "Corporativo",
  "Formación",
  "Eventos",
  "Tecnología",
];

export default function NoticiasPage() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {

    const loadNews = async () => {

      try {

        const data = await getNews();

        console.log("Noticias API:", data);

        setNoticias(data);

      } catch (error) {

        console.error(error);

      }
    };

    loadNews();

  }, []);
  

  const [form, setForm] = useState({
    titulo: "",
    resumen: "",
    texto: "",
    categoria: "",
    autor: "",
    imagen: null,
  });

  const noticiasFiltradas = noticias.filter((noticia) => {
    const matchCategoria =
      tabValue === 0 ||
      noticia.categoria === categorias[tabValue];

    const matchBusqueda =
      noticia.titulo
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      noticia.resumen
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    return matchCategoria && matchBusqueda;
  });

  const noticiasDestacadas = noticias.filter(
    (n) => n.destacada
  );

  const handleCreateNews = async () => {

      try {

          const formData = new FormData();

          formData.append("titulo", form.titulo);
          formData.append("resumen", form.resumen);

          // Debe coincidir con el nombre de tu columna Laravel
          formData.append("texto_noticia", form.texto);

          formData.append("categoria", form.categoria);
          formData.append("autor", form.autor);

          if (form.imagen) {
              formData.append("imagen", form.imagen);
          }

          const response = await createNews(formData);

          console.log("Noticia creada:", response);

          alert("Noticia creada correctamente");

          setForm({
              titulo: "",
              resumen: "",
              texto: "",
              categoria: "",
              autor: "",
              imagen: null,
          });

          setOpenModal(false);

      } catch (error) {

          console.error("Error creando noticia:", error);

          alert(error.message || "Error al crear noticia");
      }
  };

  return (
    <Box className="max-w-[1400px] mx-auto p-6">

      {/* HEADER */}
      <Box className="flex flex-wrap justify-between items-center gap-4 mb-8">

        <Box>
          <Typography
            variant="h4"
            className="font-bold text-[#4A1C23]"
          >
            Noticias Corporativas
          </Typography>

          <Typography className="text-gray-500 mt-2">
            Mantente informado sobre las novedades
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
          className="!bg-[#6a1936] hover:!bg-[#4a1025]"
        >
          Nueva noticia
        </Button>

      </Box>

      {/* DESTACADAS */}
      <Box className="mb-8">

        <Typography
          variant="h6"
          className="font-semibold mb-4 text-[#4A1C23]"
        >
          Destacadas
        </Typography>

        <Grid container spacing={3}>

          {noticiasDestacadas.map((noticia) => (

            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={noticia.id} >

              <Card className="h-full">

                <CardActionArea
                  onClick={() => navigate(`/dashboard/news/${noticia.id}`)}
                  className="h-full flex flex-col items-stretch"
                >

                  <CardMedia
                    component="img"
                    height="180"
                    image="https://picsum.photos/600/300?1"
                    alt={noticia.titulo}
                  />

                  <CardContent>

                    <Box className="flex gap-2 mb-3">

                      <Chip
                        label={noticia.categoria}
                        color="primary"
                        size="small"
                      />

                      <Chip
                        label="Destacada"
                        size="small"
                      />

                    </Box>

                    <Typography
                      variant="h6"
                      className="font-semibold mb-2 text-[#4A1C23]"
                    >
                      {noticia.titulo}
                    </Typography>

                    <Typography className="text-gray-500 mb-4">
                      {noticia.resumen}
                    </Typography>

                    <Box className="flex justify-between">

                      <Typography variant="caption">
                        {noticia.autor}
                      </Typography>

                      <Typography variant="caption">
                        {noticia.fecha}
                      </Typography>

                    </Box>

                  </CardContent>

                </CardActionArea>

              </Card>

            </Grid>
          ))}
        </Grid>
      </Box>

    <Box
    sx={{
        display: "flex",
        gap: 2,
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        marginTop:4,
    }}
    >
    <Box sx={{ flex: 3 }}>
        <Tabs
        value={tabValue}
        onChange={(_, value) => setTabValue(value)}
        variant="scrollable"
        scrollButtons="auto"
        >
        {categorias.map((cat) => (
            <Tab key={cat} label={cat} />
        ))}
        </Tabs>
    </Box>

    <Box sx={{ flex: 1 }}>
        <TextField
        fullWidth
        size="small"
        placeholder="Buscar noticias..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        InputProps={{
            startAdornment: (
            <InputAdornment position="start">
                <SearchIcon />
            </InputAdornment>
            ),
        }}
        />
    </Box>
    </Box>

      {/* LISTA */}
      <Grid container spacing={3} >

        {noticiasFiltradas.map((noticia) => (

          <Grid size={{ xs: 12, md: 4 }}>

            <Card className="h-full">

              <CardActionArea
                  onClick={() => navigate(`/dashboard/news/${noticia.id}`)}
                  className="h-full flex flex-col items-stretch"
              >

                <CardMedia
                  component="img"
                  height="140"
                  image="https://picsum.photos/600/300?1"
                  alt={noticia.titulo}
                />

                <CardContent className="flex flex-col flex-1">

                  <Box className="mb-2">

                    <Chip
                      label={noticia.categoria}
                      size="small"
                      variant="outlined"
                    />

                  </Box>

                  <Typography
                    className="font-semibold mb-2 text-[#4A1C23]"
                  >
                    {noticia.titulo}
                  </Typography>

                  <Typography className="text-gray-500 flex-1">
                    {noticia.resumen}
                  </Typography>

                  <Box className="flex justify-between mt-4">

                    <Typography variant="caption">
                      {noticia.autor}
                    </Typography>

                    <Typography variant="caption">
                      {noticia.fecha}
                    </Typography>

                  </Box>

                </CardContent>

              </CardActionArea>

            </Card>

          </Grid>
        ))}
      </Grid>

      {/* PAGINACION */}
      <Box className="flex justify-center mt-8">
        <Pagination count={3} color="primary" />
      </Box>

      {/* MODAL */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >

        <DialogTitle>
          Nueva Noticia
        </DialogTitle>

        <DialogContent>

          <Stack spacing={3} className="mt-4">

            <TextField
              label="Título"
              fullWidth
              value={form.titulo}
              onChange={(e) =>
                setForm({
                  ...form,
                  titulo: e.target.value,
                })
              }
            />

            <TextField
              label="Resumen"
              fullWidth
              multiline
              rows={3}
              value={form.resumen}
              onChange={(e) =>
                setForm({
                  ...form,
                  resumen: e.target.value,
                })
              }
            />

            <TextField
              label="Texto"
              fullWidth
              multiline
              rows={4}
              value={form.texto}
              onChange={(e) =>
                setForm({
                  ...form,
                  texto: e.target.value,
                })
              }
            />

            <FormControl fullWidth>

              <InputLabel>
                Categoría
              </InputLabel>

              <Select
                value={form.categoria}
                label="Categoría"
                onChange={(e) =>
                  setForm({
                    ...form,
                    categoria: e.target.value,
                  })
                }
              >
                <MenuItem value="Recursos Humanos">
                  Recursos Humanos
                </MenuItem>

                <MenuItem value="Finanzas">
                  Finanzas
                </MenuItem>

                <MenuItem value="Tecnología">
                  Tecnología
                </MenuItem>

              </Select>

            </FormControl>

            <TextField
              label="Autor"
              fullWidth
              value={form.autor}
              onChange={(e) =>
                setForm({
                  ...form,
                  autor: e.target.value,
                })
              }
            />

            <Button
              variant="outlined"
              component="label"
            >
              Subir Imagen

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    setForm({
                      ...form,
                      imagen: file,
                    });
                  }
                }}
              />

            </Button>

          </Stack>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => setOpenModal(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateNews}
            className="!bg-[#6a1936] hover:!bg-[#4a1025]"
          >
            Guardar
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}
