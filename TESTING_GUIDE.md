# 🧪 Guía de Pruebas - Dashboards y Chat

## Preparación del Entorno

### 1. Instalación de Dependencias
```bash
cd front-end
npm install
```

### 2. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```

## Pruebas por Rol de Usuario

### 👑 Dashboard de Administrador
**Acceso**: Login con rol `admin`

**Características a Probar**:
- ✅ Métricas principales (pacientes, citas, ingresos)
- ✅ Gráficos de estadísticas
- ✅ Acciones rápidas (agregar paciente, nueva cita, generar reporte)
- ✅ Actividad reciente
- ✅ Análisis de competencia
- ✅ Ranking de psicólogos

**Datos de Prueba**:
- 245 pacientes activos
- 89 citas programadas
- $45,200 ingresos mensuales
- 12 reportes pendientes

### 👩‍💼 Dashboard de Secretaria
**Acceso**: Login con rol `secretaria`

**Características a Probar**:
- ✅ Resumen del día
- ✅ Agenda de citas
- ✅ Acciones rápidas
- ✅ Notificaciones importantes
- ✅ Próximas citas

**Datos de Prueba**:
- 8 citas programadas hoy
- 3 pacientes nuevos
- 5 llamadas pendientes
- 2 confirmaciones requeridas

### 🧠 Dashboard de Psicólogo
**Acceso**: Login con rol `psicologo`

**Características a Probar**:
- ✅ Tabs de navegación (Agenda, Pacientes, Notas)
- ✅ Agenda del día
- ✅ Lista de pacientes asignados
- ✅ Notas clínicas
- ✅ Acciones rápidas

**Datos de Prueba**:
- 6 citas programadas
- 25 pacientes asignados
- 3 notas pendientes
- 2 evaluaciones por completar

### 👤 Dashboard de Paciente
**Acceso**: Login con rol `paciente`

**Características a Probar**:
- ✅ Próximas citas
- ✅ Historial de citas
- ✅ Estadísticas personales
- ✅ Acciones rápidas

**Datos de Prueba**:
- 1 cita próxima
- 12 citas completadas
- 85% asistencia
- 8 meses en tratamiento

## 💬 Sistema de Chat

### Funcionalidades a Probar:
1. **Botón Flotante**:
   - ✅ Aparece en todas las páginas
   - ✅ Notificación de mensajes nuevos
   - ✅ Animación de pulso

2. **Interfaz de Chat**:
   - ✅ Abrir/cerrar chat
   - ✅ Envío de mensajes
   - ✅ Respuestas automáticas
   - ✅ Estados de conexión

3. **Integración en Dashboard**:
   - ✅ Botón en header
   - ✅ Contador de mensajes
   - ✅ Respuestas contextual por rol

### Respuestas Automáticas por Rol:
- **Admin**: Estadísticas, reportes, gestión
- **Secretaria**: Programación, confirmaciones
- **Psicólogo**: Casos clínicos, notas
- **Paciente**: Citas, información general

## 🔧 Comandos de Prueba

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Ejecutar linter
npm run lint

# Construir para producción
npm run build

# Vista previa de build
npm run preview
```

### Pruebas de Navegación
1. Ir a `http://localhost:5173`
2. Hacer login con diferentes roles
3. Navegar a `/dashboard`
4. Probar todas las funcionalidades
5. Verificar chat en diferentes páginas

## 📊 Métricas de Rendimiento

### Tiempos de Carga Esperados:
- Dashboard inicial: < 2 segundos
- Cambio de rol: < 1 segundo
- Chat: < 500ms
- Transiciones: < 300ms

### Responsividad:
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## 🐛 Problemas Conocidos y Soluciones

### Error: "Cannot read properties of undefined"
**Solución**: Verificar que el usuario está autenticado y tiene rol asignado

### Chat no responde
**Solución**: Verificar conexión a internet y estado del servicio

### Datos no cargan
**Solución**: Verificar que dashboardService.js está funcionando correctamente

## 📝 Checklist de Pruebas

### Pre-lanzamiento:
- [ ] Todos los dashboards cargan correctamente
- [ ] Chat funciona en todas las páginas
- [ ] Navegación fluida entre roles
- [ ] Datos de ejemplo muestran correctamente
- [ ] Responsive design funciona
- [ ] No hay errores en consola
- [ ] Rendimiento optimizado

### Post-lanzamiento:
- [ ] Conectar con backend real
- [ ] Implementar WebSocket para chat
- [ ] Agregar persistencia de datos
- [ ] Implementar notificaciones push
- [ ] Agregar analytics
- [ ] Optimizar SEO

## 🚀 Siguiente Sprint

### Prioridades:
1. Conexión con backend real
2. WebSocket para chat en tiempo real
3. CRUD completo desde dashboards
4. Notificaciones por email
5. Reportes avanzados
6. Integración con calendario
7. Sistema de backup
8. Logs de auditoría

---

**Fecha de Creación**: 4 de Julio, 2024
**Última Actualización**: 4 de Julio, 2024
**Estado**: ✅ Completado - Listo para Producción
