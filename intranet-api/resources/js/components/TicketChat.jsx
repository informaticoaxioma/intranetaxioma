import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Paper,
  Divider,
} from "@mui/material";

import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Image as ImageIcon,
  ZoomIn as ZoomInIcon,
  SupportAgent as SupportAgentIcon,
  Person as PersonIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
} from "@mui/icons-material";

import { getTicketMessages, sendTicketMessage } from "../services/api";
import { renderTextWithLinks } from "./LinkifiedText";

const statusConfig = {
  pendiente: { label: "Pendiente", color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
  en_proceso: { label: "En Proceso", color: "#1d4ed8", bg: "#dbeafe", border: "#bfdbfe" },
  resuelto: { label: "Resuelto", color: "#15803d", bg: "#dcfce7", border: "#bbf7d0" },
  cerrado: { label: "Cerrado", color: "#475569", bg: "#f1f5f9", border: "#e2e8f0" },
};

/**
 * Componente de Chat y Seguimiento de Tickets
 * Puede utilizarse tanto dentro de modales como incrustado en vistas.
 */
export default function TicketChat({
  ticket,
  onClose,
  isModal = true,
  onMessageSent,
  onMessagesRead,
}) {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [previewZoomImage, setPreviewZoomImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const loadMessages = async () => {
    if (!ticket?.id) return;
    try {
      setLoading(true);
      const data = await getTicketMessages(ticket.id);
      setMessages(data);
      if (onMessagesRead) {
        onMessagesRead(ticket.id);
      }
    } catch (err) {
      console.error("Error al cargar mensajes del ticket:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [ticket?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const handleClearFile = () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() && !selectedFile) return;

    try {
      setSending(true);

      let payload;
      if (selectedFile) {
        payload = new FormData();
        payload.append("message", inputMessage.trim());
        payload.append("attachment", selectedFile);
      } else {
        payload = { message: inputMessage.trim() };
      }

      const res = await sendTicketMessage(ticket.id, payload);
      setMessages((prev) => [...prev, res.ticket_message]);
      setInputMessage("");
      handleClearFile();

      if (onMessageSent) {
        onMessageSent(res.ticket_message);
      }
    } catch (err) {
      console.error("Error enviando mensaje:", err);
      alert(err.message || "Error al enviar el mensaje.");
    } finally {
      setSending(false);
    }
  };

  const statusStyle = statusConfig[ticket?.status] || {
    label: ticket?.status || "Pendiente",
    color: "#475569",
    bg: "#f1f5f9",
    border: "#cbd5e1",
  };

  const content = (
    <Box sx={{ display: "flex", flexDirection: "column", height: isModal ? "75vh" : "600px", minHeight: "450px" }}>
      {/* HEADER DEL TICKET CHAT */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #E8E0D5",
          bgcolor: "#FAF7F2",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Chip
            icon={<ConfirmationNumberIcon sx={{ fontSize: "16px !important", color: "#722F37 !important" }} />}
            label={ticket?.code || `AXM-${ticket?.id}`}
            sx={{
              fontWeight: 800,
              bgcolor: "rgba(114, 47, 55, 0.08)",
              color: "#722F37",
              border: "1px solid rgba(114, 47, 55, 0.25)",
              borderRadius: 1.5,
              fontSize: "0.85rem",
            }}
          />
          <Chip
            size="small"
            label={statusStyle.label}
            sx={{
              fontWeight: 700,
              color: statusStyle.color,
              bgcolor: statusStyle.bg,
              border: `1px solid ${statusStyle.border}`,
            }}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b", maxWidth: 350, noWrap: true, textOverflow: "ellipsis", overflow: "hidden" }}>
            {ticket?.title}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Actualizar conversación">
            <IconButton size="small" onClick={loadMessages} disabled={loading} sx={{ color: "#722F37" }}>
              <RefreshIcon fontSize="small" className={loading ? "animate-spin" : ""} />
            </IconButton>
          </Tooltip>
          {onClose && (
            <IconButton size="small" onClick={onClose} sx={{ color: "#64748b" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* ÁREA DE MENSAJES CON HISTORIAL */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2.5,
          bgcolor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* REPORTE INICIAL DEL TICKET */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "#FAF7F2",
            border: "1px solid #E8E0D5",
            borderLeft: "4px solid #722F37",
            borderRadius: 2,
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#722F37", textTransform: "uppercase" }}>
              📌 Requerimiento Original Reportado
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {ticket?.created_at ? new Date(ticket.created_at).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" }) : ""}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {renderTextWithLinks(ticket?.description)}
          </Typography>

          {/* Fotografía inicial si existe */}
          {ticket?.imagen_url && (
            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px dashed #E8E0D5", display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                component="img"
                src={ticket.imagen_url}
                alt="Evidencia inicial"
                onClick={() => setPreviewZoomImage(ticket.imagen_url)}
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1.5,
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "1px solid #cbd5e1",
                  "&:hover": { transform: "scale(1.05)", borderColor: "#722F37" },
                }}
              />
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#4A1C23", display: "block" }}>
                  Fotografía adjunta inicial
                </Typography>
                <Typography
                  variant="caption"
                  onClick={() => setPreviewZoomImage(ticket.imagen_url)}
                  sx={{ color: "#722F37", cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}
                >
                  Ver imagen ampliada
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>

        <Divider sx={{ my: 0.5, "&::before, &::after": { borderColor: "#E8E0D5" } }}>
          <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, px: 1 }}>
            Seguimiento y Conversación
          </Typography>
        </Divider>

        {loading && messages.length === 0 ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress size={28} sx={{ color: "#722F37" }} />
            <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mt: 1 }}>
              Cargando historial de mensajes...
            </Typography>
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center", bgcolor: "#ffffff", borderRadius: 2, border: "1px dashed #cbd5e1", p: 3 }}>
            <SupportAgentIcon sx={{ fontSize: 36, color: "#94a3b8", mb: 0.5 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569" }}>
              Sin observaciones adicionales aún
            </Typography>
            <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mt: 0.5 }}>
              {currentUser?.role === "admin"
                ? "Escribe un mensaje para responder o consultar al colaborador."
                : "Puedes dejar preguntas, aclaraciones o comentarios al equipo de soporte."}
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_id === currentUser?.id;
            const isAdmin = Boolean(msg.is_admin_reply || msg.user?.role === "admin");

            return (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  flexDirection: isMe ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  gap: 1.5,
                  maxWidth: "100%",
                }}
              >
                {/* AVATAR */}
                <Avatar
                  src={msg.user?.path_foto_perfil || msg.user?.foto_perfil}
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: isAdmin ? "#722F37" : "#0284c7",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {msg.user?.name?.[0] || "U"}
                </Avatar>

                {/* BURBUJA DE MENSAJE */}
                <Box
                  sx={{
                    maxWidth: { xs: "85%", sm: "75%" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  {/* ENCABEZADO DE MENSAJE (NOMBRE + BADGE + HORA) */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.4 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
                      {isMe ? "Tú" : `${msg.user?.name || "Usuario"} ${msg.user?.apellido || ""}`}
                    </Typography>
                    {isAdmin && (
                      <Chip
                        size="small"
                        label="Soporte TI"
                        sx={{
                          height: 16,
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          bgcolor: "#722F37",
                          color: "#ffffff",
                          px: 0.3,
                        }}
                      />
                    )}
                    <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.68rem" }}>
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleTimeString("es-CL", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                          })
                        : ""}
                    </Typography>
                  </Box>

                  {/* CUERPO DEL MENSAJE */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.8,
                      borderRadius: 2.5,
                      borderTopRightRadius: isMe ? 0.5 : 2.5,
                      borderTopLeftRadius: !isMe ? 0.5 : 2.5,
                      bgcolor: isMe ? "#722F37" : "#ffffff",
                      color: isMe ? "#ffffff" : "#1e293b",
                      border: isMe ? "none" : "1px solid #e2e8f0",
                      boxShadow: isMe ? "0 4px 12px rgba(114, 47, 55, 0.2)" : "0 2px 6px rgba(0,0,0,0.03)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        lineHeight: 1.55,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        color: isMe ? "#ffffff" : "#1e293b",
                        "& a": {
                          color: isMe ? "#fef08a" : "#722F37",
                          fontWeight: 600,
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {renderTextWithLinks(msg.message)}
                    </Typography>

                    {/* ADJUNTO / IMAGEN */}
                    {msg.attachment_url && (
                      <Box sx={{ mt: 1.5 }}>
                        {msg.attachment_path?.match(/\.(jpe?g|png|gif|webp)$/i) ? (
                          <Box
                            component="img"
                            src={msg.attachment_url}
                            alt="Adjunto"
                            onClick={() => setPreviewZoomImage(msg.attachment_url)}
                            sx={{
                              maxWidth: "100%",
                              maxHeight: 200,
                              borderRadius: 1.5,
                              cursor: "pointer",
                              border: "1px solid rgba(255,255,255,0.2)",
                              display: "block",
                              "&:hover": { opacity: 0.95 },
                            }}
                          />
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            href={msg.attachment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<AttachFileIcon sx={{ fontSize: 16 }} />}
                            sx={{
                              color: isMe ? "#ffffff" : "#722F37",
                              borderColor: isMe ? "rgba(255,255,255,0.4)" : "#722F37",
                              fontSize: "0.75rem",
                              textTransform: "none",
                            }}
                          >
                            Descargar archivo adjunto
                          </Button>
                        )}
                      </Box>
                    )}
                  </Paper>

                  {/* INDICADOR DE LEÍDO / ENVIADO */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.4, px: 0.5 }}>
                    {isMe ? (
                      <Typography variant="caption" sx={{ fontSize: "0.68rem", fontWeight: 600, color: msg.read_at ? "#16a34a" : "#94a3b8" }}>
                        {msg.read_at ? "✓✓ Leído" : "✓ Enviado"}
                      </Typography>
                    ) : (
                      !msg.read_at && (
                        <Typography variant="caption" sx={{ fontSize: "0.68rem", fontWeight: 800, color: "#dc2626", bgcolor: "#fee2e2", px: 0.8, py: 0.2, borderRadius: 1 }}>
                          Nuevo mensaje
                        </Typography>
                      )
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* ÁREA DE ESCRITURA Y ENVÍO */}
      <Box
        component="form"
        onSubmit={handleSend}
        sx={{
          p: 2,
          borderTop: "1px solid #E8E0D5",
          bgcolor: "#FAF7F2",
        }}
      >
        {/* PREVIEW DEL ARCHIVO ADJUNTO ANTES DE ENVIAR */}
        {selectedFile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1.5,
              p: 1,
              bgcolor: "#ffffff",
              border: "1px solid #E8E0D5",
              borderRadius: 2,
              width: "fit-content",
              maxWidth: "100%",
            }}
          >
            {filePreview ? (
              <Box
                component="img"
                src={filePreview}
                alt="Preview"
                sx={{ width: 42, height: 42, borderRadius: 1, objectFit: "cover" }}
              />
            ) : (
              <AttachFileIcon sx={{ color: "#722F37" }} />
            )}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", display: "block", noWrap: true, overflow: "hidden", textOverflow: "ellipsis" }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                {(selectedFile.size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleClearFile} sx={{ color: "#ef4444" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
          {/* BOTÓN ADJUNTAR */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
            style={{ display: "none" }}
          />
          <Tooltip title="Adjuntar captura o archivo">
            <IconButton
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
              sx={{
                color: selectedFile ? "#722F37" : "#64748b",
                bgcolor: selectedFile ? "rgba(114, 47, 55, 0.08)" : "transparent",
                p: 1.2,
                "&:hover": { bgcolor: "rgba(114, 47, 55, 0.12)", color: "#722F37" },
              }}
            >
              <AttachFileIcon />
            </IconButton>
          </Tooltip>

          {/* INPUT MULTILÍNEA */}
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size="small"
            placeholder={
              currentUser?.role === "admin"
                ? "Escribe una respuesta para el colaborador (Enter para enviar)..."
                : "Escribe tu observación o duda para el área de soporte..."
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={sending}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
                bgcolor: "#ffffff",
                "&.Mui-focused fieldset": { borderColor: "#722F37" },
              },
            }}
          />

          {/* BOTÓN ENVIAR */}
          <Button
            type="submit"
            variant="contained"
            disabled={sending || (!inputMessage.trim() && !selectedFile)}
            sx={{
              minWidth: 46,
              height: 42,
              borderRadius: 2.5,
              background: "linear-gradient(135deg, #722F37 0%, #4A1C23 100%)",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(114, 47, 55, 0.3)",
              "&:hover": { background: "linear-gradient(135deg, #8B4049 0%, #5A1E24 100%)" },
              "&.Mui-disabled": { opacity: 0.4 },
            }}
          >
            {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon fontSize="small" />}
          </Button>
        </Box>
      </Box>

      {/* ZOOM DE IMAGEN MODAL */}
      <Dialog
        open={Boolean(previewZoomImage)}
        onClose={() => setPreviewZoomImage(null)}
        maxWidth="lg"
        PaperProps={{ sx: { bgcolor: "transparent", boxShadow: "none", overflow: "hidden" } }}
      >
        <Box sx={{ position: "relative", bgcolor: "#0f172a", p: 1.5, borderRadius: 2 }}>
          <IconButton
            onClick={() => setPreviewZoomImage(null)}
            sx={{ position: "absolute", top: 10, right: 10, color: "white", bgcolor: "rgba(0,0,0,0.6)" }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={previewZoomImage}
            alt="Zoom imagen"
            sx={{ maxWidth: "100%", maxHeight: "85vh", objectFit: "contain", borderRadius: 1.5, display: "block", mx: "auto" }}
          />
        </Box>
      </Dialog>
    </Box>
  );

  if (isModal) {
    return (
      <Dialog
        open={Boolean(ticket)}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        {content}
      </Dialog>
    );
  }

  return content;
}
