# Nexo Store · Proyecto Final Backend

E-commerce full-stack construido con **Node.js, Express, MongoDB y Handlebars**. El proyecto combina un storefront navegable con una API REST documentada en Swagger, autenticación, carrito persistente, recuperación de contraseña y compra con control de stock.

## Qué incluye

- Registro e inicio de sesión con Passport y contraseñas protegidas con BCrypt.
- Inicio de sesión opcional con GitHub OAuth mediante variables de entorno.
- Carrito persistido en MongoDB y asociado a cada usuario.
- Catálogo, búsqueda, orden por precio, detalle y paginación.
- Alta, edición y consulta de productos desde la API.
- Compra con validación de stock y generación de ticket.
- Recuperación de contraseña con token de una hora.
- Roles `User` y `Admin` con middleware de autorización.
- Panel visual para consultar usuarios y crear administradores.
- Swagger UI en `/apidocs` y health check en `/health`.
- Storefront responsive con Handlebars, CSS y JavaScript vanilla.

## Arquitectura

```text
Views → Controllers → Services → DAO → MongoDB
                         ↘ Models
```

La separación entre controladores, servicios y DAO permite mantener las vistas desacopladas de la persistencia.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- Express Handlebars
- Passport Local / GitHub
- Express Session + Connect Mongo
- BCrypt
- Nodemailer
- Swagger
- Mocha + Chai

## Puesta en marcha

```bash
npm install
cp .envExample .env
npm run dev
```

En Windows podés copiar `.envExample` manualmente como `.env`.

Variables principales:

| Variable | Uso |
| --- | --- |
| `MONGODB_URL` | Conexión a MongoDB |
| `SESSION_SECRET` | Firma de sesión |
| `PORT` | Puerto del servidor, por defecto 8080 |
| `GITHUB_CLIENT_ID` | OAuth de GitHub, opcional |
| `GITHUB_CLIENT_SECRET` | OAuth de GitHub, opcional |
| `GITHUB_CALLBACK_URL` | Callback OAuth |
| `GOOGLE_USER` | Cuenta para recuperación por email |
| `GOOGLE_PASSWORD` | App password del correo |
| `BOOTSTRAP_ADMIN_EMAIL` | Email que podrá registrarse inicialmente como Admin |
| `APP_URL` | URL pública usada en enlaces de recuperación |

## Calidad

```bash
npm test
npm run check
```

Los tests incluidos cubren hashing de contraseñas y autorización de roles sin depender de una base de datos externa.

## Seguridad

Las credenciales y secretos no deben escribirse en el código. Usá siempre variables de entorno y rotá cualquier clave que haya sido publicada accidentalmente en el historial de Git.

## API

Con el proyecto en ejecución:

- Storefront: `http://localhost:8080`
- Swagger: `http://localhost:8080/apidocs`
- Health: `http://localhost:8080/health`

Los endpoints principales viven bajo `/api/products`, `/api/cart`, `/api/session` y `/api/password-reset`.
