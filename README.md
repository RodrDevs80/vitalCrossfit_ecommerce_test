# E-commerce Deportivo "VitalCrossfit"

Este documento detalla las características principales, la arquitectura y las tecnologías de un proyecto full-stack de comercio electrónico. El sistema se compone de un backend robusto construido con Node.js y un frontend dinámico desarrollado con React.

## 1. Visión General del Proyecto

El proyecto es una aplicación de e-commerce completa que permite a los usuarios navegar por productos, ver categorías, aprovechar ofertas y aplicar cupones de descuento. La arquitectura está claramente dividida en dos partes:

- **Backend (`backEx`):** Una API RESTful que gestiona la lógica de negocio, la interacción con la base de datos y la seguridad.
- **Frontend (`frontEx`):** Una aplicación de una sola página (SPA) que consume la API del backend para ofrecer una experiencia de usuario interactiva.

El desarrollo del proyecto parece estar guiado por una serie de requerimientos funcionales descritos en `Consignas.md`, que abarcan la gestión de categorías, productos con ofertas y un sistema de cupones.

## 2. Tecnologías Utilizadas

### Backend (`backEx`)

- **Entorno de Ejecución:** Node.js
- **Framework:** Express.js
- **ORM (Object-Relational Mapping):** Sequelize
- **Base de Datos:** MySQL (`mysql2`)
- **Seguridad:** `bcrypt` para el hasheo de contraseñas.
- **Middleware:**
  - `cors` para habilitar el Intercambio de Recursos de Origen Cruzado.
  - `morgan` para el logging de peticiones HTTP.
- **Variables de Entorno:** `dotenv` para gestionar la configuración de manera segura.

### Frontend (`frontEx`)

- **Framework/Librería:** React
- **Bundler/Entorno de Desarrollo:** Vite
- **Enrutamiento:** React Router DOM (`react-router-dom`)
- **Cliente HTTP:** Axios para realizar peticiones a la API.
- **UI/Estilos:**
  - **Material-UI (`@mui/material`):** Para componentes de UI pre-construidos y estilizados.
  - **Tailwind CSS:** Para un enfoque de utility-first CSS.
  - CSS personalizado para estilos específicos.
- **Manejo de Estado Global:** React Context (`CuponProvider`).

---

## 3. Arquitectura del Backend (`backEx`)

El backend sigue un patrón de diseño **MVC (Modelo-Vista-Controlador)**, con una clara separación de responsabilidades.

### 3.1. Estructura de Carpetas

- `src/config`: Contiene la configuración de la conexión a la base de datos (`connection.js`).
- `src/models`: Define los modelos de datos (esquema de la base de datos) usando Sequelize.
- `src/controllers`: Implementa la lógica de negocio para cada entidad (Usuario, Producto, etc.).
- `src/routes`: Define los endpoints de la API y los asocia con sus respectivos controladores.
- `index.js`: Punto de entrada de la aplicación. Configura Express, los middlewares, las rutas y la conexión con la base de datos.

### 3.2. Modelos de Datos y Base de Datos (Sequelize)

El ORM Sequelize se utiliza para modelar las entidades de la aplicación y sus relaciones.

**Modelos Principales:**

- `Usuario`: Gestiona los datos de los usuarios, incluyendo `nombre`, `apellido`, `email` (único) y `rol` (`cliente`, `administrador`).
  - **Seguridad:** Utiliza `bcrypt` a través de hooks (`beforeCreate`, `beforeUpdate`) para hashear las contraseñas antes de guardarlas.
  - **Validaciones:** Incluye validaciones robustas para la longitud de los campos y la complejidad de la contraseña.
- `Categoria`: Define las categorías de productos con campos como `nombre`, `imagenUrl` y un booleano `activo`.
- `Producto`: Representa los productos, con campos para `precio`, `stock`, y los campos de oferta: `oferta` (booleano) y `descuento` (entero 0-100), cumpliendo con los requisitos de `Consignas.md`.
- `CuponDescuento`: Almacena los cupones con `codigoCupon` (único), `porcentajeDescuento` y un estado `activo`.
- **Otros modelos:** `Carrito`, `ItemCarrito`, `Orden`, `ItemOrden` completan la funcionalidad de un e-commerce estándar.

**Asociaciones (`src/models/index.js`):**
Se definen relaciones clave para el funcionamiento del e-commerce:

- `Usuario` tiene un `Carrito` (1:1) y muchas `Ordenes` (1:N).
- `Categoria` tiene muchos `Productos` (1:N).
- `Producto` se relaciona con `ItemCarrito`, `ItemOrden` y `CuponDescuento`.

**Scopes de Sequelize:**
Se utilizan `scopes` para simplificar consultas comunes, como obtener solo los registros activos (`scope: 'activos'`) o los usuarios administradores.

### 3.3. Controladores y Rutas (Express)

- **API RESTful:** La API está organizada de forma modular. Cada entidad tiene su propio archivo de rutas (ej. `categoriaRoutes.js`) y controlador (ej. `categoriaController.js`).
- **Endpoints Destacados:**
  - `GET /api/categorias/activos`: Devuelve solo las categorías activas.
  - `GET /api/productos/activos/ofertas`: Retorna productos activos que están en oferta.
  - `GET /api/cupones/validar/:codigoCupon`: Endpoint específico para verificar la validez de un cupón.
  - Rutas CRUD completas para la mayoría de las entidades, incluyendo borrado lógico (`PATCH`) y físico (`DELETE`).
- **Manejo de Errores:** Los controladores implementan una gestión de errores sólida, devolviendo códigos de estado HTTP apropiados (400, 404, 409, 500) y mensajes claros, diferenciando errores de validación, de unicidad o del servidor.

---

## 4. Arquitectura del Frontend (`frontEx`)

El frontend es una Single-Page Application (SPA) construida con React y Vite, enfocada en la reactividad y la experiencia de usuario.

### 4.1. Estructura de Carpetas

- `src/components`: Contiene componentes reutilizables como `Cabecera`, `FooterE`, `Slider`, etc.
- `src/pages`: Contiene componentes que representan páginas completas, como `Home.jsx`.
- `src/context`: Gestiona el estado global a través del React Context API (ej. `CuponProvider.jsx`).
- `App.jsx`: Componente principal que define la estructura de las rutas y el layout general de la aplicación.

### 4.2. Funcionalidades Clave

- **Enrutamiento (`react-router-dom`):**
  - La navegación está gestionada por `BrowserRouter`.
  - Se definen rutas estáticas (`/categorias`, `/ofertas`) y dinámicas (`/categorias/:id`, `/productos/:id`) para las vistas de lista y detalle.
- **Manejo de Estado:**
  - **Estado Global:** Se utiliza `CuponProvider` para gestionar el estado del cupón de descuento aplicado, permitiendo que cualquier componente acceda a él y que los precios se actualicen en toda la aplicación.
  - **Estado Local:** Se usan hooks como `useState` y `useEffect` dentro de los componentes para manejar datos locales, como la carga de información desde la API.
- **Comunicación con la API (`axios`):**
  - Axios se utiliza para realizar las peticiones GET, POST, PUT, etc., a la API del backend, obteniendo los datos necesarios para renderizar las vistas.
- **Diseño y Estilos:**
  - Se adopta un **enfoque híbrido** que combina la robustez de los componentes de **Material-UI** con la flexibilidad de las clases de utilidad de **Tailwind CSS**, lo que permite un desarrollo rápido y personalizable.

### 4.3. Implementación de Requerimientos

El frontend implementa con éxito las funcionalidades solicitadas en `Consignas.md`:

1.  **Vista de Categorías:** Muestra una lista de categorías activas y permite navegar a una vista de detalle para cada una.
2.  **Visualización de Ofertas:** Las tarjetas de producto muestran indicadores visuales para ofertas y calculan el precio final si hay un descuento aplicado.
3.  **Sistema de Cupones:** Un campo de texto permite a los usuarios aplicar un cupón, que se valida contra el backend. Si es válido, el descuento se aplica globalmente a los precios de los productos, priorizándolo sobre los descuentos individuales.
