<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

# Intranet API Backend

Backend corporativo desarrollado con Laravel 12 para una intranet empresarial.

Incluye:

- Autenticación con Sanctum
- Roles y permisos
- Gestión de usuarios
- Noticias
- Eventos
- Documentos
- Documentos Laborales
- Muro Contrato
- API RESTful para integración con React / Next.js

---

# Tecnologías

- PHP 8.3
- Laravel 12
- Sanctum
- Spatie Roles & Permissions
- SQLite / MySQL
- API REST

---

# Instalación del proyecto

```bash
# Descargar el proyecto
git clone REPOSITORIO
cd intranet-api

# 1. Instalar dependencias de backend
composer install

# 2. Crear variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Generar APP_KEY
php artisan key:generate

# 4. Migrar la base de datos
php artisan migrate

# 5. Crear roles y usuario administrador
php artisan db:seed

# 6. Instalar dependencias de frontend
npm install

# 7. Levantar servidor de desarrollo
npm run dev
php artisan serve
```

Esto:

- recrea tablas
- recrea roles
- recrea usuario admin
---

# Configuración Base de Datos

## Opción SQLite (Recomendada para desarrollo)

Configurar `.env`:

```env
DB_CONNECTION=sqlite
```

Comentar el resto:

```env
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

---

## Opción MySQL

Configurar `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=intranet
DB_USERNAME=root
DB_PASSWORD=password
```

---

# Instalar Sanctum

```bash
composer require laravel/sanctum
```

Publicar configuración:

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

---

# Usuario Administrador

```text
Email:
admin@intranet.cl

Password:
Admin123*
```

---

# Levantar servidor

```bash
php artisan serve
```

Servidor:

```text
http://127.0.0.1:8000
```

API:

```text
http://127.0.0.1:8000/api
```

---

# Configuración bootstrap/app.php

Debes habilitar las rutas API.

## bootstrap/app.php

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',

        api: __DIR__.'/../routes/api.php',

        commands: __DIR__.'/../routes/console.php',

        health: '/up',
    )
    ->withMiddleware(function ($middleware) {

        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

    })->create();
```

---

# Estructura del Proyecto

```text
app/
├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   ├── Requests/
│   └── Resources/
│
├── Models/
├── Services/
├── Policies/
└── Providers/

routes/
├── api.php
└── web.php
```

---

# Roles del sistema

## Administrador

Puede:

- Gestionar usuarios
- Crear noticias
- Editar noticias
- Eliminar noticias
- Gestionar eventos
- Gestionar documentos
- Gestionar liquidaciones
- Gestionar vacaciones

---

## Usuario

Puede:

- Ver noticias
- Descargar documentos
- Descargar liquidaciones
- Ver eventos
- Solicitar vacaciones

NO puede:

- Gestionar usuarios
- Acceder al panel administrador
- Eliminar registros

---

# Login API

## Endpoint

```http
POST /api/login
```

## Request

```json
{
  "email": "admin@intranet.cl",
  "password": "Admin123*"
}
```

## Response

```json
{
  "token": "1|asdasdasd",
  "user": {
    "id": 1,
    "name": "Administrador",
    "email": "admin@intranet.cl"
  },
  "roles": [
    "admin"
  ]
}
```

---

# Autenticación Bearer Token

Enviar headers:

```http
Authorization: Bearer TU_TOKEN
Accept: application/json
```

---

# Endpoints Principales

## Noticias

| Método | Endpoint |
|---|---|
| GET | /api/news |
| POST | /api/news |
| PUT | /api/news/{id} |
| DELETE | /api/news/{id} |

---

## Eventos

| Método | Endpoint |
|---|---|
| GET | /api/events |
| POST | /api/events |
| PUT | /api/events/{id} |
| DELETE | /api/events/{id} |

---

## Usuarios

| Método | Endpoint |
|---|---|
| GET | /api/users |
| POST | /api/users |
| PUT | /api/users/{id} |
| DELETE | /api/users/{id} |

---

# Crear Nuevos Modelos

## Crear modelo + migración + controller

```bash
php artisan make:model Example -mcr
```

---

# Crear Services

```bash
mkdir app/Services
```

Ejemplo:

```bash
touch app/Services/ExampleService.php
```

---

# Limpiar Caché

```bash
php artisan optimize:clear
```

---

# Ver rutas disponibles

```bash
php artisan route:list
```

---

#   Integración Frontend React / Next.js

## Login

```javascript
const response = await fetch(
  'http://127.0.0.1:8000/api/login',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  }
);

const data = await response.json();

localStorage.setItem('token', data.token);
```

---

# Consumir rutas protegidas

```javascript
const response = await fetch(
  'http://127.0.0.1:8000/api/news',
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
```

---

# Recomendaciones

## Frontend

- Next.js
- Material UI
- Axios
- TanStack Query
- Zustand

---

## Backend

- Laravel Sanctum
- Spatie Roles & Permissions
- Policies
- Services
- API Resources

---

# Producción

Recomendado:

- Apache/Nginx
- PHP-FPM
- MariaDB
- SSL HTTPS
- Supervisor
- PM2 para frontend React

---

# Comandos útiles

## Ver logs

```bash
tail -f storage/logs/laravel.log
```

---

## Ver rutas

```bash
php artisan route:list
```

---

## Limpiar caché

```bash
php artisan optimize:clear
```

---

# Autor

Proyecto Backend Intranet desarrollado con Laravel 12.
