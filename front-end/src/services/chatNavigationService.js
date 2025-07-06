/**
 * Servicio de navegación inteligente para el chatbot
 * Permite redirigir usuarios a secciones específicas de la aplicación
 */

class ChatNavigationService {
  constructor() {
    this.navigationMap = {
      // Servicios
      'agendar-cita': '/agendar',
      'servicios': '/servicios',
      'terapia-individual': '/servicios#terapia-individual',
      'terapia-familiar': '/servicios#terapia-familiar',
      'evaluacion-psicologica': '/servicios#evaluacion-psicologica',
      'psicologia-infantil': '/servicios#psicologia-infantil',
      
      // Equipo
      'equipo': '/equipo',
      'especialistas': '/equipo',
      'dr-carlos-guevara': '/equipo#dr-carlos-guevara',
      'dra-maria-rodriguez': '/equipo#dra-maria-rodriguez',
      'dr-luis-martinez': '/equipo#dr-luis-martinez',
      'dra-ana-lopez': '/equipo#dra-ana-lopez',
      
      // Información
      'contacto': '/contacto',
      'ubicacion': '/contacto#ubicacion',
      'horarios': '/contacto#horarios',
      'preguntas-frecuentes': '/faq',
      'blog': '/blog',
      'nosotros': '/nosotros',
      
      // Dashboard según rol
      'dashboard': '/dashboard',
      'mis-citas': '/dashboard#mis-citas',
      'mi-perfil': '/dashboard#mi-perfil',
      'mi-historial': '/dashboard#mi-historial',
      
      // Administrativo
      'pacientes': '/pacientes',
      'reportes': '/dashboard#reportes',
      'configuracion': '/dashboard#configuracion',
      
      // Externos
      'whatsapp': 'https://wa.me/573012345678',
      'telefono': 'tel:+573012345678',
      'email': 'mailto:info@centroguevara.com',
      'emergencia': 'tel:123',
      'linea-crisis': 'tel:106'
    };
  }

  /**
   * Navega a una ruta específica
   */
  navigateTo(destination, userRole = 'public') {
    try {
      // Verificar si es una ruta válida
      const route = this.getRoute(destination, userRole);
      
      if (route) {
        // Si es una URL externa, abrir en nueva pestaña
        if (route.startsWith('http') || route.startsWith('tel:') || route.startsWith('mailto:')) {
          window.open(route, '_blank');
          return true;
        }
        
        // Para rutas internas, usar el router de React
        if (window.history && window.history.pushState) {
          window.history.pushState({}, '', route);
          // Disparar evento personalizado para que React Router lo detecte
          window.dispatchEvent(new PopStateEvent('popstate'));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error al navegar:', error);
      return false;
    }
  }

  /**
   * Obtiene la ruta para un destino
   */
  getRoute(destination, userRole = 'public') {
    const key = destination.toLowerCase().replace(/\s+/g, '-');
    
    // Verificar si existe en el mapa de navegación
    if (this.navigationMap[key]) {
      return this.navigationMap[key];
    }
    
    // Rutas especiales según el rol
    const roleSpecificRoutes = {
      'admin': {
        'inicio': '/dashboard',
        'usuarios': '/dashboard#usuarios',
        'sistema': '/dashboard#sistema'
      },
      'secretaria': {
        'inicio': '/dashboard',
        'agenda': '/dashboard#agenda',
        'citas': '/pacientes'
      },
      'psicologo': {
        'inicio': '/dashboard',
        'agenda': '/dashboard#mi-agenda',
        'recursos': '/dashboard#recursos'
      },
      'paciente': {
        'inicio': '/dashboard',
        'perfil': '/dashboard#mi-perfil'
      },
      'public': {
        'inicio': '/',
        'informacion': '/nosotros'
      }
    };
    
    const roleRoutes = roleSpecificRoutes[userRole] || roleSpecificRoutes['public'];
    return roleRoutes[key] || null;
  }

  /**
   * Obtiene sugerencias de navegación basadas en el contexto
   */
  getNavigationSuggestions(currentPath, userRole = 'public') {
    const suggestions = {
      '/': {
        'public': [
          { text: 'Ver Servicios', route: '/servicios' },
          { text: 'Conocer Equipo', route: '/equipo' },
          { text: 'Agendar Cita', route: '/agendar' }
        ],
        'paciente': [
          { text: 'Mi Dashboard', route: '/dashboard' },
          { text: 'Agendar Cita', route: '/agendar' },
          { text: 'Mis Citas', route: '/dashboard#mis-citas' }
        ]
      },
      '/servicios': {
        'public': [
          { text: 'Agendar Cita', route: '/agendar' },
          { text: 'Ver Especialistas', route: '/equipo' },
          { text: 'Contactar', route: '/contacto' }
        ]
      },
      '/equipo': {
        'public': [
          { text: 'Agendar con Especialista', route: '/agendar' },
          { text: 'Ver Servicios', route: '/servicios' },
          { text: 'Leer Más', route: '/nosotros' }
        ]
      },
      '/dashboard': {
        'paciente': [
          { text: 'Agendar Nueva Cita', route: '/agendar' },
          { text: 'Ver Mi Historial', route: '/dashboard#mi-historial' },
          { text: 'Actualizar Perfil', route: '/dashboard#mi-perfil' }
        ],
        'psicologo': [
          { text: 'Ver Agenda', route: '/dashboard#mi-agenda' },
          { text: 'Buscar Paciente', route: '/pacientes' },
          { text: 'Recursos', route: '/dashboard#recursos' }
        ],
        'admin': [
          { text: 'Gestionar Usuarios', route: '/dashboard#usuarios' },
          { text: 'Ver Reportes', route: '/dashboard#reportes' },
          { text: 'Configuración', route: '/dashboard#configuracion' }
        ]
      }
    };

    const pathSuggestions = suggestions[currentPath] || {};
    return pathSuggestions[userRole] || pathSuggestions['public'] || [];
  }

  /**
   * Genera botones de navegación para el chatbot
   */
  generateNavigationButtons(actions, userRole = 'public') {
    return actions.map(action => {
      const route = this.getRoute(action, userRole);
      
      return {
        text: action,
        route: route,
        onClick: () => this.navigateTo(action, userRole),
        isExternal: route && (route.startsWith('http') || route.startsWith('tel:') || route.startsWith('mailto:'))
      };
    }).filter(button => button.route !== null);
  }

  /**
   * Verifica si el usuario tiene acceso a una ruta
   */
  hasAccessToRoute(route, userRole) {
    const protectedRoutes = {
      '/dashboard': ['paciente', 'psicologo', 'secretaria', 'admin'],
      '/pacientes': ['psicologo', 'secretaria', 'admin'],
      '/agendar': ['paciente', 'admin', 'public'] // público puede agendar pero debe registrarse
    };

    // Si la ruta no está protegida, permitir acceso
    if (!protectedRoutes[route]) {
      return true;
    }

    // Verificar si el rol tiene acceso
    return protectedRoutes[route].includes(userRole);
  }

  /**
   * Redirige a la página de login si es necesario
   */
  redirectToLoginIfNeeded(route, userRole) {
    if (!this.hasAccessToRoute(route, userRole) && userRole === 'public') {
      // Guardar la ruta deseada para redirigir después del login
      sessionStorage.setItem('redirectAfterLogin', route);
      return this.navigateTo('/login', userRole);
    }
    return false;
  }

  /**
   * Obtiene el contexto actual de navegación
   */
  getCurrentContext() {
    return {
      currentPath: window.location.pathname,
      hash: window.location.hash,
      search: window.location.search,
      fullUrl: window.location.href
    };
  }

  /**
   * Genera breadcrumbs inteligentes
   */
  generateBreadcrumbs(currentPath) {
    const breadcrumbMap = {
      '/': [{ text: 'Inicio', route: '/' }],
      '/servicios': [
        { text: 'Inicio', route: '/' },
        { text: 'Servicios', route: '/servicios' }
      ],
      '/equipo': [
        { text: 'Inicio', route: '/' },
        { text: 'Nuestro Equipo', route: '/equipo' }
      ],
      '/agendar': [
        { text: 'Inicio', route: '/' },
        { text: 'Agendar Cita', route: '/agendar' }
      ],
      '/dashboard': [
        { text: 'Inicio', route: '/' },
        { text: 'Mi Dashboard', route: '/dashboard' }
      ],
      '/pacientes': [
        { text: 'Dashboard', route: '/dashboard' },
        { text: 'Pacientes', route: '/pacientes' }
      ]
    };

    return breadcrumbMap[currentPath] || [{ text: 'Inicio', route: '/' }];
  }
}

// Crear instancia singleton
const chatNavigationService = new ChatNavigationService();

export default chatNavigationService;
