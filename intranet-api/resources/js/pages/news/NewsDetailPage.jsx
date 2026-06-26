import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNewsById, updateNews } from "../../services/api";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import Chip from "@mui/material/Chip"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton"
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { Avatar, TextField } from "@mui/material"

function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}



export default function NewsDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  console.log("Params:", params);
  console.log("ID:", params);



  const [noticia, setNoticia] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    titulo: "",
    resumen: "",
    texto_noticia: "",
    categoria: "",
    autor: "",
    created_at: "",
    path_imagen: "",
  });

  const [errors, setErrors] = useState({});

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const id = params.id

  useEffect(() => {
    if (!id) return;
    const loadNews = async () => {
      try {
        console.log("Consultando noticia:", id);
        const data = await getNewsById(id);
        console.log("Noticia obtenida:", data);
        setNoticia(data);

        setFormData({
          titulo: data.titulo || "",
          resumen: data.resumen || "",
          texto_noticia: data.texto_noticia || "",
          categoria: data.categoria || "",
          autor: data.autor || "",
          path_imagen: data.path_imagen || "",
        });

      } catch (error) {

        console.error("Error cargando noticia:", error);

      }

    };

    loadNews();

  }, [id]);

  const handleSave = async () => {

    try {
      const response =
        await updateNews(
          noticia.id,
          formData
        );

      console.log("RESPUESTA: ", response);
      setFormData(
        response
      );
      setIsEditing(false);
      setSnackbar({
        open: true,
        message:
          "Noticia actualizada correctamente",
        severity: "success",
      });

    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message:
          error.message,
        severity: "error",
      });
    }
  };


  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };



  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Navegación */}
      <Box sx={{ mb: 3 }}>
        <Button
          onClick={() => navigate("/dashboard/news")}
          startIcon={<ArrowLeftIcon />}
          sx={{ color: "primary.main" }}
        >
          Volver a noticias
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {isEditing ? "Editar Noticia" : formData.titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {params.id}
            </Typography>
          </Box>

          {!isEditing ? (
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              sx={{
                textTransform: "none",
                backgroundColor: "#6a1936",
                fontWeight: 600,
              }}
            >
              Editar
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
          )}
        </Box>

      </Box>

      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", lg: "row" } }}>
        {/* Contenido Principal */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ overflow: "hidden", borderRadius: 4 }}>
            {/* Imagen */}
            <CardMedia
              component="img"
              sx={{
                height: 300,
                objectFit: "cover",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
              image={formData.path_imagen
                ? `http://127.0.0.1:8000/storage/${formData.path_imagen}`
                : "https://picsum.photos/600/300"
              }
              alt={formData.titulo}
            />

            {/* Contenido */}
            <Box sx={{ p: 4 }}>
              {!isEditing ? (
                <>
                  {/* Categoría + Fecha */}
                  <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}>
                    <Chip label={formData.categoria} color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      {formData.created_at?.substring(0, 10)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 4 }} />


                  {/* Título */}
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, mb: 2, color: "primary.dark" }}
                  >
                    {formData.titulo}
                  </Typography>

                  {/* Resumen */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "text.secondary",
                      mb: 4,
                      fontStyle: "italic",
                      borderLeft: "4px solid",
                      borderColor: "primary.main",
                      pl: 2,
                    }}
                  >
                    {formData.resumen}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                    >
                      {formData.autor}
                    </Avatar>

                    <Box>
                      <Typography fontWeight="bold">
                        {formData.autor}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 4 }} />

                  {/* Contenido */}
                  <Box>
                    {formData.texto_noticia
                      ?.split("\n")
                      .filter((p) => p.trim() !== "")
                      .map((p, i) => (
                        <Typography
                          key={i}
                          sx={{
                            mb: 2,
                            lineHeight: 1.8,
                            color: "text.primary",
                          }}
                        >
                          {p}
                        </Typography>
                      ))}
                  </Box>
                </>
              ) : (
                <>
                  {/* Título edición */}
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, mb: 3, color: "primary.dark" }}
                  >
                    Editar Noticia
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Título"
                        value={formData.titulo}
                        onChange={(e) => handleChange("titulo", e.target.value)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Resumen"
                        multiline
                        rows={4}
                        value={formData.resumen}
                        onChange={(e) => handleChange("resumen", e.target.value)}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Texto"
                        multiline
                        rows={6}
                        value={formData.texto_noticia}
                        onChange={(e) => handleChange("texto_noticia", e.target.value)}
                      />
                    </Grid>


                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormControl fullWidth>
                        <InputLabel>Categoría</InputLabel>
                        <Select
                          value={formData.categoria}
                          label="Categoría"
                          onChange={(e) =>
                            handleChange("categoria", e.target.value)
                          }
                        >
                          <MenuItem value="Recursos Humanos">
                            Recursos Humanos
                          </MenuItem>
                          <MenuItem value="Finanzas">Finanzas</MenuItem>
                          <MenuItem value="Corporativo">Corporativo</MenuItem>
                          <MenuItem value="Formación">Formación</MenuItem>
                          <MenuItem value="Eventos">Eventos</MenuItem>
                          <MenuItem value="Tecnología">Tecnología</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Autor"
                        value={formData.autor}
                        onChange={(e) => handleChange("autor", e.target.value)}
                      />
                    </Grid>
                  </Grid>

                  {/* Botones */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 2,
                      mt: 4,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>

                    <Button
                      variant="contained"
                      onClick={handleSave}
                      sx={{
                        textTransform: "none",
                        backgroundColor: "#6a1936",
                        fontWeight: 600,
                        "&:hover": { backgroundColor: "#4a1025" },
                      }}
                    >
                      Guardar Cambios
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Sidebar */}
        <Box sx={{ width: { xs: "100%", lg: 320 }, flexShrink: 0 }}>
          {/* Noticias Relacionadas */}

          {/* Información de contacto */}
          <Card sx={{ bgcolor: "primary.main" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
                ¿Tienes una noticia?
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", mb: 3 }}>
                Si tienes información relevante para compartir con la empresa, contáctanos.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  "&:hover": { bgcolor: "secondary.main" },
                }}
              >
                Enviar noticia
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}