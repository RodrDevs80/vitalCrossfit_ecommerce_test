# VitalCrossfit - Frontend de E-commerce

Este es el frontend de **VitalCrossfit**, una aplicación de e-commerce diseñada para la venta de equipamiento, ropa y suplementos para CrossFit. La aplicación está construida con React y Vite, utilizando Material-UI y Tailwind CSS para una interfaz de usuario moderna y responsiva.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Material-UI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Características Principales

- **Visualización de Productos:** Interfaz de cuadrícula para explorar todos los productos disponibles.
- **Páginas de Detalle:** Vistas detalladas para cada producto y categoría, obteniendo datos de una API.
- **Navegación por Categorías:** Sección dedicada a mostrar las diferentes categorías de productos.
- **Sección de Ofertas:** Página que filtra y muestra únicamente los productos en oferta.
- **Sistema de Cupones:** Los usuarios pueden ingresar un código de cupón que se valida contra una API y aplica descuentos a productos específicos.
- **Diseño Responsivo:** La interfaz se adapta a diferentes tamaños de pantalla (móvil, tablet y escritorio) gracias a Material-UI y Tailwind CSS.
- **Componentes Dinámicos:**
  - Slider de imágenes principal en la cabecera.
  - Carrusel infinito de logos de marcas.
  - Botón flotante de contacto por WhatsApp.
  - Hero section interactiva en la página de inicio.
- **Routing del Cliente:** Utiliza `react-router-dom` para una navegación fluida sin recargar la página.
- **Calidad de Código:** Configuración de ESLint para mantener un código limpio y consistente.

## 🛠️ Tecnologías Utilizadas

- **Framework:** React 19
- **Bundler:** Vite
- **Librería de UI:** Material-UI (MUI)
- **Framework de CSS:** Tailwind CSS
- **Routing:** React Router DOM v7
- **Cliente HTTP:** Axios para las peticiones a la API.
- **Gestión de Estado:** React Context API para el manejo global del estado de los cupones.
- **Linting:** ESLint

## 📂 Estructura del Proyecto

El proyecto está organizado de la siguiente manera para mantener una estructura clara y escalable:

```
frontEx/
├── public/               # Archivos estáticos (logo, etc.)
├── src/
│   ├── assets/           # Imágenes y otros recursos
│   ├── components/       # Componentes reutilizables de React (cards, botones, etc.)
│   ├── context/          # Contexto de React (CuponProvider, CuponContext)
│   ├── css/              # Hojas de estilo CSS específicas para componentes
│   ├── mocks/            # Datos de prueba o iniciales
│   ├── pages/            # Componentes que representan páginas completas (Home)
│   ├── services/         # Funciones para interactuar con la API externa (Axios)
│   ├── util/             # Funciones de utilidad (ej. calcularDescuento)
│   ├── App.jsx           # Componente principal que define las rutas
│   ├── index.css         # Estilos globales (configuración de Tailwind)
│   └── main.jsx          # Punto de entrada de la aplicación React
├── .eslintrc.cjs         # Configuración de ESLint
├── .gitignore            # Archivos y carpetas ignorados por Git
├── index.html            # Plantilla HTML principal
├── package.json          # Dependencias y scripts del proyecto
├── tailwind.config.js    # Configuración de Tailwind CSS
└── vite.config.js        # Configuración de Vite
```

## 🚀 Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 18.x o superior recomendada)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)

### Instalación

1. **Clona el repositorio:**

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd frontEx
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```
   o si usas yarn:
   ```bash
   yarn install
   ```

### Requisito del Backend

⚠️ **Importante:** Esta aplicación es un frontend y requiere un servidor backend para funcionar correctamente. Las llamadas a la API (productos, categorías, cupones) apuntan a `http://localhost:3000/api/`.

Asegúrate de tener el servidor backend correspondiente ejecutándose en ese puerto antes de iniciar el frontend.

### Scripts Disponibles

En el archivo `package.json`, encontrarás los siguientes scripts:

- **Para iniciar el servidor de desarrollo:**

  ```bash
  npm run dev
  ```

  Esto iniciará la aplicación en modo de desarrollo con Hot-Reload. Abre [http://localhost:5173](http://localhost:5173) (o el puerto que indique la consola) para verla en tu navegador.

- **Para construir la aplicación para producción:**

  ```bash
  npm run build
  ```

  Esto creará una carpeta `dist` con los archivos optimizados listos para desplegar.

- **Para ejecutar el linter:**

  ```bash
  npm run lint
  ```

  Esto analizará el código en busca de errores y problemas de estilo según las reglas de ESLint.

- **Para previsualizar la build de producción localmente:**
  ```bash
  npm run preview
  ```
  Este comando inicia un servidor estático simple para ver los archivos de la carpeta `dist`.
