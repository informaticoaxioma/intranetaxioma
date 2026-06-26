<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Noticia en Intranet Axioma</title>
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
        .category-badge {
            background-color: #fedfdbff;
            color: #af201eff;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .news-title {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 12px 0;
            color: #2a110fff;
            line-height: 1.3;
        }
        .news-meta {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 24px;
        }
        .news-summary {
            font-size: 16px;
            line-height: 1.6;
            color: #334155;
            background-color: #f8fafc;
            border-left: 4px solid #f6483bff;
            padding: 16px 20px;
            border-radius: 0 12px 12px 0;
            margin-bottom: 30px;
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
            <span class="category-badge">{{ $news->categoria }}</span>
            <h2 class="news-title">{{ $news->titulo }}</h2>
            <div class="news-meta">Publicado por <strong>{{ $news->autor }}</strong></div>
            
            <div class="news-summary">
                {{ $news->resumen }}
            </div>
            
            <p style="font-size: 15px; color: #64748b; line-height: 1.5;">Ingresa a la plataforma de Intranet para leer la noticia completa y mantenerte al día con las últimas novedades.</p>
            
            <div class="btn-container">
                <a href="{{ config('app.url') }}" class="btn">Leer noticia completa</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Axioma. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>
