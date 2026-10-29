<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @php
        $authorFullName = trim($author->name . ' ' . ($author->apellido ?? ''));
        if (empty($authorFullName)) {
            $authorFullName = $author->email;
        }
        $wallUrl = config('app.url') . '/dashboard/wall';
    @endphp
    <title>Mira lo que  {{ $authorFullName }} publicó en el Muro - Intranet Axioma</title>
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
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.02em;
        }
        .header p {
            color: #111827;
            margin: 6px 0 0 0;
            font-size: 14px;
        }
        .badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.18);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.35);
            border-radius: 100px;
            padding: 5px 16px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.05em;
            margin-top: 14px;
            text-transform: uppercase;
        }
        .content {
            padding: 38px 30px;
            color: #111827;
        }
        .invitation-hero {
            background: #FAF7F2;
            border: 1px solid #E8E0D5;
            border-left: 6px solid #722F37;
            border-radius: 12px;
            padding: 22px 24px;
            margin-bottom: 26px;
            text-align: left;
        }
        .invitation-hero h2 {
            margin: 0 0 8px 0;
            color: #4A1C23;
            font-size: 21px;
            font-weight: 800;
            line-height: 1.35;
        }
        .invitation-hero p {
            margin: 0;
            color: #722F37;
            font-size: 15.5px;
            font-weight: 700;
            line-height: 1.45;
        }
        .author-box {
            display: table;
            width: 100%;
            background-color: #FAF7F2;
            border: 1px solid #E8E0D5;
            border-radius: 12px;
            padding: 16px 18px;
            margin-bottom: 24px;
            box-sizing: border-box;
        }
        .author-avatar-cell {
            display: table-cell;
            vertical-align: middle;
            width: 52px;
        }
        .author-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #722F37;
            display: block;
        }
        .author-avatar-placeholder {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: #722F37;
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
            line-height: 48px;
            text-align: center;
            display: block;
        }
        .author-info-cell {
            display: table-cell;
            vertical-align: middle;
            padding-left: 14px;
        }
        .author-name {
            font-size: 16px;
            font-weight: 800;
            color: #4A1C23;
            margin: 0 0 3px 0;
        }
        .author-details {
            font-size: 13.5px;
            color: #111827;
            margin: 0;
        }
        .invitation-text {
            font-size: 15.5px;
            line-height: 1.65;
            color: #111827;
            margin: 0 0 24px 0;
            text-align: left;
        }
        .info-card {
            background-color: #FAF7F2;
            border: 1px solid #E8E0D5;
            border-left: 4px solid #722F37;
            border-radius: 10px;
            padding: 16px 20px;
            margin-bottom: 28px;
            font-size: 14px;
            line-height: 1.5;
            color: #111827;
        }
        .btn-container {
            text-align: center;
            margin: 32px 0 12px;
        }
        .btn {
            background: linear-gradient(135deg, #722F37 0%, #4A1C23 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 15px 38px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 15.5px;
            display: inline-block;
            box-shadow: 0 4px 12px rgba(114, 47, 55, 0.3);
            letter-spacing: 0.01em;
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
        <!-- HEADER -->
        <div class="header">
            <h1>INTRANET AXIOMA</h1>
            <p>Comunidad y Muro de Colaboradores</p>
            <div class="badge">💬 Nueva Publicación en el Muro</div>
        </div>

        <!-- CONTENT -->
        <div class="content">
            <!-- INVITATION HERO -->
            <div class="invitation-hero">
                <h2>Mira lo que {{ $authorFullName }} publicó en el Muro</h2>
                <p>¡Hazte parte de lo que estamos comentando en Axioma!</p>
            </div>

            <!-- AUTHOR INFO CARD -->
            <div class="author-box">
                <div class="author-avatar-cell">
                    @if($author->path_foto_perfil)
                        <img src="{{ asset('storage/' . $author->path_foto_perfil) }}" alt="{{ $authorFullName }}" class="author-avatar">
                    @elseif($author->foto_perfil)
                        <img src="{{ $author->foto_perfil }}" alt="{{ $authorFullName }}" class="author-avatar">
                    @else
                        <span class="author-avatar-placeholder">{{ strtoupper(substr($author->name, 0, 1)) }}</span>
                    @endif
                </div>
                <div class="author-info-cell">
                    <div class="author-name">{{ $authorFullName }}</div>
                    <div class="author-details">
                        {{ $author->cargo ?? 'Colaborador' }}
                        @if($author->departamento)
                            &bull; <strong>{{ $author->departamento }}</strong>
                        @endif
                        @if($post->contrato)
                            &bull; <span>{{ $post->contrato }}</span>
                        @endif
                    </div>
                </div>
            </div>

            <p class="invitation-text">
                <strong>{{ $authorFullName }}</strong> ha compartido una nueva publicación en el Muro de la Intranet Axioma.
            </p>

            <div class="info-card">
                💡 Para descubrir el contenido completo de la publicación, compartir tus impresiones o reaccionar, ingresa directamente al Muro de nuestra Intranet.
            </div>

            <!-- CALL TO ACTION BUTTON -->
            <div class="btn-container">
                <a href="{{ $wallUrl }}" class="btn">Ir al Muro y Participar</a>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p>&copy; {{ date('Y') }} Axioma Ingenieros Consultores. Todos los derechos reservados.</p>
            <p style="margin: 4px 0 0 0;">Este es un correo automático del Muro de Colaboradores de Axioma.</p>
        </div>
    </div>
</body>
</html>
