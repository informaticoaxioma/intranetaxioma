# Documento Técnico Explicativo: Proyecto Intranet Axioma

Este documento proporciona una descripción detallada de la arquitectura, funcionamiento, estructura del código y flujos del proyecto de la Intranet Corporativa de **Axioma**. Está estructurado para que tanto desarrolladores humanos como agentes de Inteligencia Artificial (IA) puedan comprender rápidamente el funcionamiento del sistema, localizar componentes y aplicar modificaciones respetando los patrones de diseño existentes.

---

## 1. Arquitectura General y Stack Tecnológico

El proyecto de la intranet está implementado en la rama `laravel` mediante una arquitectura **monolítica desacoplada en el despliegue de assets**:
* **Backend:** Laravel 13 (PHP ^8.3). Actúa como una API REST y, a su vez, sirve el punto de entrada de la aplicación de cliente (SPA).
* **Frontend:** Single Page Application (SPA) construida con React (v19) y Material UI (MUI v9), empaquetada mediante Vite.
* **Base de Datos:** MySQL.
* **Autenticación:** Autenticación basada en API Tokens (mediante Laravel Sanctum) transmitidos vía cabecera `Authorization: Bearer <token>` y almacenados en el cliente en `localStorage`.

### Flujo de Carga de la Aplicación (SPA)
1. **Entrada Web:** Cuando un usuario ingresa a la intranet, la solicitud es capturada en Laravel por la ruta comodín definida en [`routes/web.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/routes/web.php):
   ```php
   Route::get('/{any}', function () {
       return view('app');
   })->where('any', '.*');
   ```
2. **Vista Base:** Laravel carga la vista Blade [`app.blade.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/views/app.blade.php), que contiene la directiva `@viteReactRefresh` y carga [`bootstrap.jsx`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/bootstrap.jsx).
3. **Montaje de React:** El script [`bootstrap.jsx`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/bootstrap.jsx) monta el componente principal [`App`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/app.jsx) en el nodo `#app`.
4. **Router de React:** El componente principal inicializa el contexto de autenticación (`AuthProvider`), define el tema de Material UI (`muiTheme`), y carga el enrutador principal [`AppRouter.jsx`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/router/AppRouter.jsx) para gestionar las rutas en el cliente mediante `react-router-dom`.

---

## 2. Base de Datos y Modelos (Eloquent)

Los modelos de la base de datos se encuentran en [`app/Models`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Models). A continuación se detallan las entidades clave y sus campos principales:

* **`User`** ([`User.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Models/User.php)):
  * Representa a los empleados de la organización.
  * **Campos clave:** `name`, `apellido`, `rut` (RUT chileno único), `email`, `password` (encriptado), `telefono`, `direccion`, `fecha_nacimiento`, `departamento`, `cargo`, `fecha_ingreso`, `contrato`, `foto_perfil`, `path_foto_perfil`, `supervision_general`, `role` (directo para propósitos visuales) y `estado_cuenta` (`activo`, `inactivo`, `suspendido`).
  * **Relaciones:** `vacations()` (uno a muchos), `payrolls()` (uno a muchos), `laborDocuments()` (uno a muchos).
  * **Roles (Spatie):** Utiliza el trait `HasRoles` de Spatie para el control de acceso en la API.
* **`Vacation`** ([`Vacation.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Models/Vacation.php)):
  * Registro de solicitudes de vacaciones por parte del personal.
  * **Campos clave:** `user_id` (quien solicita), `fecha_inicio`, `fecha_fin`, `dias_solicitados`, `estado` (`pendiente`, `aprobado`, `rechazado`), `aprobado_por` (relación al `User` admin), `fecha_aprobacion`, `comentario`, `comentario_admin`.
* **`Payroll`** ([`Payroll.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Models/Payroll.php)):
  * Almacena las liquidaciones de sueldo de cada usuario.
  * **Campos clave:** `user_id`, `periodo` (ej: `2026-08`), `path` (ruta al archivo en storage), `nombre_archivo`.
* **`Document`** ([`Document.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Models/Document.php)):
  * Documentos generales compartidos (normativas, instructivos, etc.).
  * **Campos clave:** `titulo`, `descripcion`, `path`, `nombre_archivo`, `categoria`, `extension`, `peso`.
* **`LaborDocument`** ([`LaborDocument.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Models/LaborDocument.php)):
  * Contratos de trabajo u otros documentos contractuales por empleado.
* **`News`** ([`News.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Models/News.php)):
  * Noticias o comunicados publicados en la intranet.
  * **Campos clave:** `titulo`, `contenido`, `fecha`, `imagen`, `path_imagen`.
* **`Event`** ([`Event.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Models/Event.php)):
  * Eventos corporativos para el calendario.
  * **Campos clave:** `titulo`, `descripcion`, `fecha_inicio`, `fecha_fin`, `color`.
* **`WallPost`, `WallComment`, `WallReaction`**:
  * Representan el muro social de la empresa. Publicaciones (`WallPost`), comentarios (`WallComment`), y reacciones (`WallReaction`) como likes de los usuarios.

---

## 3. Capa de Negocio y Servicios (Backend)

En lugar de definir la lógica de negocio directamente en los controladores HTTP, el proyecto implementa un patrón de **Services** dentro de [`app/Services`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Services).

### Patrón de Servicios
Los controladores reciben la solicitud HTTP, realizan la validación de los datos de entrada, y delegan la ejecución a un servicio específico inyectado en el constructor:

* **[`VacationService.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Services/VacationService.php):** Gestiona la lógica para listar vacaciones de usuarios normales, de todos los empleados para administradores, creación de solicitudes y los métodos específicos de transición de estado `approve()` y `reject()`.
* **[`WallService.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Services/WallService.php):** Gestiona publicaciones, comentarios y registro/eliminación de reacciones (likes) en el muro social.
* **[`PayrollService.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Services/PayrollService.php):** Gestiona almacenamiento de archivos PDF de liquidaciones de sueldo.
* **[`DocumentService.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Services/DocumentService.php):** Gestiona los archivos compartidos de la empresa.

---

## 4. Control de Acceso y Rutas de API

El enrutamiento de la API se localiza en [`routes/api.php`](file:///home/cristobalnunez/intranetaxioma/intranet-api/routes/api.php).

### Clasificación de Endpoints
1. **Públicos / Sin Autenticación:**
   * `POST /api/login`: Inicio de sesión (retorna token Sanctum y datos de rol).
   * `POST /api/register`: Registro de usuario (acceso restringido a nivel práctico, pero expuesto para seeds).
   * `GET /api/news` y `/api/news/{id}`: Lectura de noticias sin requerir sesión activa.
2. **Protegidos por Autenticación (`auth:sanctum`):**
   * Datos del usuario logueado (`GET /api/me`), actualización de avatar (`POST /api/me/avatar`), logout (`POST /api/logout`).
   * Visualización de eventos (`GET /api/events`), documentos corporativos (`GET /api/documents`) con rutas de descarga y vista previa.
   * Visualización del muro social (`GET /api/wall` y sub-rutas para comentar/reaccionar).
   * Liquidaciones de sueldo propias (`GET /api/my-payrolls`).
   * Solicitud y visualización de vacaciones propias (`POST /api/vacations`, `GET /api/my-vacations`).
3. **Exclusivos de Administrador (`middleware(['role:admin'])`):**
   * CRUD de usuarios (`/api/users`).
   * CRUD de noticias, eventos y documentos generales.
   * Gestión de vacaciones (aprobación/rechazo de solicitudes mediante `PATCH /api/vacations/{vacation}/approve` y `/reject`).
   * Carga y edición de liquidaciones de sueldo generales.

---

## 5. Frontend React SPA

El frontend se desarrolla bajo [`intranet-api/resources/js`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js).

### Estructura de Carpetas del Frontend
* **`components/`:** Componentes estructurales reutilizables, principalmente navegación:
  * [`header-nav.jsx`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/components/header-nav.jsx): Barra superior de la intranet con perfil de usuario y notificaciones.
  * [`sidebar-nav.jsx`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/components/sidebar-nav.jsx): Panel de navegación lateral con links correspondientes según el rol (`admin` o `user`).
* **`layouts/`:** Envolturas de estructura visual.
  * [`DashboardLayout.jsx`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/layouts/DashboardLayout.jsx): Integra el header y sidebar para las páginas autenticadas.
* **`hooks/`:** Contextos de estado global de React.
  * [`AuthContext.jsx`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/hooks/AuthContext.jsx): Inicializa y distribuye el estado del usuario sincronizándolo con `localStorage` bajo la clave `"user"`.
* **`services/`:**
  * [`api.js`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/services/api.js): Contiene las llamadas a la API usando la API nativa de JavaScript `fetch`. Lee el Bearer token de `localStorage.getItem("token")`.
* **`router/`:**
  * [`AppRouter.jsx`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/router/AppRouter.jsx): Declara el árbol de enrutado.
  * [`PrivateRoute.jsx`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/router/PrivateRoute.jsx): Envuelve vistas que requieren sesión (verifica la presencia del token).
  * [`AdminRoute.jsx`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/router/AdminRoute.jsx): Envuelve vistas exclusivas de administrador (verifica que el rol del usuario contenga `admin`).
* **`pages/`:** Contiene subcarpetas por módulo con sus respectivas vistas (creación, edición, listados):
  * `auth/`: Inicio de sesión.
  * `dashboard/`: Página de inicio del portal intranet con estadísticas.
  * `profile/`: Visualización y edición del perfil del empleado.
  * `users/`: Listado, edición y creación de usuarios.
  * `news/`: Sección de comunicados y noticias.
  * `calendar/`: Calendario mensual interactivo de eventos corporativos.
  * `payroll/`: Subida y revisión de liquidaciones de sueldo.
  * `vacations/`: Módulo de solicitud y aprobación de vacaciones.
  * `wall/`: Muro interactivo tipo red social corporativa.

---

## 6. Mails y Notificaciones

El sistema envía correos electrónicos automatizados a los empleados en base a eventos de negocio. Los correos se definen en [`app/Mail`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Mail):

* **`UserCredentialsMail.php`:** Envía las credenciales generadas automáticamente a un nuevo usuario registrado por el administrador.
* **`BirthdayGreetingMail.php`:** Saludo de cumpleaños al empleado en su día.
* **`MonthlyBirthdaysReminderMail.php`:** Recordatorio a toda la empresa o al área de recursos humanos con la lista de cumpleaños del mes actual.
* **`CalendarEventReminderMail.php`:** Recordatorio de un evento corporativo del calendario.
* **`NewsPublishedMail.php`:** Notificación masiva de la publicación de un nuevo anuncio o noticia importante.
* **`PasswordChangedMail.php`:** Correo informativo de seguridad cuando el usuario actualiza su contraseña.

---

## 7. Scripts y Utilidades Adicionales

### Script de Importación Masiva de Usuarios: `importar_usuarios.py`
Ubicado en la raíz del proyecto ([`importar_usuarios.py`](file:///home/cristobalnunez/intranetaxioma/importar_usuarios.py)), es un script en Python escrito para facilitar la ingesta masiva de usuarios en producción.
* **Funcionamiento:** Lee una planilla de Excel (`.xlsx`), mapea los nombres de columna en español (RUT, nombre, departamento, cargo, etc.) a las claves de la API REST correspondientes y ejecuta peticiones HTTP POST al endpoint de la API (`/api/register` o similar).
* **Parámetros:** Permite definir la URL del servidor API (`--api-url`) y las credenciales de administración para autorizar las solicitudes.
* **Generación de Plantilla:** Ejecutando `python importar_usuarios.py --crear-plantilla` genera un archivo de ejemplo estructurado correctamente para su posterior edición.

---

## 8. Guía de Configuración Local

Para ejecutar la intranet en desarrollo:

1. **Backend / Servidor de API (Laravel):**
   * Ir al directorio [`intranet-api`](file:///home/cristobalnunez/intranetaxioma/intranet-api).
   * Configurar el archivo `.env` tomando como base el archivo `.env.example`.
   * Ejecutar la base de datos MySQL local y asegurarse de definir las credenciales correctas en el `.env` (puerto `3306`, base de datos `intranet`).
   * Configurar las credenciales de correo SMTP (el sistema actualmente usa la configuración SMTP de Zimbra `zm006.zimbramail.cl`).
   * Instalar dependencias PHP: `composer install`.
   * Generar la clave de la app: `php artisan key:generate`.
   * Ejecutar migraciones y seeders iniciales: `php artisan migrate --seed`. (Esto creará el rol de admin y el usuario administrador inicial `admin@intranet.cl` con contraseña `Admin123*`).
2. **Vite y Node Dependencias:**
   * Instalar dependencias Node dentro de `intranet-api`: `npm install`.
   * Para levantar el servidor de desarrollo conjunto (Laravel + Vite asset compiler):
     `npm run dev` (que ejecuta concurrentemente `php artisan serve` y el compilador de Vite).

---

## 9. Guía de Contexto para Agentes de IA

Si eres un agente de IA que trabaja en este repositorio, ten en cuenta las siguientes directrices y mejores prácticas establecidas:

1. **Uso de Clases de Servicio (Services):** Si necesitas implementar o modificar lógica que interactúe con la base de datos o lógica de negocio (ej. agregar un validador al flujo de vacaciones, cambiar la lógica de carga de liquidaciones), **no agregues ese código en los controladores**. Escribe o modifica los métodos dentro del servicio correspondiente en [`app/Services`](file:///home/cristobalnunez/intranetaxioma/intranet-api/app/Services) y mantén los controladores limpios.
2. **Vías de Comunicación Frontend-API:** El frontend realiza solicitudes HTTP utilizando llamadas directas a través del objeto `fetch` definido en [`services/api.js`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/services/api.js). Si creas un nuevo endpoint en el backend, debes agregar la función de llamada correspondiente en este archivo utilizando la estructura de cabeceras de autorización Bearer ya implementada.
3. **Manejo de Rutas en React:** Si creas una nueva pantalla en React, añádela a [`AppRouter.jsx`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/router/AppRouter.jsx). Recuerda envolverla en `<PrivateRoute>` si requiere inicio de sesión, o en `<AdminRoute>` si es exclusiva para administradores.
4. **Diseño de Interfaz:** La interfaz utiliza Material UI (MUI) configurada con un tema base definido en [`intranet-api/resources/js/lib/theme.js`](file:///home/cristobalnunez/intranetaxioma/intranet-api/resources/js/lib/theme.js). Evita escribir estilos ad-hoc con CSS plano si puedes utilizar el sistema de Grid, componentes estilizados o la propiedad `sx` de MUI para mantener la armonía de diseño.
5. **Base de Datos y Migraciones:** Al crear nuevas tablas o columnas, genera siempre una migración mediante `php artisan make:migration`. No edites directamente bases de datos locales sin dejar registro en las migraciones.
6. **Manejo de Roles:** Utiliza la validación Spatie en el backend (`$user->assignRole('admin')` o `$user->hasRole('admin')`) y utiliza el campo `role` del estado del usuario en el frontend (`user.role === 'admin'`) para alternar menús en la navegación de manera reactiva.
