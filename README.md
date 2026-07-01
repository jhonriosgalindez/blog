# 🌍 Horizone: Blog's Traveling & Lifestyle

**Horizone** es una plataforma editorial autogestionada para blogs de viajes, gastronomía, diseño y estilo de vida. El proyecto implementa una arquitectura moderna **Full-Stack (Vite + React 19 + Express + Firebase)**.

Toda la interfaz ha sido optimizada con un diseño responsivo y limpio.

---

## 🚀 Características Clave

*   **Gestión Editorial y Dashboard de Autor**: Panel privado de administración donde los escritores pueden crear artículos manualmente, definir metadatos SEO (metatítulo, metadescripción, palabras clave), manejar estados del flujo de trabajo (`Draft`, `In Review`, `Published`, `Archived`) y actualizar su perfil y biografía de autor.
*   **Autenticación Segura y Perfiles**: Integración completa con **Firebase Authentication**, soportando inicio de sesión y registro rápido mediante correo electrónico/contraseña tradicional o inicio de sesión con **Google OAuth**.
*   **Base de Datos Híbrida y Persistente**:
    *   **Durable**: Sincronización en tiempo real con **Cloud Firestore (Firebase)** para almacenar de forma persistente los artículos redactados por los usuarios, perfiles de autor, biografía e historial.
    *   **Memoria/Caché**: Un almacenamiento en memoria dentro del servidor de Express para servir rápidamente los contenidos preestablecidos y sincronizar las publicaciones generales.
*   **Filtros de Búsqueda y Ordenamiento Avanzado**: Los visitantes pueden filtrar por categorías editoriales (`Destination`, `Lifestyle`, `Culinary`, `Tips & Hacks`), buscar texto libre en tiempo real, y ordenar las publicaciones por novedad, antigüedad o tiempo estimado de lectura.
*   **Subida Flexible de Portadas**: Soporte para la especificación de imágenes mediante URLs externas o mediante subida de archivos directos desde el ordenador (codificados y guardados de forma segura en Base64).
*   **Optimización SEO**: Campos estructurados para meta-etiquetas que garantizan la indexación óptima de cada publicación creada.

---

## 🛠️ Pila Tecnológica (Tech Stack)

### Frontend (Cliente)
*   **React 19**: Estructura declarativa de componentes y gestión avanzada de estados y hooks.
*   **TypeScript 5**: Tipado estricto en toda la aplicación para reducir errores de compilación y asegurar la mantenibilidad.
*   **Vite 6**: Empaquetador ultra-rápido para el entorno de desarrollo y compilador de activos del cliente.
*   **Tailwind CSS v4**: Framework de diseño utilitario para un desarrollo de estilos responsivo sin escribir CSS redundante.
*   **Motion (Framer Motion)**: Transiciones fluidas entre pantallas, animaciones de entrada staggered y efectos sutiles al interactuar con las tarjetas del blog.
*   **Lucide React**: Biblioteca unificada para todos los iconos vectoriales de la plataforma.

### Backend (Servidor)
*   **Express 4**: Servidor para la gestión de la API REST del proyecto, enrutamiento, y servidor de archivos estáticos para el entorno de producción.
*   **TSX & Esbuild**: Herramientas integradas para ejecutar TypeScript directamente en Node sin pasos previos de transpilación en desarrollo, y compilar el backend a un único archivo (`dist/server.cjs`) en producción.

### Base de Datos y Servicios Cloud
*   **Firebase 12 SDK**: Cliente integrado para la interacción con los servicios de Google Cloud.
*   **Cloud Firestore**: Base de datos de documentos NoSQL que gestiona de manera dinámica y reactiva la colección de publicaciones (`user_posts`) y los datos de perfil de usuario (`users`).
*   **Firebase Auth**: Gestión de sesiones de usuario con soporte para flujos tradicionales y redes sociales.
*   **Firestore Security Rules**: Sistema de validación de seguridad a nivel de servidor que previene la manipulación no autorizada de colecciones de datos.

---

## 📂 Estructura del Proyecto

La arquitectura del repositorio sigue una división modular orientada al mantenimiento ágil y la reutilización de código:

```text
├── .env.example                 # Plantilla para variables de entorno requeridas
├── .gitignore                   # Exclusión de módulos, compilados y secretos
├── firebase-blueprint.json      # Esquema de datos para inicialización de la base de datos
├── firestore.rules              # Reglas de seguridad para el acceso a Cloud Firestore
├── index.html                   # Entrada principal de la interfaz web
├── metadata.json                # Metadatos del applet y configuración de permisos de AI Studio
├── package.json                 # Gestión de dependencias, scripts de compilación y ejecución
├── server.ts                    # Servidor Full-Stack Express, API REST y middleware Vite
├── tsconfig.json                # Configuración global del compilador TypeScript
├── vite.config.ts               # Configuración del servidor y plugins de Vite
├── src/
│   ├── App.tsx                  # Componente principal que coordina vistas, autenticación y flujos de datos
│   ├── index.css                # Estilo global con la importación e integración de Tailwind v4
│   ├── main.tsx                 # Inicializador y punto de montaje de React en el DOM
│   ├── types.ts                 # Declaración unificada de interfaces TypeScript (BlogPost, Author, etc.)
│   ├── lib/
│   │   └── firebase.ts          # Inicializador seguro de Firebase Auth y Firestore DB
│   └── components/
│       ├── Header.tsx           # Barra de navegación superior con barra de búsqueda y controles de usuario
│       ├── Footer.tsx           # Pie de página responsivo con estadísticas en tiempo real
│       ├── Hero.tsx             # Carrusel de artículos destacados en la portada con transiciones elegantes
│       ├── BlogGrid.tsx         # Listado dinámico de artículos con píldoras de categorías y selector de orden
│       ├── PostDetail.tsx       # Lector inmersivo de artículos con soporte completo para Markdown
│       ├── RegisterModal.tsx    # Modal de autenticación unificada (Email/Password & Google Sign-In)
│       └── Dashboard.tsx        # Panel de administración editorial de artículos y configuración del perfil de autor
```

---

## 🔒 Estructura y Seguridad de Datos (Firestore)

### Colecciones de Firestore

1.  **`users`**: Almacena información de los perfiles de autor.
    *   `uid` (string): Identificador único del usuario.
    *   `displayName` (string): Nombre público del autor.
    *   `email` (string): Correo de registro.
    *   `photoURL` (string): Dirección de la foto de perfil.
    *   `biografia` (string): Resumen biográfico para el pie de sus artículos.
    *   `rol` (string): Nivel de privilegios (`Administrador`, `Editor`, `Autor`, `Lector`).
    *   `createdAt` (timestamp): Fecha de registro de la cuenta.

2.  **`user_posts`**: Almacena las publicaciones editoriales personalizadas creadas por los autores.
    *   `id` (string): Identificador autogenerado.
    *   `title` (string): Título de la publicación.
    *   `summary` (string): Descripción para las tarjetas.
    *   `content` (string): Contenido completo con formato Markdown.
    *   `category` (string): Categoría temática asignada.
    *   `imageUrl` (string): Dirección o cadena Base64 de la portada.
    *   `author` (object): Datos estructurados del autor al momento de publicar (para evitar joins lentos).
    *   `estado` (string): Estado actual (`Borrador`, `Revisión`, `Publicado`, `Archivado`).
    *   `createdAt` (timestamp): Fecha exacta de su creación.

### Reglas de Seguridad (`firestore.rules`)
Las reglas configuradas protegen la base de datos asegurando que:
*   Cualquier visitante puede leer los artículos que estén en estado **`Publicado`**.
*   Solo los usuarios autenticados pueden crear nuevos artículos (`create`), asignándose a sí mismos como el autor real.
*   Únicamente el autor original del artículo (o un usuario con privilegios elevados) puede editar (`update`) o eliminar (`delete`) sus propias publicaciones.
*   Las modificaciones de datos de usuario en la colección `users` están estrictamente limitadas al propietario del ID del documento correspondiente.

---

## 🛠️ Instalación y Configuración

Siga los pasos descritos a continuación para clonar, configurar e iniciar el proyecto en su entorno de desarrollo local:

### 1. Requisitos Previos
*   **Node.js**: Versión 18.x o superior.
*   **NPM**: Gestor de paquetes oficial (v9.x o superior).

### 2. Instalación de Dependencias
Ejecute el siguiente comando en la raíz del proyecto para descargar e instalar todas las dependencias requeridas del frontend y backend:
```bash
npm install
```

### 3. Configuración de Variables de Entorno
Cree un archivo `.env` en la raíz del proyecto basándose en la estructura de `.env.example`:
```bash
cp .env.example .env
```
Abra el archivo `.env` y defina la URL de la aplicación:
```env
APP_URL="http://localhost:3000"
```

### 4. Ejecución en Modo Desarrollo
Inicie el servidor de desarrollo híbrido (Express + Vite con Hot Reloading):
```bash
npm run dev
```
La aplicación estará disponible en la dirección local: **`http://localhost:3000`**.

### 5. Compilación y Arranque para Producción
Para empaquetar de forma optimizada la aplicación cliente y compilar el backend de Express en un único archivo CJS de alto rendimiento, ejecute:
```bash
npm run build
```
Una vez completado el paso de construcción, inicie el servidor de producción con el siguiente comando:
```bash
npm run start
```

---

## 💡 Buenas Prácticas Aplicadas

1.  **Arquitectura Full-Stack**: El backend actúa como un proxy limpio para servir la aplicación y coordinar la sincronización de contenidos.
2.  **Prevención de Re-renders Infinitos en React**: Los hooks de efectos (`useEffect`) utilizan variables de control de tipo primitivo para mitigar bucles de ejecución y sobrecostos en llamadas asíncronas.
3.  **Optimización SEO y Formatos Semánticos**: Cada artículo cuenta con una correspondencia semántica precisa basada en estándares SEO y tipográficos ideales (usando familias como *Inter* y *JetBrains Mono* para datos estructurados).
4.  **Alineación de Persistencia**: Se prioriza la persistencia duradera para contenido creado por el usuario en Firestore, manteniendo el rendimiento ágil a través del búfer de caché en memoria de Express.
