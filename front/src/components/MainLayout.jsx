// Estructura base para el frontend del Centro Psicológico Integral Guevara
// Cada sección tendrá su propio archivo y será llenada progresivamente

import React from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div>
      {/* Navbar se mantiene arriba */}
      <Outlet />
      {/* Footer global aquí si se requiere */}
    </div>
  );
}
