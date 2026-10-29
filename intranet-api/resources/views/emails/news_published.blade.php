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
        .category-badge {
            background-color: rgba(114, 47, 55, 0.08);
            color: #722F37;
            border: 1px solid rgba(114, 47, 55, 0.25);
            padding: 5px 14px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            display: inline-block;
            margin-bottom: 16px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .news-title {
            font-size: 23px;
            font-weight: 800;
            margin: 0 0 12px 0;
            color: #4A1C23;
            line-height: 1.35;
        }
        .news-meta {
            font-size: 14px;
            color: #111827;
            margin-bottom: 24px;
        }
        .news-summary {
            font-size: 15.5px;
            line-height: 1.6;
            color: #111827;
            background-color: #FAF7F2;
            border: 1px solid #E8E0D5;
            border-left: 5px solid #722F37;
            padding: 16px 20px;
            border-radius: 0 12px 12px 0;
            margin-bottom: 28px;
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
            <span class="category-badge">{{ $news->categoria }}</span>
            <h2 class="news-title">{{ $news->titulo }}</h2>
            <div class="news-meta">Publicado por <strong>{{ $news->autor }}</strong></div>
            
            <div class="news-summary">
                {{ $news->resumen }}
            </div>
            
            <p style="font-size: 15px; color: #111827; line-height: 1.5;">Ingresa a la plataforma de Intranet para leer la noticia completa y mantenerte al día con las últimas novedades.</p>
            
            <div class="btn-container">
                <a href="https://intranet.axioma.cl/dashboard/news/{{ $news->id }}" class="btn">Leer noticia completa</a>
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Axioma. Todos los derechos reservados.</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>
