<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Seguimiento de Ticket {{ $ticket->code }} - Intranet Axioma</title>
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
            padding: 32px 24px;
            text-align: center;
        }
        .header h1 {
            color: #722F37;
            margin: 0;
            font-size: 24px;
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
            padding: 5px 16px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.05em;
            margin-top: 12px;
        }
        .content {
            padding: 32px 28px;
            color: #1f2937;
        }
        .alert-hero {
            background: #FAF7F2;
            border: 1px solid #E8E0D5;
            border-left: 6px solid #722F37;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 24px;
        }
        .ticket-code-tag {
            display: inline-block;
            background-color: #722F37;
            color: #ffffff;
            font-size: 16px;
            font-weight: 800;
            letter-spacing: 0.5px;
            padding: 4px 14px;
            border-radius: 6px;
            margin-bottom: 8px;
        }
        .alert-hero p {
            margin: 0;
            color: #4A1C23;
            font-size: 14px;
            font-weight: 600;
        }
        .chat-bubble {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .chat-author {
            font-size: 13px;
            font-weight: 700;
            color: #722F37;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .chat-message {
            font-size: 15.5px;
            line-height: 1.6;
            color: #111827;
            white-space: pre-wrap;
        }
        .details-box {
            background-color: #FAF7F2;
            border: 1px solid #e8e0d5;
            border-left: 4px solid #722F37;
            border-radius: 12px;
            padding: 18px 20px;
            margin-bottom: 24px;
            font-size: 13.5px;
        }
        .detail-row {
            display: flex;
            justifyContent: space-between;
            padding: 6px 0;
            border-bottom: 1px dashed #e8e0d5;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #722F37;
            font-weight: 700;
        }
        .detail-value {
            color: #000000;
            font-weight: 700;
        }
        .cta-container {
            text-align: center;
            margin-top: 28px;
            margin-bottom: 10px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #722F37 0%, #4A1C23 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 15px;
            box-shadow: 0 4px 12px rgba(114, 47, 55, 0.3);
        }
        .footer {
            background-color: #faf8f5;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e8e0d5;
            color: #6b7280;
            font-size: 12px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- HEADER -->
        <div class="header">
            <h1>Intranet Corporativa Axioma</h1>
            <p>Sistema de Mesa de Ayuda y Soporte TI</p>
            <div class="badge">SEGUIMIENTO DE TICKET</div>
        </div>

        <!-- CONTENT -->
        <div class="content">
            <div class="alert-hero">
                <div class="ticket-code-tag">{{ $ticket->code }}</div>
                <p>
                    @if($isForSupport)
                        El solicitante ha enviado una nueva observación en el ticket.
                    @else
                        El equipo de soporte ha respondido a tu ticket.
                    @endif
                </p>
            </div>

            <div class="chat-bubble">
                <div class="chat-author">
                    💬 Mensaje de: {{ $ticketMessage->user ? $ticketMessage->user->name . ' ' . ($ticketMessage->user->apellido ?? '') : 'Usuario' }}
                    @if($ticketMessage->is_admin_reply)
                        <span style="background-color: #722F37; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase;">Soporte TI</span>
                    @endif
                </div>
                <div class="chat-message">{{ $ticketMessage->message }}</div>
                @if($ticketMessage->attachment_path)
                    <div style="margin-top: 12px; font-size: 12px; color: #722F37; font-weight: 600;">
                        📎 Se ha adjuntado un archivo/imagen en este mensaje.
                    </div>
                @endif
            </div>

            <div class="details-box">
                <div class="detail-row">
                    <span class="detail-label">Asunto:</span>
                    <span class="detail-value">{{ $ticket->title }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Categoría:</span>
                    <span class="detail-value">{{ $ticket->category }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Estado:</span>
                    <span class="detail-value" style="text-transform: capitalize;">{{ str_replace('_', ' ', $ticket->status) }}</span>
                </div>
            </div>

            <!-- CTA -->
            <div class="cta-container">
                <a href="https://intranet.axioma.cl/dashboard" class="cta-button">
                    Continuar conversación en la Intranet
                </a>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p>Este es un mensaje automático de la Mesa de Ayuda de Axioma Ingenieros Consultores.</p>
            <p style="margin: 0;">&copy; {{ date('Y') }} Axioma. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
