<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuevo Comentario/Recomendación - Intranet Axioma</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f3f4f6;
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
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #8a251eff 0%, #f6573bff 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #591725;
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.05em;
        }
        .header p {
            color: #fec7bfff;
            margin: 5px 0 0 0;
            font-size: 14px;
        }
        .badge {
            display: inline-block;
            background-color: #fedfdbff;
            color: #8a251e;
            border: 1px solid #af201e;
            border-radius: 100px;
            padding: 4px 14px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 14px;
        }
        .content {
            padding: 36px 30px;
            color: #1f2937;
        }
        .content h2 {
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
            margin-bottom: 6px;
            color: #111827;
        }
        .content p {
            font-size: 15px;
            line-height: 1.6;
            color: #4b5563;
            margin: 0 0 20px;
        }
        .sender-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px 24px;
            margin-bottom: 24px;
        }
        .sender-row {
            display: flex;
            align-items: baseline;
            gap: 8px;
            margin-bottom: 8px;
        }
        .sender-row:last-child { margin-bottom: 0; }
        .sender-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            color: #94a3b8;
            font-weight: 700;
            min-width: 90px;
        }
        .sender-value {
            font-size: 14px;
            color: #1e293b;
            font-weight: 600;
        }
        .message-box {
            background-color: #fedfdbff;
            border: 1px solid #af201eff;
            border-radius: 12px;
            padding: 24px;
            margin: 0 0 28px;
        }
        .message-box p {
            font-size: 15px;
            line-height: 1.75;
            color: #1e293b;
            margin: 0;
            white-space: pre-wrap;
        }
        .reply-notice {
            background-color: #fff7ed;
            border: 1px solid #fed7aa;
            border-radius: 10px;
            padding: 14px 18px;
            font-size: 13px;
            color: #7c2d12;
            line-height: 1.5;
            margin-bottom: 0;
        }
        .footer {
            background-color: #f9fafb;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>INTRANET AXIOMA</h1>
            <p>Portal de Colaboradores</p>
            <span class="badge">💬 Nuevo comentario recibido</span>
        </div>
        <div class="content">
            <h2>Comentario / Recomendación</h2>
            <p>Un colaborador ha enviado el siguiente mensaje a través del formulario de la Intranet:</p>

            <div class="sender-box">
                <div class="sender-row">
                    <span class="sender-label">Nombre</span>
                    <span class="sender-value">{{ $senderName }}</span>
                </div>
                <div class="sender-row">
                    <span class="sender-label">Correo</span>
                    <span class="sender-value">{{ $senderEmail }}</span>
                </div>
                @if($senderDepartment)
                <div class="sender-row">
                    <span class="sender-label">Área</span>
                    <span class="sender-value">{{ $senderDepartment }}</span>
                </div>
                @endif
                <div class="sender-row">
                    <span class="sender-label">Fecha</span>
                    <span class="sender-value">{{ now()->format('d/m/Y H:i') }}</span>
                </div>
            </div>

            <div class="message-box">
                <p>{{ $feedbackMessage }}</p>
            </div>

            <div class="reply-notice">
                💡 Puedes responder directamente a este correo para contactar al colaborador. Su dirección de correo ya está configurada como <strong>Reply-To</strong>.
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Axioma. Todos los derechos reservados.</p>
            <p>Este mensaje fue enviado desde la Intranet Corporativa Axioma.</p>
        </div>
    </div>
</body>
</html>
