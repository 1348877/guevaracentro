import React, { useState, useEffect } from 'react';
import AuthService from '../services/authService';
import DashboardService from '../services/dashboardService';

const DiagnosticoDashboard = () => {
  const [diagnostics, setDiagnostics] = useState({
    token: null,
    user: null,
    isAuthenticated: false,
    dashboardError: null,
    backendStatus: null
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const token = AuthService.getToken();
    const user = AuthService.getUser();
    const isAuthenticated = AuthService.isAuthenticated();

    console.log('🔍 Diagnóstico Dashboard:');
    console.log('Token:', token);
    console.log('Usuario:', user);
    console.log('Autenticado:', isAuthenticated);

    let dashboardError = null;
    let backendStatus = null;

    try {
      // Probar conectividad con el backend
      const response = await fetch('/api/health', {
        headers: AuthService.getAuthHeaders()
      });
      backendStatus = response.status;
    } catch (error) {
      backendStatus = `Error: ${error.message}`;
    }

    try {
      // Probar endpoint del dashboard
      const dashboardData = await DashboardService.getDashboard();
      console.log('✅ Dashboard cargado exitosamente:', dashboardData);
    } catch (error) {
      dashboardError = error.message;
      console.error('❌ Error al cargar dashboard:', error);
    }

    setDiagnostics({
      token: token ? `${token.substring(0, 20)}...` : 'No hay token',
      user: user ? `${user.email} (${user.rol})` : 'No hay usuario',
      isAuthenticated,
      dashboardError,
      backendStatus
    });
  };

  const handleRelogin = async () => {
    try {
      // Simular relogin con credenciales de prueba
      const result = await AuthService.login('admin@admin.com', 'admin123');
      console.log('✅ Relogin exitoso:', result);
      runDiagnostics();
    } catch (error) {
      console.error('❌ Error en relogin:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔍 Diagnóstico del Dashboard</h2>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Estado de Autenticación</h3>
        <p><strong>Token:</strong> {diagnostics.token}</p>
        <p><strong>Usuario:</strong> {diagnostics.user}</p>
        <p><strong>¿Autenticado?:</strong> {diagnostics.isAuthenticated ? '✅ Sí' : '❌ No'}</p>
        <p><strong>Backend Status:</strong> {diagnostics.backendStatus}</p>
      </div>

      <div style={{ backgroundColor: '#ffebee', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Error del Dashboard</h3>
        <p>{diagnostics.dashboardError || 'Sin errores'}</p>
      </div>

      <div>
        <button onClick={runDiagnostics} style={{ marginRight: '10px', padding: '10px 20px' }}>
          🔄 Ejecutar Diagnóstico
        </button>
        <button onClick={handleRelogin} style={{ marginRight: '10px', padding: '10px 20px' }}>
          🔑 Intentar Relogin
        </button>
        <button onClick={() => AuthService.logout()} style={{ padding: '10px 20px' }}>
          🚪 Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default DiagnosticoDashboard;
