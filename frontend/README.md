# Frontend — Gestión de Biblioteca

SPA (Single Page Application) en React para la gestión y consulta de una biblioteca. Consume la API REST del backend desplegado en Render.

## 🔗 URL de producción

https://gestion-biblioteca.netlify.app

## 🛠️ Tecnologías y librerías

| Librería | Propósito |
|----------|-----------|
| **react** | Biblioteca principal para construir la interfaz con componentes |
| **react-dom** | Renderizado de React en el DOM |
| **react-router-dom** | Enrutamiento del lado del cliente (SPA): `BrowserRouter`, `Routes`, `Route`, `Link`, `useNavigate`, `useParams`, `Navigate` |
| **vite** | Bundler y servidor de desarrollo (reemplaza a Create React App). Rápido y con HMR |
| **@vitejs/plugin-react** | Plugin oficial de Vite para React (JSX, Fast Refresh) |
| **oxlint** | Linter rápido (elegido al crear el proyecto con Vite) |

> No se usaron librerías de UI (como Material UI o Bootstrap) para mantener el proyecto simple y entendible. Los estilos son CSS puro con objetos `style` inline y un archivo `Navbar.css`.

## 📋 Requisitos previos

- Node.js v18 o superior
- npm
- El backend corriendo (local o en Render)

## 🚀 Instalación local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/PEzequielFlorentin/gestion-biblioteca.git
   cd gestion-biblioteca/frontend
Instalar dependencias:

bash
npm install
Crear un archivo .env en la raíz de frontend/ con:

env
VITE_API_URL=http://localhost:3000/api
(o la URL de Render: https://gestion-biblioteca-38dg.onrender.com/api)

Ejecutar en modo desarrollo:

bash
npm run dev
Compilar para producción:

bash
npm run build
El servidor de desarrollo estará disponible en http://localhost:5173.

🔐 Variables de entorno
Variable	Descripción	Ejemplo
VITE_API_URL	URL base de la API del backend (sin barra al final)	http://localhost:3000/api
⚠️ Vite solo expone variables que empiezan con VITE_. El archivo .env no se versiona (está en .gitignore). En Netlify, la variable se configura en el panel del sitio.

📁 Estructura del proyecto
text
frontend/
├── public/                  # Archivos estáticos (favicon, etc.)
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── Navbar.jsx       # Barra de navegación con menú responsive
│   │   ├── Navbar.css       # Estilos del navbar
│   │   ├── BookCard.jsx     # Tarjeta de libro para el catálogo
│   │   ├── Loading.jsx      # Indicador de carga
│   │   ├── PrivateRoute.jsx # Ruta protegida (requiere login)
│   │   └── AdminRoute.jsx   # Ruta protegida (requiere rol admin)
│   ├── context/
│   │   └── AuthContext.jsx  # Contexto global de autenticación (usuario + token)
│   ├── pages/               # Páginas de la SPA
│   │   ├── Catalog.jsx      # Catálogo con búsqueda y filtro por género
│   │   ├── BookDetail.jsx   # Detalle de libro + solicitar préstamo
│   │   ├── Login.jsx        # Inicio de sesión
│   │   ├── Register.jsx     # Registro de usuario
│   │   ├── MyLoans.jsx      # Préstamos del usuario (y todos, si es admin)
│   │   └── AdminDashboard.jsx # Panel admin: CRUD de libros, autores, géneros
│   ├── services/
│   │   └── api.js           # Centraliza todas las llamadas al backend con fetch
│   ├── App.jsx              # Configuración de rutas con React Router
│   ├── main.jsx             # Punto de entrada de React
│   └── index.css            # Estilos globales
├── .env                     # Variables de entorno (no versionado)
├── index.html               # HTML base
├── vite.config.js           # Configuración de Vite
└── package.json
🧭 Rutas de la SPA
Ruta	Componente	Acceso
/	Catalog	Público
/books/:id	BookDetail	Público (para solicitar préstamo requiere login)
/login	Login	Público
/register	Register	Público
/mis-prestamos	MyLoans	Privado (requiere login)
/admin	AdminDashboard	Privado + Admin
🔐 Manejo de sesión
El token JWT se guarda en sessionStorage (se borra al cerrar la pestaña/navegador, por seguridad).

El usuario se guarda también en sessionStorage para restaurar la sesión al recargar.

AuthContext provee user, loading, loginUser y logout a toda la app.

PrivateRoute y AdminRoute verifican sesión y rol antes de renderizar.

Se escucha el evento pageshow con persisted para re-validar la sesión cuando el navegador restaura una página desde la bfcache (botón atrás/adelante).

Se usa navigate(..., { replace: true }) para que el historial no permita volver a páginas protegidas después de un logout.

🔄 Conexión con el backend
Todas las llamadas a la API están centralizadas en src/services/api.js, que usa fetch nativo y adjunta automáticamente el token del sessionStorage en el header Authorization: Bearer <token>.

Funciones exportadas:

Auth: login, register

Books: getBooks, getBookById, createBook, updateBook, deleteBook

Authors: getAuthors, createAuthor, deleteAuthor

Genres: getGenres, createGenre, deleteGenre

Loans: createLoan, getMyLoans, getAllLoans, returnLoan

📱 Responsive
El catálogo usa grid con repeat(auto-fill, minmax(220px, 1fr)), que se adapta a móvil y escritorio.

El navbar tiene un menú hamburguesa (☰) que se muestra en pantallas menores a 768px (media query en Navbar.css).

Las tablas de préstamos tienen overflowX: 'auto' para permitir scroll horizontal en móvil.

⚡ Feedback visual
Componente Loading mientras se cargan datos.

Estados loading en formularios (botones deshabilitados con texto "Ingresando...", "Registrando...").

Mensajes de error y éxito en login, registro, admin y préstamos.

☁️ Despliegue en Netlify
El frontend está desplegado en Netlify:

URL: https://gestion-biblioteca.netlify.app

Base directory: frontend

Build command: npm run build

Publish directory: frontend/dist

Variable de entorno: VITE_API_URL=https://gestion-biblioteca-38dg.onrender.com/api

El archivo netlify.toml en la raíz del repositorio configura el build y el redirect de SPA (/* → /index.html) para que React Router funcione al recargar rutas.

🧪 Prueba rápida
Abrir https://gestion-biblioteca.netlify.app

Registrarse o iniciar sesión.

Navegar al catálogo, ver detalle de un libro, solicitar préstamo.

Como admin, acceder a /admin para gestionar libros, autores y géneros.

En "Mis Préstamos", el admin ve sus préstamos y los de todos los clientes.

text

### 📤 Subir a GitHub

```powershell
cd C:\Users\flore\gestion-biblioteca
git add frontend/README.md
git commit -m "README del frontend con documentación completa"
git push origin main