<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Feliz Cumpleaños!</title>
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
            padding: 44px 20px;
            text-align: center;
        }
        .header h1 {
            color: #722F37;
            margin: 0;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.02em;
        }
        .header p {
            color: #111827;
            margin: 8px 0 0 0;
            font-size: 15px;
            font-weight: 500;
        }
        .content {
            padding: 40px 30px;
            color: #111827;
        }
        .celebration-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .content h2 {
            font-size: 21px;
            font-weight: 800;
            margin-top: 0;
            color: #4A1C23;
            margin-bottom: 12px;
            border-bottom: 2px solid #FAF7F2;
            padding-bottom: 10px;
        }
        .content p {
            font-size: 15.5px;
            line-height: 1.6;
            color: #111827;
            margin-bottom: 20px;
        }
        .message-box {
            background-color: #FAF7F2;
            border: 1px dashed #722F37;
            border-left: 5px solid #722F37;
            border-radius: 12px;
            padding: 24px;
            margin: 28px 0;
            font-style: italic;
            font-size: 16px;
            color: #4A1C23;
            line-height: 1.65;
            font-weight: 500;
        }
        .footer {
            background-color: #f9fafb;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e8e0d5;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>¡Feliz Cumpleaños!</h1>
            <p>De parte de toda la familia Axioma</p>
        </div>
        <div class="content">
            <div class="celebration-icon">🎉🎂🎈</div>
            <h2>¡Muchas felicidades, {{ $user->name }}!</h2>
            <p>Hoy es un día muy especial y queremos aprovechar la oportunidad para saludarte y desearte lo mejor.</p>
            
            <div class="message-box">
                "En este día de tu cumpleaños, te deseamos un excelente día lleno de alegría, éxito y felicidad junto a tus seres queridos. Agradecemos enormemente tu dedicación y valoramos mucho que seas parte de nuestro gran equipo."
            </div>
            
            <p>¡Que disfrutes al máximo tu día y que este nuevo año de vida venga cargado de bendiciones y metas cumplidas!</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Axioma. Todos los derechos reservados.</p>
            <p>Este es un correo automático enviado con mucho cariño.</p>
        </div>
    </div>
</body>
</html>
