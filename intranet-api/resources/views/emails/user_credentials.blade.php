<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Intranet Axioma</title>
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
        .credentials-box {
            background-color: #FAF7F2;
            border: 1px solid #E8E0D5;
            border-left: 5px solid #722F37;
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
            color: #722F37;
            font-weight: 700;
            margin-bottom: 6px;
        }
        .credentials-value {
            font-size: 16px;
            font-family: 'Fira Code', 'Courier New', Courier, monospace;
            color: #000000;
            font-weight: 700;
            background-color: #ffffff;
            border: 1px solid #cbd5e1;
            padding: 8px 14px;
            border-radius: 6px;
            display: inline-block;
        }
        .btn-container {
            text-align: center;
            margin-top: 30px;
        }
        .btn {
            background: linear-gradient(135deg, #722F37 0%, #4A1C23 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 34px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 15px;
            display: inline-block;
            box-shadow: 0 4px 10px rgba(114, 47, 55, 0.3);
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
            <h2>¡Hola, {{ $user->name }}!</h2>
            <p>Tu cuenta ha sido creada exitosamente en la plataforma de Intranet Axioma. A continuación se detallan tus credenciales de acceso:</p>
            
            <div class="credentials-box">
                <div class="credentials-row">
                    <div class="credentials-label">Usuario / Correo Electrónico</div>
                    <div class="credentials-value">{{ $user->email }}</div>
                </div>
                <div class="credentials-row">
                    <div class="credentials-label">Contraseña</div>
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
