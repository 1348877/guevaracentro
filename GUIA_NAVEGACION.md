# 🔍 GUÍA DE NAVEGACIÓN - DASHBOARD Y CHAT

## 📋 Cómo Probar Todo lo Implementado

### 1. 🚀 Iniciar el Sistema
```bash
# En la carpeta front-end
cd front-end
npm run dev

# En la carpeta backend (opcional)
cd backend
npm run dev
```

### 2. 🔐 Iniciar Sesión con Diferentes Roles

#### Como Admin:
- **Email:** admin@test.com
- **Password:** admin123
- **Funcionalidades:** Métricas completas, gestión de personal, reportes financieros

#### Como Secretaria:
- **Email:** secretaria@test.com
- **Password:** secretaria123
- **Funcionalidades:** Agenda del día, gestión de citas, notificaciones

#### Como Psicólogo:
- **Email:** psicologo@test.com
- **Password:** psicologo123
- **Funcionalidades:** Mis pacientes, agenda personal, notas clínicas

#### Como Paciente:
- **Email:** paciente@test.com
- **Password:** paciente123
- **Funcionalidades:** Mis citas, historial personal

---

## 🎯 Qué Buscar y Probar

### Dashboard Admin:
1. **Métricas principales** (esquina superior):
   - 127 pacientes total
   - 5 psicólogos activos
   - 89 citas del mes
   - S/. 12,450 ingresos

2. **Acciones rápidas** (4 secciones):
   - Gestión de Pacientes
   - Gestión de Citas
   - Personal
   - Reportes y Análisis

3. **Actividad reciente** (parte inferior):
   - Listado de actividades con timestamps
   - Botones de acción "Ver"

4. **Análisis** (gráficos):
   - Barras de progreso por estado de cita
   - Ranking de psicólogos más activos

### Dashboard Secretaria:
1. **Resumen del día** (parte superior):
   - 8 citas hoy
   - 3 por confirmar
   - 5 completadas
   - 1 cancelada

2. **Selector de fecha** (centro):
   - Input de fecha funcional
   - Botón "Hoy" para volver a fecha actual

3. **Lista de citas** (centro izquierda):
   - 6 citas programadas
   - Botones de acción: editar ✏️, llamar 📞, cancelar ❌

4. **Acciones rápidas** (centro derecha):
   - 6 botones con iconos
   - Colores diferenciados

5. **Notificaciones** (parte inferior):
   - 3 notificaciones importantes
   - Tipos: urgente, info

### Dashboard Psicólogo:
1. **Estadísticas** (parte superior):
   - 6 citas hoy
   - 6 pacientes activos
   - 96% tasa de éxito
   - 2 notas pendientes

2. **Tabs navegables**:
   - **Tab "Mi Agenda"**: Ver citas del día con detalles
   - **Tab "Mis Pacientes"**: Gestión de pacientes asignados
   - **Tab "Notas Clínicas"**: Notas recientes con contenido

3. **Acciones rápidas** (parte inferior):
   - 4 botones para acciones comunes

### Sistema de Chat:
1. **Botón flotante** (esquina inferior derecha):
   - Icono 💬 con animación bounce
   - Notificación roja con número "3"

2. **Botón en header** (parte superior):
   - Botón "💬 Chat" verde

3. **Interface del chat**:
   - Modal centrado
   - Header con estado "En línea"
   - Mensajes de ejemplo precargados
   - Indicador de escritura

4. **Funcionalidades**:
   - Escribir mensaje y enviar
   - Respuestas automáticas según keywords
   - Cerrar con botón ✕

---

## 💡 Palabras Clave para Probar Chat

### Probar estas palabras para respuestas automáticas:
- **"cita"** → Respuesta sobre agendamiento
- **"pago"** → Respuesta sobre facturación
- **"emergencia"** → Número de emergencia
- **"horario"** → Información de horarios
- **Cualquier otra** → Respuesta genérica

---

## 🔧 Detalles Técnicos a Verificar

### Responsive Design:
1. **Redimensionar ventana** a diferentes tamaños
2. **Modo móvil** (menos de 768px)
3. **Tablet** (768px - 1024px)
4. **Desktop** (más de 1024px)

### Animaciones:
1. **Hover effects** en botones
2. **Animaciones de entrada** de mensajes
3. **Bounce del botón flotante**
4. **Typing indicator** en chat

### Estados:
1. **Loading del dashboard** (spinner inicial)
2. **Estados de conexión** en chat
3. **Notificaciones** con badge rojo
4. **Tabs activos** en dashboard psicólogo

---

## 🎨 Elementos Visuales Destacados

### Gradientes:
- **Admin:** Azul/púrpura
- **Secretaria:** Azul/púrpura
- **Psicólogo:** Azul/púrpura
- **Chat:** Azul en header y botones

### Iconos:
- **Emojis** consistentes en toda la interfaz
- **Significado claro** para cada acción
- **Colores diferenciados** por tipo

### Efectos:
- **Sombras** en cards y botones
- **Transforms** en hover
- **Transiciones** suaves
- **Pulse** en notificaciones

---

## 🐛 Posibles Problemas y Soluciones

### Si no cargan los datos:
1. **Verificar** que el authService funciona
2. **Revisar** la consola del navegador
3. **Usar datos mock** (ya implementados)

### Si el chat no se abre:
1. **Verificar** que no hay errores de JavaScript
2. **Revisar** que el CSS se cargó
3. **Intentar** refrescar la página

### Si el diseño se ve mal:
1. **Verificar** que Dashboard.css se cargó
2. **Revisar** el responsive design
3. **Probar** en diferentes navegadores

---

## ✅ Checklist de Pruebas

### Dashboard Admin:
- [ ] Métricas se muestran correctamente
- [ ] Botones de navegación funcionan
- [ ] Actividad reciente visible
- [ ] Gráficos se renderizan

### Dashboard Secretaria:
- [ ] Selector de fecha funcional
- [ ] Citas se muestran con detalles
- [ ] Botones de acción responden
- [ ] Notificaciones aparecen

### Dashboard Psicólogo:
- [ ] Tabs cambian contenido
- [ ] Pacientes listados correctamente
- [ ] Notas clínicas expandidas
- [ ] Estadísticas actualizadas

### Sistema de Chat:
- [ ] Botón flotante visible
- [ ] Modal se abre correctamente
- [ ] Mensajes se envían y reciben
- [ ] Respuestas automáticas funcionan
- [ ] Se puede cerrar el chat

### Diseño Responsive:
- [ ] Funciona en móvil
- [ ] Se adapta a tablet
- [ ] Perfecto en desktop
- [ ] Animaciones suaves

---

## 🎯 Resultado Esperado

Al completar esta guía, deberías haber visto:
- **4 dashboards únicos** para cada rol
- **Sistema de chat funcional** con respuestas automáticas
- **Diseño profesional** con animaciones y efectos
- **Datos realistas** contextuales para cada usuario
- **Experiencia fluida** en todos los dispositivos

**Status esperado:** 🟢 TODO FUNCIONANDO CORRECTAMENTE
