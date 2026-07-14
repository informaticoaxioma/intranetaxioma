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
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #8a251eff 0%, #f6573bff 100%);
            padding: 50px 20px;
            text-align: center;
        }
        .header h1 {
            color: #591725;
            margin: 0;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.05em;
        }
        .header p {
            color: #ffd0de;
            margin: 8px 0 0 0;
            font-size: 15px;
            font-weight: 500;
        }
        .content {
            padding: 40px 30px;
            color: #1f2937;
        }
        .celebration-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .content h2 {
            font-size: 18px;
            font-weight: 700;
            margin-top: 0;
            color: #7b1e3f;
            margin-bottom: 10px;
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 10px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #4b5563;
            margin-bottom: 24px;
        }
        .message-box {
            background-color: #fedfdbff;
            border: 1px dashed #af201eff;
            border-radius: 12px;
            padding: 24px;
            margin: 30px 0;
            font-style: italic;
            font-size: 16px;
            color: #591725;
            line-height: 1.6;
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
