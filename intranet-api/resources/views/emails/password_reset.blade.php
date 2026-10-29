<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Contraseña - Intranet Axioma</title>
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
            box-shadow: 0 10px 25px -5px rgba(74, 28, 35, 0.12), 0 8px 10px -6px rgba(74, 28, 35, 0.08);
            border: 1px solid #e8e0d5;
        }
        .header {
            background: linear-gradient(135deg, #722F37 0%, #4A1C23 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #722F37;
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.02em;
        }
        .header p {
            color: #111827;
            margin: 5px 0 0 0;
            font-size: 14px;
        }
        .content {
            padding: 40px 30px;
            color: #111827;
        }
        .content h2 {
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
            color: #4A1C23;
        }
        .content p {
            font-size: 15.5px;
            line-height: 1.6;
            color: #111827;
        }
        .info-box {
            background-color: #FAF7F2;
            border: 1px solid #E8E0D5;
            border-left: 5px solid #722F37;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 24px;
            color: #111827;
            font-size: 14px;
            line-height: 1.5;
        }
        .btn-container {
            text-align: center;
            margin: 32px 0;
        }
        .btn {
            background: linear-gradient(135deg, #722F37 0%, #4A1C23 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 15px;
            display: inline-block;
            box-shadow: 0 4px 10px rgba(114, 47, 55, 0.3);
        }
        .expiry-notice {
            text-align: center;
            font-size: 13.5px;
            color: #4A1C23;
            margin-top: 12px;
        }
        .divider {
            border: none;
            border-top: 1px solid #e8e0d5;
            margin: 28px 0;
        }
        .link-fallback {
            font-size: 13px;
            color: #475569;
            word-break: break-all;
        }
        .link-fallback a {
            color: #722F37;
            font-weight: 600;
        }
        .footer {
            background-color: #f9fafb;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e8e0d5;
        }
        .footer a {
            color: #722F37;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>INTRANET AXIOMA</h1>
            <p>Portal de Colaboradores</p>
        </div>
        <div class="content">
            <h2>¡Hola, {{ $userName }}!</h2>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en la Intranet Axioma. Haz clic en el botón a continuación para crear una nueva contraseña:</p>

            <div class="btn-container">
                <a href="{{ $resetUrl }}" class="btn">Restablecer Contraseña</a>
            </div>
            <p class="expiry-notice">⏱ Este enlace expira en <strong>60 minutos</strong>.</p>

            <div class="info-box">
                <strong>¿No solicitaste esto?</strong> Si no pediste recuperar tu contraseña, puedes ignorar este correo. Tu contraseña actual permanece sin cambios.
            </div>

            <hr class="divider">

            <p class="link-fallback">Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                <a href="{{ $resetUrl }}">{{ $resetUrl }}</a>
            </p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Axioma. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>
