<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recordatorio de Eventos</title>
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
        .content h2 {
            font-size: 18px;
            font-weight: 700;
            margin-top: 0;
            color: #7b1e3f;
            margin-bottom: 10px;
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 10px;
        }
        .intro-text {
            font-size: 15px;
            line-height: 1.6;
            color: #4b5563;
            margin-bottom: 25px;
        }
        .event-list {
            margin: 20px 0;
        }
        .event-card {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 18px;
            margin-bottom: 16px;
            box-sizing: border-box;
            background-color: #fcfcfc;
            border-left: 4px solid #7b1e3f;
        }
        .event-type-badge {
            display: inline-block;
            background-color: #ffd0de;
            color: #7b1e3f;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            padding: 4px 8px;
            border-radius: 6px;
            margin-bottom: 8px;
        }
        .event-title {
            font-size: 17px;
            font-weight: 700;
            color: #111827;
            margin: 0 0 6px 0;
        }
        .event-time-location {
            font-size: 13px;
            color: #6b7280;
            margin: 0 0 10px 0;
            display: flex;
            align-items: center;
        }
        .event-description {
            font-size: 14px;
            line-height: 1.5;
            color: #4b5563;
            margin: 0;
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
            <h1>📅 Recordatorio de Eventos</h1>
            <p>Intranet Corporativa Axioma</p>
        </div>
        <div class="content">
            <h2>Próximos eventos para mañana: {{ $date }}</h2>
            <p class="intro-text">Hola, te recordamos que mañana se llevarán a cabo los siguientes eventos programados en el calendario de la empresa:</p>
            
            <div class="event-list">
                @foreach($events as $event)
                    <div class="event-card">
                        @if(!empty($event->tipo))
                            <span class="event-type-badge">{{ $event->tipo }}</span>
                        @endif
                        <h3 class="event-title">{{ $event->titulo }}</h3>
                        
                        <p class="event-time-location">
                            ⏰ Horario: 
                            <strong>
                                {{ !empty($event->hora_inicio) ? substr($event->hora_inicio, 0, 5) : '00:00' }} 
                                @if(!empty($event->hora_fin))
                                    - {{ substr($event->hora_fin, 0, 5) }}
                                @endif
                            </strong>
                            @if(!empty($event->ubicacion))
                                &nbsp;&bull;&nbsp; 📍 Ubicación: <strong>{{ $event->ubicacion }}</strong>
                            @endif
                        </p>
                        
                        @if(!empty($event->descripcion))
                            <p class="event-description">{{ $event->descripcion }}</p>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Axioma. Todos los derechos reservados.</p>
            <p>Este es un recordatorio automático enviado el día anterior a cada evento.</p>
        </div>
    </div>
</body>
</html>
