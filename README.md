# 🏋️‍♂️ E-commerce Deportivo "VitalCrossfit"

## 📋 Descripción del Proyecto

**VitalCrossfit** es una plataforma de e-commerce especializada en la venta de equipamiento, ropa y suplementos para CrossFit y entrenamiento deportivo. El proyecto está desarrollado con una arquitectura moderna que incluye un backend robusto con Node.js/Express y un frontend dinámico con React.

---

## 🏗️ Arquitectura del Sistema

### Backend (`/backEx`)

- **Framework**: Express.js 5.1.0
- **Base de datos**: MySQL con Sequelize ORM
- **Autenticación**: JWT con bcrypt
- **Seguridad**: Helmet, CORS, rate limiting
- **IA Integrada**: Groq SDK para chatbot especializado
- **Subida de archivos**: Multer con gestión de imágenes

### Frontend (`/frontEx`)

- **Framework**: React 19 con Vite
- **UI/UX**: Material-UI + Tailwind CSS
- **Estado**: Context API
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios

---

## ⚙️ Configuración e Instalación

### Prerrequisitos

- Node.js 18.x o superior
- MySQL 8.0+
- npm o yarn

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd vitalcrossfit
```

### 2. Configuración del Backend

#### Instalar dependencias:

```bash
cd backEx
npm install
```

#### Configurar variables de entorno:

Crear archivo `.env` en `/backEx`:

```env
# Servidor
PORT=3000
API_RAIZ=/api/v1
NODE_ENV=development

# Base de datos
DB_NAME=vitalcrossfit
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=3306
DB_DIALECT=mysql

# Autenticación JWT
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro

# Groq AI
GROQ_API_KEY=tu_api_key_de_groq
```

#### Configurar la base de datos:

```sql
CREATE DATABASE vitalcrossfit;
```

#### Sincronizar modelos (opcional):

```bash
node src/scripts/syripts.js
```

#### Iniciar servidor:

```bash
# Desarrollo con watch mode
npm run dev

# Producción
npm start
```

### 3. Configuración del Frontend

#### Instalar dependencias:

```bash
cd ../frontEx
npm install
```

#### Configurar proxy (opcional):

El archivo `vite.config.js` ya incluye proxy a `http://localhost:3000`

#### Iniciar aplicación:

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview
```

---

## 🗄️ Estructura de la Base de Datos

### Modelos Principales:

- **Usuarios**: Sistema de roles (bronce, plata, oro)
- **Administradores**: Roles (admin, fulladmin)
- **Productos**: Con categorías, imágenes y especificaciones
- **Categorías**: Organización de productos
- **Carritos**: Gestión de compras
- **Órdenes**: Procesamiento de pedidos
- **Cupones**: Sistema de descuentos
- **Archivos**: Gestión multimedia
- **Mensajes**: Comentarios y calificaciones

---

## 🚀 Características Principales

### Backend Features:

- ✅ API RESTful completa
- ✅ Autenticación JWT con refresh tokens
- ✅ Subida y gestión de archivos
- ✅ Validación de datos con express-validator
- ✅ Chatbot especializado en entrenamiento deportivo
- ✅ Sistema de cupones y descuentos
- ✅ Paginación y filtros avanzados
- ✅ Manejo centralizado de errores
- ✅ Rate limiting y seguridad

### Frontend Features:

- ✅ Catálogo de productos con filtros
- ✅ Gestión de carrito de compras
- ✅ Sistema de cupones aplicables
- ✅ Interfaz administrativa
- ✅ Diseño responsive
- ✅ Navegación por categorías
- ✅ Sección de ofertas y descuentos
- ✅ Integración con WhatsApp

---

## 🛠️ Endpoints Principales de la API

### Autenticación:

- `POST /api/v1/auth/register` - Registro de usuarios
- `POST /api/v1/auth/login` - Inicio de sesión
- `POST /api/v1/auth/refresh-token` - Refresh tokens

### Productos:

- `GET /api/v1/productos/all` - Lista paginada
- `GET /api/v1/productos/activos` - Solo activos
- `POST /api/v1/productos` - Crear producto (con imagen)
- `PUT /api/v1/productos/:id` - Actualizar producto

### Categorías:

- `GET /api/v1/categorias/all` - Lista completa
- `POST /api/v1/categorias` - Crear categoría
- `GET /api/v1/categorias/imagen/portadas/:fileName` - Servir imágenes

### Chatbot:

- `POST /api/v1/chatbot` - Consultas sobre entrenamiento

### Archivos:

- `POST /api/v1/files/upload/:idProducto` - Subir archivos
- `GET /api/v1/files/image/:productId/:fileName` - Servir imágenes

---

## 🔒 Seguridad Implementada

- **Helmet**: Headers de seguridad
- **CORS**: Configuración de orígenes permitidos
- **Rate Limiting**: Límite de peticiones
- **JWT**: Tokens con expiración
- **bcrypt**: Hash de contraseñas
- **Validación**: Sanitización de inputs
- **SQL Injection**: Prevención con Sequelize

---

## 🤖 Chatbot de Entrenamiento

El sistema incluye un chatbot especializado que responde exclusivamente sobre:

- Técnicas de entrenamiento
- Rutinas de ejercicio
- Suplementación deportiva
- Prevención de lesiones
- Metodologías de CrossFit

**Limitaciones**: No responde sobre temas médicos, políticos, financieros o fuera del ámbito deportivo.

---

## 📱 Panel de Administración

### Funcionalidades:

- Gestión completa de productos
- Administración de categorías
- Control de cupones y descuentos
- Gestión de usuarios
- Subida y organización de imágenes
- Moderación de mensajes

### Acceso:

- **Admin**: Acceso básico
- **FullAdmin**: Acceso completo

---

## 🎨 Características del Frontend

### Componentes Principales:

- **Header**: Navegación y búsqueda
- **ProductGrid**: Visualización de productos
- **CategorySection**: Navegación por categorías
- **CartSystem**: Gestión del carrito
- **CouponSystem**: Aplicación de descuentos
- **AdminPanel**: Interfaz administrativa

### Tecnologías UI:

- Material-UI para componentes
- Tailwind CSS para estilos
- Iconos de Lucide React
- Fuentes de Google Fonts

---

## 🚨 Troubleshooting

### Problemas Comunes:

1. **Error de conexión a BD**:

   - Verificar credenciales en `.env`
   - Confirmar que MySQL esté ejecutándose

2. **Error de CORS**:

   - Verificar configuración en `index.js` del backend
   - Confirmar URLs permitidas

3. **Error de subida de archivos**:

   - Verificar permisos de la carpeta `uploads`
   - Confirmar configuración de Multer

4. **Error de autenticación JWT**:
   - Verificar secret keys en `.env`
   - Confirmar formato de tokens

---

## 📈 Scripts Disponibles

### Backend:

```bash
npm run dev    # Desarrollo con watch
npm start      # Producción
```

### Frontend:

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run preview  # Preview build
npm run lint     # Análisis de código
```

---

## 🔄 Flujo de Desarrollo

1. **Configurar entorno** (variables, BD)
2. **Iniciar backend** (`npm run dev` en `/backEx`)
3. **Iniciar frontend** (`npm run dev` en `/frontEx`)
4. **Acceder** a `http://localhost:5173`

---

## 📞 Soporte

Para reportar issues o solicitar características:

1. Revisar documentación
2. Verificar logs del servidor
3. Revisar configuración de variables de entorno
4. Contactar al equipo de desarrollo

---

## 🎯 Próximas Características

- [ ] Sistema de pagos integrado
- [ ] Notificaciones push
- [ ] App móvil nativa
- [ ] Analytics avanzado
- [ ] Sistema de fidelización
- [ ] Integración con redes sociales

---

**VitalCrossfit** - Potenciando tu entrenamiento con la mejor tecnología 🚀💪
