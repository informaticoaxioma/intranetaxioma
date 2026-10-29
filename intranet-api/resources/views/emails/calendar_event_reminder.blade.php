<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recordatorio de Eventos - Intranet Axioma</title>
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
            padding: 38px 24px;
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
            font-size: 13.5px;
        }
        .header .badge {
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
            color: #111827;
        }
        .content h2 {
            font-size: 17px;
            font-weight: 800;
            margin-top: 0;
            color: #4A1C23;
            margin-bottom: 10px;
            border-bottom: 2px solid #FAF7F2;
            padding-bottom: 10px;
        }
        .intro-text {
            font-size: 15px;
            line-height: 1.6;
            color: #111827;
            margin-bottom: 24px;
        }
        .event-list {
            margin: 20px 0;
        }
        .event-card {
            border: 1px solid #E8E0D5;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
            box-sizing: border-box;
            background-color: #FAF7F2;
            border-left: 5px solid #722F37;
            transition: all 0.2s ease;
        }
        .event-type-badge {
            display: inline-block;
            background-color: rgba(114, 47, 55, 0.08);
            color: #722F37;
            border: 1px solid rgba(114, 47, 55, 0.2);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 3px 10px;
            border-radius: 6px;
            margin-bottom: 8px;
            letter-spacing: 0.04em;
        }
        .event-title {
            font-size: 17px;
            font-weight: 800;
            color: #4A1C23;
            margin: 0 0 8px 0;
            line-height: 1.35;
        }
        .event-meta {
            font-size: 13px;
            color: #64748b;
            margin: 0 0 10px 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
        }
        .event-meta-item {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-weight: 600;
            color: #111827;
        }
        .event-description {
            font-size: 14px;
            line-height: 1.6;
            color: #111827;
            margin: 0;
            white-space: pre-wrap;
            background-color: #ffffff;
            border: 1px solid #e8e0d5;
            border-radius: 8px;
            padding: 12px 14px;
        }
        .cta-container {
            text-align: center;
            margin: 28px 0 10px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #722F37 0%, #4A1C23 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(114, 47, 55, 0.25);
        }
        .footer {
            background-color: #FAF7F2;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #8c7377;
            border-top: 1px solid #e8e0d5;
        }
        .footer strong {
            color: #4A1C23;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- HEADER -->
        <div class="header">
            <h1>📅 Recordatorio de Eventos</h1>
            <p>Intranet Corporativa Axioma</p>
            <span class="badge">
                {{ !empty($isToday) ? '⚡ HOY EN EL CALENDARIO' : '📌 PROGRAMADOS PARA MAÑANA' }}
            </span>
        </div>

        <!-- CONTENT -->
        <div class="content">
            <h2>
                {{ !empty($isToday) ? 'Eventos programados para hoy:' : 'Próximos eventos para mañana:' }} {{ $date }}
            </h2>
            <p class="intro-text">
                Hola, te recordamos que <strong>{{ !empty($isToday) ? 'hoy' : 'mañana' }}</strong> se llevarán a cabo los siguientes eventos programados en el calendario de la empresa:
            </p>

            <div class="event-list">
                @foreach($events as $event)
                    <div class="event-card">
                        @if(!empty($event->tipo))
                            <span class="event-type-badge">{{ $event->tipo }}</span>
                        @endif

                        <h3 class="event-title">{{ $event->titulo }}</h3>

                        @if(!empty($event->hora_inicio) || !empty($event->ubicacion))
                            <div class="event-meta">
                                @if(!empty($event->hora_inicio))
                                    <span class="event-meta-item">
                                        ⏰ {{ substr($event->hora_inicio, 0, 5) }}{{ !empty($event->hora_fin) ? ' - ' . substr($event->hora_fin, 0, 5) : '' }} hrs.
                                    </span>
                                @endif
                                @if(!empty($event->ubicacion))
                                    <span class="event-meta-item">
                                        📍 {{ $event->ubicacion }}
                                    </span>
                                @endif
                            </div>
                        @endif

                        @if(!empty($event->descripcion))
                            <p class="event-description">{{ $event->descripcion }}</p>
                        @endif
                    </div>
                @endforeach
            </div>

            <!-- CTA -->
            <div class="cta-container">
                <a href="{{ config('app.url') }}/dashboard" class="cta-button" target="_blank">
                    Ver Calendario en la Intranet
                </a>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p style="margin: 0 0 6px;">
                <strong>Intranet Axioma</strong> &bull; Calendario Corporativo
            </p>
            <p style="margin: 0;">
                Este es un recordatorio automático enviado {{ !empty($isToday) ? 'el mismo día del evento' : 'el día anterior a cada evento' }}.
            </p>
        </div>
    </div>
</body>
</html>
