<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualización de Ticket {{ $ticket->code }} - Intranet Axioma</title>
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
            padding: 34px 24px;
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
            font-size: 13px;
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
            margin-top: 12px;
        }
        .content {
            padding: 30px 26px;
            color: #1f2937;
        }

        /* HERO TRANSITION CARD */
        .status-hero {
            background-color: #FAF7F2;
            border: 1.5px solid #E8E0D5;
            border-radius: 14px;
            padding: 22px 20px;
            margin-bottom: 24px;
            text-align: center;
        }
        .status-hero-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #722F37;
            margin-bottom: 14px;
        }
        .transition-flow {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 14px;
        }
        .status-tag {
            display: inline-block;
            padding: 7px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.02em;
        }
        .arrow-indicator {
            font-size: 18px;
            font-weight: 900;
            color: #94a3b8;
        }

        /* STATUS SPECIFIC STYLES */
        .status-tag-pendiente {
            background-color: #fef3c7;
            color: #92400e;
            border: 1.5px solid #fde68a;
        }
        .status-tag-en_proceso {
            background-color: #dbeafe;
            color: #1e40af;
            border: 1.5px solid #bfdbfe;
        }
        .status-tag-resuelto {
            background-color: #dcfce7;
            color: #166534;
            border: 1.5px solid #bbf7d0;
        }
        .status-tag-cerrado {
            background-color: #f1f5f9;
            color: #475569;
            border: 1.5px solid #e2e8f0;
        }

        .status-message {
            margin: 0;
            font-size: 14px;
            line-height: 1.5;
            color: #111827;
            font-weight: 500;
        }

        /* ADMIN NOTES BOX */
        .notes-card {
            background: linear-gradient(135deg, #f0fdf4 0%, #FAF7F2 100%);
            border: 1.5px solid #bbf7d0;
            border-left: 5px solid #722F37;
            border-radius: 12px;
            padding: 18px 20px;
            margin-bottom: 24px;
        }
        .notes-card-title {
            font-size: 12px;
            font-weight: 800;
            color: #722F37;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .notes-card-body {
            font-size: 14.5px;
            line-height: 1.6;
            color: #111827;
            margin: 0;
            white-space: pre-wrap;
        }

        /* DETAILS BOX */
        .details-box {
            background-color: #faf8f5;
            border: 1px solid #e8e0d5;
            border-radius: 12px;
            padding: 18px 20px;
            margin-bottom: 24px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px dashed #e8e0d5;
        }
        .detail-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
        }
        .detail-row:first-child {
            padding-top: 0;
        }
        .detail-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #722F37;
            font-weight: 700;
        }
        .detail-value {
            font-size: 13.5px;
            color: #111827;
            font-weight: 700;
            text-align: right;
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
            background-color: #faf8f5;
            padding: 22px;
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
    @php
        $statusLabels = [
            'pendiente'  => 'Pendiente',
            'en_proceso' => 'En Proceso',
            'resuelto'   => 'Resuelto',
            'cerrado'    => 'Cerrado',
        ];
        $oldLabel = $statusLabels[$oldStatus] ?? ucfirst($oldStatus);
        $newLabel = $statusLabels[$newStatus] ?? ucfirst($newStatus);

        $statusDescriptions = [
            'en_proceso' => 'Tu solicitud ha sido tomada por el equipo de soporte y se encuentra actualmente en atención.',
            'resuelto'   => '¡Tu requerimiento ha sido resuelto con éxito! Te invitamos a comprobar que la solución se haya aplicado correctamente.',
            'cerrado'    => 'Tu ticket ha sido cerrado formalmente. Agradecemos tu contacto y quedamos a tu disposición ante cualquier consulta.',
            'pendiente'  => 'Tu ticket ha sido marcado como pendiente para revisión y seguimiento.',
        ];
        $statusMessage = $statusDescriptions[$newStatus] ?? 'El estado de tu ticket ha sido actualizado en la plataforma.';
    @endphp

    <div class="email-container">
        <!-- HEADER -->
        <div class="header">
            <h1>INTRANET AXIOMA</h1>
            <p>Mesa de Ayuda &bull; Notificación de Avance</p>
            <span class="badge">🎫 TICKET #{{ $ticket->code }}</span>
        </div>

        <!-- CONTENT -->
        <div class="content">
            <h2 style="margin: 0 0 6px; color: #4A1C23; font-size: 19px; font-weight: 800;">
                Hola, {{ $ticket->user->name ?? 'Colaborador' }}
            </h2>
            <p style="margin: 0 0 20px; font-size: 14px; color: #64748b; line-height: 1.5;">
                Queremos informarte que se ha actualizado el estado de tu ticket de requerimiento:
            </p>

            <!-- HERO STATUS TRANSITION -->
            <div class="status-hero">
                <div class="status-hero-title">Cambio de Estado Registrado</div>
                <div class="transition-flow">
                    <span class="status-tag status-tag-{{ $oldStatus }}">
                        {{ $oldLabel }}
                    </span>
                    <span class="arrow-indicator">&rarr;</span>
                    <span class="status-tag status-tag-{{ $newStatus }}">
                        {{ $newLabel }}
                    </span>
                </div>
                <p class="status-message">
                    {{ $statusMessage }}
                </p>
            </div>

            <!-- ADMIN NOTES IF PRESENT -->
            @if(!empty($adminNotes))
            <div class="notes-card">
                <div class="notes-card-title">
                    <span>💬</span> Observaciones del Equipo de Soporte:
                </div>
                <p class="notes-card-body">{{ $adminNotes }}</p>
            </div>
            @endif

            <!-- TICKET SUMMARY TABLE -->
            <h3 style="margin: 0 0 12px; color: #4A1C23; font-size: 16px; font-weight: 700;">
                Resumen del Requerimiento
            </h3>

            <div class="details-box">
                <div class="detail-row">
                    <span class="detail-label">Código de Ticket</span>
                    <span class="detail-value" style="color: #722F37; font-weight: 800;">{{ $ticket->code }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Título / Asunto</span>
                    <span class="detail-value">{{ $ticket->title }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Categoría</span>
                    <span class="detail-value">{{ $ticket->category }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Prioridad</span>
                    <span class="detail-value">{{ ucfirst($ticket->priority) }}</span>
                </div>
                @if($ticket->assignedUser)
                <div class="detail-row">
                    <span class="detail-label">Atendido por</span>
                    <span class="detail-value">{{ $ticket->assignedUser->name }} {{ $ticket->assignedUser->apellido ?? '' }}</span>
                </div>
                @endif
                <div class="detail-row">
                    <span class="detail-label">Fecha de Actualización</span>
                    <span class="detail-value">{{ now()->format('d/m/Y H:i') }}</span>
                </div>
            </div>

            <!-- CTA BUTTON -->
            <div class="cta-container">
                <a href="{{ config('app.url') }}/dashboard" class="cta-button" target="_blank">
                    Ver Ticket en la Intranet
                </a>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <p style="margin: 0 0 6px;">
                <strong>Intranet Axioma</strong> &bull; Mesa de Ayuda y Soporte TI
            </p>
            <p style="margin: 0;">
                Este es un mensaje generado automáticamente. No es necesario responder directamente a este correo.
            </p>
        </div>
    </div>
</body>
</html>
