# Guevara Centro Psicológico Integral - Resumen de Progreso

## Objetivo
Desarrollar una plataforma digital minimalista (estilo Apple, blanco/negro, botones curveados) para la gestión de un centro psicológico en Juliaca, Perú. El sistema permite gestionar citas, pacientes y resultados de test, con panel web para secretaría/psicólogos y app móvil para pacientes.

---

## Estructura actual del proyecto

### backend/ (Node.js + Express + PostgreSQL)
- **Modelos Sequelize** completos: Paciente, Psicólogo, Usuario, Cita, Test, ResultadoTest.
- **Controladores y rutas RESTful** para Paciente (listar, crear, buscar por ID, eliminar, poblar con datos de prueba).
- **Conexión y sincronización** con PostgreSQL local, usando variables de entorno.
- **Endpoint especial** para poblar la base de datos con pacientes de ejemplo.
- **Servidor corriendo en puerto 3001** y aceptando peticiones desde el frontend (CORS habilitado).

### front-end/ (React + Vite)
- **Sistema de rutas** y layout minimalista.
- **Página Pacientes** conectada al backend, mostrando la lista de pacientes en tiempo real.
- **Servicio JS** para consumir la API de pacientes.
- **Componentes base**: Navbar, Button.
- **Preparado para seguir conectando más recursos (citas, login, etc.)**.

### app-movil/ (React Native)
- Estructura base creada, listo para iniciar desarrollo una vez backend y frontend web estén sólidos.

---

## Proceso y logros recientes

- PostgreSQL instalado y configurado localmente.
- Base de datos creada y sincronizada automáticamente por Sequelize.
- Pruebas de endpoints exitosas usando Postman.
- Frontend y backend conectados y funcionando en local.
- Visualización de pacientes en la interfaz web.

---

## Siguientes pasos recomendados

- Conectar y mostrar/agendar citas desde el frontend.
- Implementar autenticación (login) para usuarios/psicólogos.
- Mejorar el diseño y experiencia de usuario en la web.
- Replicar la estructura de controladores/rutas para otros recursos (Citas, Psicólogos, etc.).
- Iniciar desarrollo de la app móvil cuando el backend esté estable.
- Preparar despliegue en la nube (Azure para backend/DB, GitHub Pages para frontend).

---

¿Quieres que te ayude con el siguiente paso específico, como conectar la gestión de citas, agregar login, o mejorar el diseño?
