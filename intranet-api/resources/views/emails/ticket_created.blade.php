<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket {{ $ticket->code }} - Intranet Axioma</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f5f1eb;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(74, 28, 35, 0.12), 0 8px 10px -6px rgba(74, 28, 35, 0.08);
            border: 1px solid #e8e0d5;
        }
        .header {
            background: linear-gradient(135deg, #722F37 0%, #4A1C23 100%);
            padding: 36px 24px;
            text-align: center;
        }
        .header h1 {
            color: #722F37;
            margin: 0;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.02em;
        }
        .header p {
            color: #111827;
            margin: 6px 0 0 0;
            font-size: 14px;
        }
        .badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.18);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.35);
            border-radius: 100px;
            padding: 6px 18px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.05em;
            margin-top: 14px;
        }
        .content {
            padding: 32px 28px;
            color: #1f2937;
        }
        .alert-hero {
            background: linear-gradient(135deg, #fdf8f7 0%, #fef2f2 100%);
            border: 1.5px solid #fca5a5;
            border-left: 6px solid #722F37;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 26px;
            text-align: center;
        }
        .ticket-code-tag {
            display: inline-block;
            background-color: #722F37;
            color: #ffffff;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 1px;
            padding: 6px 18px;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        .alert-hero p {
            margin: 0;
            color: #4A1C23;
            font-size: 15px;
            font-weight: 600;
            line-height: 1.5;
        }
        .details-box {
            background-color: #faf8f5;
            border: 1px solid #e8e0d5;
            border-radius: 12px;
            padding: 20px 22px;
            margin-bottom: 24px;
        }
        .detail-row {
            display: flex;
            justifyContent: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px dashed #e8e0d5;
        }
        .detail-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .detail-row:first-child {
            padding-top: 0;
        }
        .detail-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #722F37;
            font-weight: 700;
        }
        .detail-value {
            font-size: 14px;
            color: #111827;
            font-weight: 700;
            text-align: right;
        }
        .priority-chip {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
        }
        .priority-baja { background-color: #e2e8f0; color: #475569; }
        .priority-media { background-color: #dbeafe; color: #1e40af; }
        .priority-alta { background-color: #fed7aa; color: #9a3412; }
        .priority-urgente { background-color: #fee2e2; color: #991b1b; }

        .desc-box {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 18px 20px;
            margin-bottom: 24px;
        }
        .desc-title {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #722F37;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .desc-text {
            font-size: 14.5px;
            line-height: 1.6;
            color: #111827;
            white-space: pre-wrap;
            margin: 0;
        }
        .notice-banner {
            background-color: #FAF7F2;
            border: 1px solid #E8E0D5;
            border-radius: 10px;
            padding: 14px 18px;
            font-size: 13.5px;
            color: #111827;
            line-height: 1.5;
            text-align: center;
        }
        .footer {
            background-color: #faf8f5;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #8c7377;
            border-top: 1px solid #e8e0d5;
        }
        .footer strong {
            color: #4A1C23;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- HEADER -->
        <div class="header">
            <h1>INTRANET AXIOMA</h1>
            <p>Mesa de Ayuda y Soporte</p>
            <span class="badge">🎫 TICKET #{{ $ticket->code }}</span>
        </div>

        <!-- CONTENT -->
        <div class="content">
            <!-- HERO CONFIRMATION NOTICE -->
            <div class="alert-hero">
                <span class="ticket-code-tag">{{ $ticket->code }}</span>
                <p>
                    Se le asignó el ticket <strong>{{ $ticket->code }}</strong> y se le atenderá durante el día.
                </p>
            </div>

            <h3 style="margin: 0 0 14px; color: #4A1C23; font-size: 17px; font-weight: 700;">
                Detalles del Requerimiento
            </h3>

            <!-- DETAILS TABLE -->
            <div class="details-box">
                <div class="detail-row">
                    <span class="detail-label">Solicitante</span>
                    <span class="detail-value">{{ $ticket->user->name ?? 'Colaborador' }} {{ $ticket->user->apellido ?? '' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Correo</span>
                    <span class="detail-value">{{ $ticket->user->email ?? 'N/A' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Departamento</span>
                    <span class="detail-value">{{ $ticket->user->departamento ?? 'General' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Asunto</span>
                    <span class="detail-value">{{ $ticket->title }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Categoría</span>
                    <span class="detail-value">{{ $ticket->category }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Prioridad</span>
                    <span class="detail-value">
                        <span class="priority-chip priority-{{ strtolower($ticket->priority) }}">
                            {{ ucfirst($ticket->priority) }}
                        </span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Estado</span>
                    <span class="detail-value">{{ ucfirst(str_replace('_', ' ', $ticket->status)) }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Fecha y Hora</span>
                    <span class="detail-value">{{ $ticket->created_at ? $ticket->created_at->format('d/m/Y H:i') : now()->format('d/m/Y H:i') }}</span>
                </div>
            </div>

            <!-- DESCRIPTION -->
            <div class="desc-box">
                <div class="desc-title">Descripción del problema o solicitud</div>
                <p class="desc-text">{{ $ticket->description }}</p>
            </div>

            @if($ticket->path_imagen)
            <div style="background-color: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 10px; padding: 14px 18px; margin-bottom: 22px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 22px;">📷</span>
                <div style="font-size: 13px; color: #475569; line-height: 1.4;">
                    <strong style="color: #1e293b;">Fotografía adjunta:</strong> Se adjuntó una imagen a este requerimiento (puedes revisarla en el archivo adjunto de este correo o en el panel de la intranet).
                </div>
            </div>
            @endif

            <div class="notice-banner">
                💡 Por favor, mantén a mano el código <strong>{{ $ticket->code }}</strong> ante cualquier consulta adicional con el equipo de soporte.
            </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p style="margin: 0 0 6px;">
                <strong>Intranet Axioma</strong> &bull; Mesa de Ayuda y Soporte TI
            </p>
            <p style="margin: 0;">
                Este es un mensaje generado automáticamente. No es necesario responder a este correo.
            </p>
        </div>
    </div>
</body>
</html>
