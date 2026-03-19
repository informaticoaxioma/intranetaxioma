"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  AvatarGroup,
} from "@mui/material"
import { ThemeProvider } from "@mui/material/styles"
import { muiTheme } from "@/lib/mui-theme"


interface Event {
  id: number
  title: string
  date: Date
  startTime: string
  endTime: string
  type: "reunion" | "capacitacion" | "evento" | "deadline" | "festivo"
  location?: string
  attendees?: string[]
  description?: string
}

const eventTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  reunion: { bg: "#E3F2FD", text: "#1565C0", border: "#1565C0" },
  capacitacion: { bg: "#E8F5E9", text: "#2E7D32", border: "#2E7D32" },
  evento: { bg: "#FFF3E0", text: "#E65100", border: "#E65100" },
  deadline: { bg: "#FFEBEE", text: "#C62828", border: "#C62828" },
  festivo: { bg: "#F3E5F5", text: "#7B1FA2", border: "#7B1FA2" },
}

const eventTypeLabels: Record<string, string> = {
  reunion: "Reunion",
  capacitacion: "Capacitacion",
  evento: "Evento",
  deadline: "Deadline",
  festivo: "Festivo",
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Reunion de equipo semanal",
    date: new Date(2026, 0, 21),
    startTime: "10:00",
    endTime: "11:00",
    type: "reunion",
    location: "Sala de conferencias A",
    attendees: ["Ana Garcia", "Carlos Lopez", "Maria Rodriguez"],
    description: "Revision de avances y planificacion de la semana",
  },
  {
    id: 2,
    title: "Capacitacion: Nuevas herramientas",
    date: new Date(2026, 0, 22),
    startTime: "14:00",
    endTime: "16:00",
    type: "capacitacion",
    location: "Auditorio principal",
    attendees: ["Todo el departamento"],
    description: "Formacion sobre las nuevas herramientas de productividad",
  },
  {
    id: 3,
    title: "Entrega proyecto Q1",
    date: new Date(2026, 0, 25),
    startTime: "18:00",
    endTime: "18:00",
    type: "deadline",
    description: "Fecha limite para entrega del proyecto del primer trimestre",
  },
  {
    id: 4,
    title: "Celebracion aniversario empresa",
    date: new Date(2026, 0, 28),
    startTime: "12:00",
    endTime: "15:00",
    type: "evento",
    location: "Terraza corporativa",
    attendees: ["Toda la empresa"],
    description: "Celebracion del 15 aniversario de la empresa",
  },
  {
    id: 5,
    title: "Reunion con cliente",
    date: new Date(2026, 0, 23),
    startTime: "09:00",
    endTime: "10:30",
    type: "reunion",
    location: "Sala de juntas B",
    attendees: ["Director comercial", "Equipo de ventas"],
    description: "Presentacion de propuesta comercial",
  },
  {
    id: 6,
    title: "Workshop de innovacion",
    date: new Date(2026, 0, 29),
    startTime: "09:00",
    endTime: "13:00",
    type: "capacitacion",
    location: "Espacio colaborativo",
    attendees: ["Equipo de producto", "Equipo de desarrollo"],
  },
  {
    id: 7,
    title: "Revision trimestral",
    date: new Date(2026, 0, 30),
    startTime: "11:00",
    endTime: "12:30",
    type: "reunion",
    location: "Sala de conferencias principal",
    attendees: ["Directivos", "Gerentes de area"],
  },
  {
    id: 8,
    title: "Dia festivo - San Sebastian",
    date: new Date(2026, 0, 20),
    startTime: "00:00",
    endTime: "23:59",
    type: "festivo",
    description: "Dia festivo local",
  },
]

const DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isNewEventOpen, setIsNewEventOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    type: "reunion",
    location: "",
    description: "",
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    let startingDay = firstDay.getDay() - 1
    if (startingDay === -1) startingDay = 6
    return { daysInMonth, startingDay }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)

  const getEventsForDate = (day: number) => {
    return mockEvents.filter(event => {
      return event.date.getDate() === day &&
             event.date.getMonth() === currentDate.getMonth() &&
             event.date.getFullYear() === currentDate.getFullYear()
    })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date(2026, 0, 1))
  }

  const isToday = (day: number) => {
    const today = new Date(2026, 0, 21)
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear()
  }

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
  }

  const upcomingEvents = mockEvents
    .filter(event => event.date >= new Date(2026, 0, 21))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5)

  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={{ p: 4, bgcolor: "#F5F1EB", minHeight: "100vh" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ color: "#4A1C23", fontWeight: 700 }}>
              Calendario
            </Typography>
            <Typography variant="body2" sx={{ color: "#722F37", mt: 0.5 }}>
              Gestiona tus eventos y reuniones
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={/*<IconPlus className="w-5 h-5" />*/ null}
            onClick={() => setIsNewEventOpen(true)}
            sx={{
              bgcolor: "#722F37",
              "&:hover": { bgcolor: "#4A1C23" },
              textTransform: "none",
              px: 3,
            }}
          >
            Nuevo Evento
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Calendar Grid */}
          <Paper sx={{ flex: 1, p: 3, borderRadius: 3 }}>
            {/* Calendar Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton onClick={prevMonth} sx={{ color: "#722F37" }}>
                  
                </IconButton>
                <Typography variant="h5" sx={{ color: "#4A1C23", fontWeight: 600, minWidth: 200, textAlign: "center" }}>
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Typography>
                <IconButton onClick={nextMonth} sx={{ color: "#722F37" }}>
                  
                </IconButton>
              </Box>
              <Button
                variant="outlined"
                onClick={goToToday}
                sx={{
                  borderColor: "#722F37",
                  color: "#722F37",
                  "&:hover": { borderColor: "#4A1C23", bgcolor: "#F5F1EB" },
                  textTransform: "none",
                }}
              >
                Hoy
              </Button>
            </Box>

            {/* Days Header */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, mb: 2 }}>
              {DAYS.map(day => (
                <Box
                  key={day}
                  sx={{
                    textAlign: "center",
                    py: 1,
                    fontWeight: 600,
                    color: "#722F37",
                    fontSize: "0.875rem",
                  }}
                >
                  {day}
                </Box>
              ))}
            </Box>

            {/* Calendar Days */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
              {/* Empty cells for days before the first day of the month */}
              {Array.from({ length: startingDay }).map((_, index) => (
                <Box key={`empty-${index}`} sx={{ minHeight: 100 }} />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1
                const dayEvents = getEventsForDate(day)
                const isCurrentDay = isToday(day)

                return (
                  <Paper
                    key={day}
                    onClick={() => handleDayClick(day)}
                    sx={{
                      minHeight: 100,
                      p: 1,
                      cursor: "pointer",
                      border: isCurrentDay ? "2px solid #722F37" : "1px solid #E8E0D5",
                      bgcolor: isCurrentDay ? "#FDF8F8" : "white",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: 2,
                        borderColor: "#722F37",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: isCurrentDay ? 700 : 500,
                        color: isCurrentDay ? "#722F37" : "#4A1C23",
                        fontSize: "0.875rem",
                        mb: 0.5,
                      }}
                    >
                      {day}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, maxHeight: 60, overflowY: "hidden" }}>
                      {dayEvents.slice(0, ).map(event => (
                        <Chip
                          key={event.id}
                          label={event.title}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedEvent(event)
                          }}
                          sx={{
                            height: 16,
                            fontSize: "0.65rem",
                            bgcolor: eventTypeColors[event.type].bg,
                            color: eventTypeColors[event.type].text,
                            borderLeft: `3px solid ${eventTypeColors[event.type].border}`,
                            borderRadius: 1,
                            maxWidth: "100%",
                            "& .MuiChip-label": {
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "100%",
                              px: 0.5,
                            },
                          }}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <Typography sx={{ fontSize: "0.65rem", color: "#722F37", fontWeight: 500, lineHeight: 1 }}>
                          +{dayEvents.length - 2} mas
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                )
              })}
            </Box>

            {/* Legend */}
            <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
              {Object.entries(eventTypeLabels).map(([key, label]) => (
                <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: eventTypeColors[key].bg,
                      border: `2px solid ${eventTypeColors[key].border}`,
                    }}
                  />
                  <Typography sx={{ fontSize: "0.75rem", color: "#4A1C23" }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Sidebar - Upcoming Events */}
          <Paper sx={{ width: 320, p: 3, borderRadius: 3, alignSelf: "flex-start", overflow:"hidden" }}>
            <Typography variant="h6" sx={{ color: "#4A1C23", fontWeight: 600, mb: 2 }}>
              Proximos Eventos
            </Typography>
            <List sx={{ p: 0 }}>
              {upcomingEvents.map((event, index) => (
                <Box key={event.id}>
                  <ListItem
                    sx={{
                      px: 0,
                      py: 1.5,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#F5F1EB" },
                      borderRadius: 2,
                      minWidth: 0,
                    }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: eventTypeColors[event.type].border,
                        mr: 2,
                      }}
                    />
                    <ListItemText
                      primary={
                        <Typography noWrap sx={{ fontWeight: 500, color: "#4A1C23", fontSize: "0.9rem", maxWidth: "100%" }}>
                          {event.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, maxWidth: "100%", overflow: "hidden" }}>
                          <Typography noWrap sx={{ fontSize: "0.75rem", color: "#722F37" }}>
                            {event.date.getDate()} {MONTHS[event.date.getMonth()].slice(0, 3)}
                          </Typography>
                          <Typography noWrap sx={{ fontSize: "0.75rem", color: "#999" }}>|</Typography>
                          <Typography noWrap sx={{ fontSize: "0.75rem", color: "#722F37" }}>
                            {event.startTime}
                          </Typography>
                        </Box>
                      }
                      secondaryTypographyProps={{
                        component: "div",
                      }}
                    />
                  </ListItem>
                  {index < upcomingEvents.length - 1 && <Divider />}
                </Box>
              ))}
            </List>

            {selectedDate && (
              <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #E8E0D5" }}>
                <Typography variant="subtitle2" sx={{ color: "#4A1C23", fontWeight: 600, mb: 1 }}>
                  {selectedDate.getDate()} de {MONTHS[selectedDate.getMonth()]}
                </Typography>
                {getEventsForDate(selectedDate.getDate()).length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {getEventsForDate(selectedDate.getDate()).map(event => (
                      <ListItem
                        key={event.id}
                        sx={{ px: 0, py: 1, cursor: "pointer" }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <Chip
                          label={`${event.startTime} - ${event.title}`}
                          size="small"
                          sx={{
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            bgcolor: eventTypeColors[event.type].bg,
                            color: eventTypeColors[event.type].text,
                            borderLeft: `3px solid ${eventTypeColors[event.type].border}`,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography sx={{ fontSize: "0.875rem", color: "#999" }}>
                    No hay eventos programados
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Box>

        {/* Event Detail Dialog */}
        <Dialog
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          {selectedEvent && (
            <>
              <DialogTitle sx={{ bgcolor: eventTypeColors[selectedEvent.type].bg, pb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Chip
                      label={eventTypeLabels[selectedEvent.type]}
                      size="small"
                      sx={{
                        bgcolor: eventTypeColors[selectedEvent.type].border,
                        color: "white",
                        mb: 1,
                      }}
                    />
                    <Typography variant="h6" sx={{ color: "#4A1C23", fontWeight: 600 }}>
                      {selectedEvent.title}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => setSelectedEvent(null)} sx={{ color: "#4A1C23" }}>
                    
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    
                    <Box>
                      <Typography sx={{ fontSize: "0.875rem", color: "#4A1C23" }}>
                        {selectedEvent.date.getDate()} de {MONTHS[selectedEvent.date.getMonth()]} de {selectedEvent.date.getFullYear()}
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", color: "#722F37" }}>
                        {selectedEvent.startTime} - {selectedEvent.endTime}
                      </Typography>
                    </Box>
                  </Box>

                  {selectedEvent.location && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      
                      <Typography sx={{ fontSize: "0.875rem", color: "#4A1C23" }}>
                        {selectedEvent.location}
                      </Typography>
                    </Box>
                  )}

                  {selectedEvent.attendees && (
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                      
                      <Box>
                        <Typography sx={{ fontSize: "0.875rem", color: "#4A1C23", mb: 1 }}>
                          Participantes
                        </Typography>
                        <AvatarGroup max={5}>
                          {selectedEvent.attendees.map((attendee, i) => (
                            <Avatar
                              key={i}
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "#722F37",
                                fontSize: "0.75rem",
                              }}
                            >
                              {attendee.split(" ").map(n => n[0]).join("")}
                            </Avatar>
                          ))}
                        </AvatarGroup>
                        <Typography sx={{ fontSize: "0.75rem", color: "#999", mt: 1 }}>
                          {selectedEvent.attendees.join(", ")}
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  {selectedEvent.description && (
                    <Box sx={{ mt: 1 }}>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 500, color: "#4A1C23", mb: 0.5 }}>
                        Descripcion
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", color: "#666" }}>
                        {selectedEvent.description}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedEvent(null)}
                  sx={{
                    borderColor: "#722F37",
                    color: "#722F37",
                    textTransform: "none",
                  }}
                >
                  Cerrar
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#722F37",
                    "&:hover": { bgcolor: "#4A1C23" },
                    textTransform: "none",
                  }}
                >
                  Editar Evento
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* New Event Dialog */}
        <Dialog
          open={isNewEventOpen}
          onClose={() => setIsNewEventOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ borderBottom: "1px solid #E8E0D5" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" sx={{ color: "#4A1C23", fontWeight: 600 }}>
                Nuevo Evento
              </Typography>
              <IconButton onClick={() => setIsNewEventOpen(false)} sx={{ color: "#4A1C23" }}>
                
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Titulo del evento"
                fullWidth
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#722F37" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
                }}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Fecha"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#722F37" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel sx={{ "&.Mui-focused": { color: "#722F37" } }}>Tipo</InputLabel>
                  <Select
                    value={newEvent.type}
                    label="Tipo"
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#722F37" },
                    }}
                  >
                    {Object.entries(eventTypeLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Hora inicio"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#722F37" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
                  }}
                />
                <TextField
                  label="Hora fin"
                  type="time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": { borderColor: "#722F37" },
                    },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
                  }}
                />
              </Box>

              <TextField
                label="Ubicacion"
                fullWidth
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#722F37" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
                }}
              />

              <TextField
                label="Descripcion"
                fullWidth
                multiline
                rows={3}
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": { borderColor: "#722F37" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#722F37" },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setIsNewEventOpen(false)}
              sx={{
                borderColor: "#722F37",
                color: "#722F37",
                textTransform: "none",
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#722F37",
                "&:hover": { bgcolor: "#4A1C23" },
                textTransform: "none",
              }}
            >
              Crear Evento
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}
