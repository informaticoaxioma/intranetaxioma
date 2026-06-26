<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contraseña Actualizada - Intranet Axioma</title>
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
        .content {
            padding: 40px 30px;
            color: #1f2937;
        }
        .content h2 {
            font-size: 20px;
            font-weight: 600;
            margin-top: 0;
            color: #111827;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #4b5563;
        }
        .warning-box {
            background-color: #fef3c7;
            border: 1px solid #fcd34d;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            color: #78350f;
            font-size: 14px;
            line-height: 1.5;
        }
        .credentials-box {
            background-color: #fedfdbff;
            border: 1px solid #af201eff;
            border-radius: 12px;
            padding: 24px;
            margin: 30px 0;
        }
        .credentials-row {
            margin-bottom: 16px;
        }
        .credentials-row:last-child {
            margin-bottom: 0;
        }
        .credentials-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .credentials-value {
            font-size: 16px;
            font-family: 'Fira Code', 'Courier New', Courier, monospace;
            color: #0f172a;
            font-weight: 600;
            background-color: #f1f5f9;
            padding: 8px 12px;
            border-radius: 6px;
            display: inline-block;
        }
        .btn-container {
            text-align: center;
            margin-top: 30px;
        }
        .btn {
            background: linear-gradient(135deg, #f64b3bff 0%, #eb3525ff 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            display: inline-block;
            box-shadow: 0 4px 6px -1px rgba(246, 81, 59, 0.3);
        }
        .footer {
            background-color: #f9fafb;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
        }
        .footer a {
            color: #f6443bff;
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
            <h2>¡Hola, {{ $user->name }}!</h2>
            <p>Te informamos que la contraseña de tu cuenta en la Intranet Axioma ha sido actualizada exitosamente.</p>
            
            <div class="warning-box">
                <strong>¿No fuiste tú?</strong> Si no has solicitado este cambio de contraseña o sospechas que se trata de un error, por favor ponte en contacto de inmediato con el administrador de sistemas.
            </div>
            
            <div class="credentials-box">
                <div class="credentials-row">
                    <div class="credentials-label">Usuario / Correo Electrónico</div>
                    <div class="credentials-value">{{ $user->email }}</div>
                </div>
                <div class="credentials-row">
                    <div class="credentials-label">Nueva Contraseña</div>
                    <div class="credentials-value">{{ $plainPassword }}</div>
                </div>
            </div>
            
            <div class="btn-container">
                <a href="{{ config('app.url') }}" class="btn">Acceder a la Intranet</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Axioma. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>
