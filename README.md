# 🏥 Centro Psicológico Integral Guevara

Sistema integral de gestión para centro psicológico con autenticación multi-modal, dashboard por roles y gestión completa de pacientes y citas.

## 🌟 Características Principales

- **🔐 Autenticación Multi-Modal**: Google OAuth2, SMS, Email/Password
- **👥 Gestión por Roles**: Admin, Secretaria, Psicólogo, Paciente
- **📊 Dashboard Intuitivo**: Métricas y estadísticas en tiempo real
- **🗓️ Gestión de Citas**: Agendamiento y seguimiento completo
- **👤 Gestión de Pacientes**: CRUD completo con historial
- **📱 Interfaz Responsive**: Optimizada para desktop y móvil
- **🚀 API RESTful**: Backend robusto con validación y seguridad

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con Express.js
- **PostgreSQL** con Sequelize ORM
- **JWT** para autenticación
- **bcryptjs** para encriptación
- **Google OAuth2** para login social

### Frontend
- **React 18** con Vite
- **React Router** para navegación
- **React Icons** para iconografía
- **CSS Modules** para estilos
- **Fetch API** para comunicación con backend

### Móvil (En desarrollo)
- **React Native** (estructura preparada)

## 📦 Instalación y Configuración

### Prerequisitos
- Node.js 16+
- PostgreSQL 12+
- npm o yarn

### 1. Clonar el Repositorio
```bash
git clone https://github.com/TU_USUARIO/centro-psicologico-integral-guevara.git
cd centro-psicologico-integral-guevara
```

### 2. Configurar Backend
```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Ejecutar seed de datos
npm run seed

# Iniciar servidor
npm run dev
```

### 3. Configurar Frontend
```bash
cd front-end
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL de tu backend

# Iniciar aplicación
npm run dev
```

## 🔧 Variables de Entorno

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
DB_NAME=centro_psicologico
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
GOOGLE_CLIENT_ID=tu_google_client_id
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Centro Psicológico Integral Guevara
```

## 👥 Roles y Permisos

### 🔑 Admin
- Acceso completo al sistema
- Gestión de usuarios y roles
- Configuración del sistema
- Reportes y analytics

### 📋 Secretaria
- Gestión de pacientes
- Agendamiento de citas
- Gestión de horarios
- Comunicación con pacientes

### 🧠 Psicólogo
- Gestión de pacientes asignados
- Historial clínico
- Evaluaciones y tests
- Reportes de progreso

### 🤝 Paciente
- Ver citas programadas
- Historial personal
- Evaluaciones disponibles
- Comunicación con terapeuta

## 📱 Características del Sistema

### Autenticación
- Login con Google OAuth2
- Login con SMS (simulado)
- Login tradicional email/password
- JWT tokens con expiración
- Middleware de autorización

### Dashboard
- Métricas en tiempo real
- Gráficos y estadísticas
- Navegación intuitiva
- Responsive design

### Gestión de Pacientes
- CRUD completo
- Historial clínico
- Documentos adjuntos
- Búsqueda avanzada

### Gestión de Citas
- Calendario interactivo
- Notificaciones automáticas
- Gestión de horarios
- Reportes de ocupación

## 🚀 Estructura del Proyecto

```
centro-psicologico-integral-guevara/
├── backend/                 # Servidor Node.js
│   ├── src/
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── models/          # Modelos de base de datos
│   │   ├── routes/          # Definición de rutas
│   │   ├── middleware/      # Middleware personalizado
│   │   ├── services/        # Lógica de negocio
│   │   └── utils/           # Utilidades y helpers
│   └── config/              # Configuración de BD
├── front-end/               # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── services/        # Servicios para API
│   │   └── styles/          # Estilos globales
│   └── public/              # Assets estáticos
└── app-movil/               # App React Native (futuro)
    ├── src/
    └── assets/
```

## 🧪 Testing

### Credenciales de Prueba
```
Admin
admin@psicologiaguevara.com / 123456
Debería ver: estadísticas generales, gestión de usuarios, etc.
👩‍💼 Secretaria
secretaria@psicologiaguevara.com / 123456
Debería ver: citas del día, gestión de citas pendientes
👨‍⚕️ Psicólogo
carlos@psicologiaguevara.com / 123456
Debería ver: sus citas del día, pacientes asignados
🧑‍🦱 Paciente
juan@email.com / 123456
Debería ver: próximas citas, historial personal
```

### Endpoints Principales
- `POST /api/auth/login-staff` - Login staff
- `POST /api/auth/login-google` - Login Google
- `GET /api/pacientes` - Listar pacientes
- `POST /api/citas` - Crear cita
- `GET /api/dashboard` - Datos dashboard

## 🔄 Flujo de Trabajo

1. **Login** → Autenticación multi-modal
2. **Dashboard** → Vista general según rol
3. **Gestión** → Pacientes, citas, horarios
4. **Reportes** → Métricas y estadísticas
5. **Navegación** → Flujo intuitivo sin perder sesión

## 🛡️ Seguridad

- **JWT Tokens** con expiración automática
- **Bcrypt** para hash de contraseñas
- **CORS** configurado correctamente
- **Validación** de datos en frontend y backend
- **Middleware** de autenticación y autorización

## 📊 Estado del Proyecto

- ✅ **Backend**: Completamente funcional
- ✅ **Frontend**: Interfaz completa y responsive
- ✅ **Autenticación**: Multi-modal implementada
- ✅ **Dashboard**: Por roles funcional
- ✅ **Gestión**: Pacientes y citas operativa
- 🔄 **App Móvil**: En desarrollo futuro

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.



⭐ **¡Dale una estrella a este proyecto si te fue útil!**
