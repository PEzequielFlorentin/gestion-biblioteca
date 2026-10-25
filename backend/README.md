# Backend — Gestión de Biblioteca

API REST para la gestión de una biblioteca (libros, autores, géneros y préstamos) con autenticación JWT y roles de usuario.

## 🔗 URL de producción

https://gestion-biblioteca-38dg.onrender.com

## 🛠️ Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

## 📋 Requisitos previos

- Node.js v18 o superior
- npm
- Cuenta en MongoDB Atlas (o MongoDB local)

## 🚀 Instalación local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/PEzequielFlorentin/gestion-biblioteca.git
   cd gestion-biblioteca/backend
Instalar dependencias:

bash
npm install
Crear un archivo .env en la raíz de backend/ con:

env
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/gestion-biblioteca?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta
Ejecutar en modo desarrollo:

bash
npm run dev
Ejecutar en modo producción:

bash
npm start
El servidor estará disponible en http://localhost:3000.

🗄️ Modelo de datos
User
Campo	Tipo	Validaciones
name	String	Requerido
email	String	Requerido, único, formato email
password	String	Requerido, mínimo 6 caracteres (hasheado con bcrypt)
role	String	Enum: user, admin. Default: user
Author
Campo	Tipo	Validaciones
name	String	Requerido
nationality	String	Opcional
Genre
Campo	Tipo	Validaciones
name	String	Requerido, único
Book
Campo	Tipo	Validaciones
title	String	Requerido
author	ObjectId (ref Author)	Requerido
genre	ObjectId (ref Genre)	Requerido
stock	Number	Requerido, mínimo 0, default 1
description	String	Opcional
Loan
Campo	Tipo	Validaciones
user	ObjectId (ref User)	Requerido
book	ObjectId (ref Book)	Requerido
loanDate	Date	Default: ahora
returnDate	Date	Default: null
status	String	Enum: pendiente, devuelto. Default: pendiente
🔗 Endpoints
Autenticación (/api/auth)
Método	Ruta	Descripción	Auth
POST	/api/auth/register	Registro de usuario	No
POST	/api/auth/login	Login, devuelve JWT	No
Registro — request:

json
POST /api/auth/register
{
  "name": "Ezequiel",
  "email": "ezequiel@test.com",
  "password": "123456"
}
Registro — respuesta exitosa (201):

json
{
  "mensaje": "Usuario registrado correctamente",
  "user": { "id": "...", "name": "Ezequiel", "email": "ezequiel@test.com", "role": "user" }
}
Registro — errores posibles:

400 → { "mensaje": "Todos los campos son obligatorios" }

400 → { "mensaje": "El email ya está registrado" }

500 → { "mensaje": "Error en el servidor", "error": "..." }

Login — request:

json
POST /api/auth/login
{
  "email": "ezequiel@test.com",
  "password": "123456"
}
Login — respuesta exitosa (200):

json
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOi...",
  "user": { "id": "...", "name": "Ezequiel", "email": "ezequiel@test.com", "role": "admin" }
}
Login — errores posibles:

400 → { "mensaje": "Email y contraseña son obligatorios" }

401 → { "mensaje": "Credenciales inválidas" }

500 → { "mensaje": "Error en el servidor", "error": "..." }

Libros (/api/books)
Método	Ruta	Descripción	Auth
GET	/api/books	Listar todos los libros (con author y genre populados)	No
GET	/api/books/:id	Detalle de un libro	No
POST	/api/books	Crear libro	Admin
PUT	/api/books/:id	Actualizar libro	Admin
DELETE	/api/books/:id	Eliminar libro	Admin
Crear libro — request:

json
POST /api/books
Authorization: Bearer <token_admin>
{
  "title": "Cien años de soledad",
  "author": "<id_autor>",
  "genre": "<id_genero>",
  "stock": 3,
  "description": "Novela de 1967"
}
Crear libro — errores posibles:

400 → { "mensaje": "Título, autor y género son obligatorios" }

400 → { "mensaje": "Error al crear el libro", "error": "Book validation failed: ..." }

401 → { "mensaje": "No autorizado, token faltante" }

401 → { "mensaje": "Token inválido o expirado" }

403 → { "mensaje": "Acceso denegado: se requiere rol admin" }

Detalle — errores posibles:

404 → { "mensaje": "Libro no encontrado" }

500 → { "mensaje": "Error al obtener el libro", "error": "..." }

Autores (/api/authors)
Método	Ruta	Descripción	Auth
GET	/api/authors	Listar autores	No
POST	/api/authors	Crear autor	Admin
PUT	/api/authors/:id	Actualizar autor	Admin
DELETE	/api/authors/:id	Eliminar autor	Admin
Errores posibles:

400 → { "mensaje": "El nombre es obligatorio" }

401 → { "mensaje": "No autorizado, token faltante" }

403 → { "mensaje": "Acceso denegado: se requiere rol admin" }

404 → { "mensaje": "Autor no encontrado" }

Géneros (/api/genres)
Método	Ruta	Descripción	Auth
GET	/api/genres	Listar géneros	No
POST	/api/genres	Crear género	Admin
PUT	/api/genres/:id	Actualizar género	Admin
DELETE	/api/genres/:id	Eliminar género	Admin
Errores posibles:

400 → { "mensaje": "El nombre es obligatorio" }

400 → { "mensaje": "Error al crear género", "error": "E11000 duplicate key error..." } (nombre duplicado)

401 → { "mensaje": "No autorizado, token faltante" }

403 → { "mensaje": "Acceso denegado: se requiere rol admin" }

404 → { "mensaje": "Género no encontrado" }

Préstamos (/api/loans)
Método	Ruta	Descripción	Auth
POST	/api/loans	Solicitar préstamo	User
GET	/api/loans/mis	Ver mis préstamos	User
GET	/api/loans	Ver todos los préstamos (con user y book populados)	Admin
PUT	/api/loans/:id/devolver	Marcar como devuelto	Admin
Solicitar préstamo — request:

json
POST /api/loans
Authorization: Bearer <token_user>
{
  "bookId": "<id_libro>"
}
Solicitar préstamo — errores posibles:

404 → { "mensaje": "Libro no encontrado" }

400 → { "mensaje": "No hay stock disponible" }

401 → { "mensaje": "No autorizado, token faltante" }

Devolver préstamo — errores posibles:

404 → { "mensaje": "Préstamo no encontrado" }

400 → { "mensaje": "Este préstamo ya fue devuelto" }

403 → { "mensaje": "Acceso denegado: se requiere rol admin" }

🔐 Autenticación
Las rutas protegidas requieren el header:

text
Authorization: Bearer <token>
El token se obtiene en /api/auth/login y expira en 1 día.

👥 Roles y permisos
Acción	User	Admin
Consultar libros/autores/géneros	✅	✅
Solicitar préstamo	✅	✅
Ver sus propios préstamos	✅	✅
Crear/editar/eliminar libros	❌	✅
Crear/editar/eliminar autores	❌	✅
Crear/editar/eliminar géneros	❌	✅
Ver todos los préstamos	❌	✅
Marcar préstamo como devuelto	❌	✅
📁 Estructura del proyecto
text
backend/
├── middlewares/
│   └── authMiddleware.js    # Verificación de JWT y rol admin
├── models/
│   ├── User.js              # Esquema de usuario con hash de password
│   ├── Author.js            # Esquema de autor
│   ├── Genre.js             # Esquema de género
│   ├── Book.js              # Esquema de libro con referencias
│   └── Loan.js              # Esquema de préstamo
├── routes/
│   ├── authRoutes.js        # Registro y login
│   ├── bookRoutes.js        # CRUD de libros
│   ├── authorRoutes.js      # CRUD de autores
│   ├── genreRoutes.js       # CRUD de géneros
│   └── loanRoutes.js        # Gestión de préstamos
├── .env                     # Variables de entorno (no versionado)
├── index.js                 # Punto de entrada
└── package.json
🧪 Pruebas rápidas
POST /api/auth/register → crear usuario.

POST /api/auth/login → obtener token.

(Opcional) Cambiar role a admin en MongoDB Atlas y volver a loguearse.

POST /api/authors, POST /api/genres, POST /api/books con token admin.

GET /api/books sin token → ver libros populados.

POST /api/loans con token user → solicitar préstamo.

PUT /api/loans/:id/devolver con token admin → devolver.

☁️ Despliegue
El backend está desplegado en Render:

URL: https://gestion-biblioteca-38dg.onrender.com

Root Directory: backend

Build Command: npm install

Start Command: npm start

Variables de entorno configuradas: MONGO_URI, JWT_SECRET

⚠️ El plan gratuito de Render "duerme" el servicio tras 15 minutos de inactividad. La primera petición puede tardar 30-60 segundos.

text

### 📤 Subir a GitHub

```powershell
cd C:\Users\flore\gestion-biblioteca
git add backend/README.md
git commit -m "README del backend con documentación completa"
git push origin main