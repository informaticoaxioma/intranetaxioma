<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cumpleaños de {{ $monthName }}</title>
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
            color: #fec7bfff;
            margin: 8px 0 0 0;
            font-size: 16px;
            font-weight: 500;
        }
        .content {
            padding: 40px 30px;
            color: #1f2937;
            text-align: center;
        }
        .content h2 {
            font-size: 20px;
            font-weight: 700;
            margin-top: 0;
            color: #4A1C23;
            text-align: center;
        }
        .intro-text {
            font-size: 15px;
            line-height: 1.6;
            color: #4b5563;
            text-align: center;
            margin-bottom: 30px;
        }
        .birthday-list {
            margin: 20px 0;
        }
        .birthday-card {
            display: table;
            width: 100%;
            background-color: #faf8f5;
            border: 1px solid #e8e0d5;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 12px;
            box-sizing: border-box;
        }
        .card-left {
            display: table-cell;
            vertical-align: middle;
            width: 60px;
            text-align: center;
        }
        .day-badge {
            background-color: #722F37;
            color: #ffffff;
            border-radius: 8px;
            padding: 8px 4px;
            width: 50px;
            font-weight: bold;
            box-sizing: border-box;
        }
        .day-number {
            font-size: 18px;
            line-height: 1.2;
            display: block;
        }
        .day-text {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: block;
        }
        .card-avatar {
            display: table-cell;
            vertical-align: middle;
            width: 65px;
            padding-left: 10px;
        }
        .avatar-img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #722F37;
            display: block;
        }
        .avatar-placeholder {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #e8e0d5;
            color: #4A1C23;
            font-size: 18px;
            font-weight: bold;
            line-height: 50px;
            text-align: center;
            border: 2px solid #722F37;
            display: block;
        }
        .card-info {
            display: table-cell;
            vertical-align: middle;
            padding-left: 15px;
        }
        .user-name {
            font-size: 16px;
            font-weight: 700;
            color: #2a110f;
            margin: 0 0 2px 0;
        }
        .user-details {
            font-size: 13px;
            color: #6b7280;
            margin: 0;
        }
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            background-color: #fafafa;
            border: 1px dashed #cccccc;
            border-radius: 12px;
            color: #6b7280;
        }
        .empty-icon {
            font-size: 36px;
            margin-bottom: 10px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
        }
        .celebration-banner {
            text-align: center;
            margin-top: 30px;
            padding: 15px;
            background-color: #fdf8f8;
            border-radius: 10px;
            border: 1px dashed #af201eff;
        }
        .celebration-banner p {
            margin: 0;
            font-size: 14px;
            color: #722F37;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🎉 Cumpleaños de {{ $monthName }} 🎂</h1>
            <p>Intranet Corporativa Axioma</p>
        </div>
        <div class="content">
            <h2>¡Comenzamos un nuevo mes de celebraciones!</h2>
            <p class="intro-text">Te presentamos la lista de todos nuestros compañeros de equipo que están de cumpleaños este mes de {{ strtolower($monthName) }}. ¡No olvides saludarlos y desearles un gran día en su fecha especial!</p>
            
            <div class="birthday-list">
                @forelse($birthdayUsers as $u)
                    <div class="birthday-card">
                        <div class="card-left">
                            <div class="day-badge">
                                <span class="day-number">{{ $u->fecha_nacimiento->format('d') }}</span>
                                <span class="day-text">Día</span>
                            </div>
                        </div>
                        <div class="card-avatar">
                            @if($u->path_foto_perfil)
                                <img src="{{ (strpos($u->path_foto_perfil, 'http') === 0) ? $u->path_foto_perfil : (env('VITE_API_URL', 'https://intranet.axioma.cl') . '/storage/' . $u->path_foto_perfil) }}" alt="{{ $u->name }}" class="avatar-img">
                            @else
                                <div class="avatar-placeholder">
                                    {{ strtoupper(substr($u->name, 0, 1) . substr($u->apellido, 0, 1)) }}
                                </div>
                            @endif
                        </div>
                        <div class="card-info">
                            <h3 class="user-name">{{ $u->name }} {{ $u->apellido }}</h3>
                            <p class="user-details">{{ $u->cargo }} • <strong>{{ $u->departamento }}</strong></p>
                        </div>
                    </div>
                @empty
                    <div class="empty-state">
                        <div class="empty-icon">📅</div>
                        <p>No hay cumpleaños registrados para este mes de {{ strtolower($monthName) }}.</p>
                    </div>
                @endforelse
            </div>

            @if($birthdayUsers->isNotEmpty())
                <div class="celebration-banner">
                    <p>✨ ¡Acompañemos a nuestros compañeros y celebremos juntos un año más de vida! ✨</p>
                </div>
            @endif
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Axioma. Todos los derechos reservados.</p>
            <p>Este es un recordatorio automático mensual enviado el primer día del mes.</p>
        </div>
    </div>
</body>
</html>
