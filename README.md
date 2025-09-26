# 📷 Gallery App

Una aplicación móvil de galería de fotos desarrollada con **Ionic + Angular** que permite gestionar y establecer imágenes como fondos de pantalla. La aplicación incluye autenticación de usuarios, almacenamiento en la nube y soporte multiidioma.

## ✨ Características

- 🔐 **Autenticación de usuarios** con login y registro
- 🖼️ **Galería de fotos** con visualización optimizada
- 📱 **Establecer fondos de pantalla** (inicio y bloqueo)
- ☁️ **Almacenamiento en la nube** con Firebase y Supabase
- 🌍 **Soporte multiidioma** (Español e Inglés)
- 📂 **Selector de archivos** para subir imágenes
- 👤 **Gestión de perfil de usuario**
- 💾 **Preferencias locales** con Capacitor
- 🎯 **Aplicación nativa** compatible con Android

## 🛠️ Tecnologías

- **Frontend**: Angular 20.0, Ionic 8.0
- **Mobile**: Capacitor 7.4
- **Base de datos**: Firebase, Supabase
- **Autenticación**: JWT, Firebase Auth
- **Internacionalización**: ngx-translate
- **Almacenamiento**: Capacitor Preferences
- **Imágenes**: Capacitor Camera, File Picker
- **UI Components**: Ionic Components, Ionicons

## 📋 Requisitos previos

- Node.js (versión 18 o superior)
- npm o yarn
- Angular CLI
- Ionic CLI
- Android Studio (para desarrollo Android)
- JDK 11 o superior

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/melanyolivera211/Gallery.git
   cd Gallery
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase y Supabase**
   - Crear proyecto en Firebase Console
   - Configurar Authentication y Storage
   - Crear proyecto en Supabase
   - Configurar base de datos y storage

## 🏃‍♂️ Scripts disponibles

- `npm start` - Ejecutar en modo desarrollo
- `npm run build` - Compilar para producción
- `npm test` - Ejecutar tests
- `npm run lint` - Verificar código con ESLint
- `npx ionic serve` - Servidor de desarrollo Ionic
- `npx ionic capacitor run android` - Ejecutar en Android

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── core/                 # Módulos y servicios centrales
│   │   ├── config/          # Configuraciones (Firebase, Supabase)
│   │   ├── guards/          # Guards de autenticación
│   │   └── services/        # Servicios principales
│   ├── pages/               # Páginas de la aplicación
│   │   ├── auth/           # Login y registro
│   │   ├── home/           # Página principal
│   │   └── update-user-info/ # Actualización de perfil
│   ├── shared/             # Componentes compartidos
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pipes/         # Pipes personalizados
│   │   └── services/      # Servicios compartidos
│   └── plugins/           # Plugins de Capacitor
├── assets/
│   └── i18n/              # Archivos de traducción
├── domain/
│   └── models/            # Modelos de datos
└── environments/          # Variables de entorno
```

## 🌍 Internacionalización

La aplicación soporta múltiples idiomas:

- **Español (es)**: `src/assets/i18n/es.json`
- **Inglés (en)**: `src/assets/i18n/en.json`

Para agregar un nuevo idioma:
1. Crear archivo de traducción en `src/assets/i18n/[idioma].json`
2. Configurar en el servicio de traducción

## 📱 Desarrollo móvil

### Android

1. **Preparar el proyecto**
   ```bash
   npm run build
   npx ionic capacitor add android
   npx ionic capacitor copy android
   ```

2. **Abrir en Android Studio**
   ```bash
   npx ionic capacitor open android
   ```

3. **Ejecutar en dispositivo**
   ```bash
   npx ionic capacitor run android
   ```

## 🔧 Configuración de Capacitor

El archivo `capacitor.config.ts` contiene la configuración principal:

```typescript
const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Gallery',
  webDir: 'www'
};
```

## 📚 Servicios principales

- **FirebaseService**: Gestión de autenticación y almacenamiento
- **SupabaseService**: Base de datos y storage alternativo
- **PreferencesService**: Almacenamiento local de preferencias
- **FilePickerService**: Selección de archivos
- **WallpaperService**: Configuración de fondos de pantalla
- **TranslateService**: Internacionalización

## 🎨 Componentes personalizados

- **Gallery**: Componente de galería de fotos
- **Picture**: Visualizador de imágenes
- **UserForm**: Formulario de usuario
- **Header**: Cabecera personalizada
- **Loading**: Indicador de carga

## 🧪 Testing

Ejecutar tests:
```bash
npm test
```

⭐ **¡No olvides darle una estrella al proyecto si te gusta!** ⭐