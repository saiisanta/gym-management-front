Este proyecto académico, desarrollado en el marco de la Tecnicatura Universitaria en Programación – UTN FRRO (2025), implementa un Sistema de Gestión de Gimnasios que centraliza y optimiza la administración de:

Registro y gestión de clientes.

Creación y gestión de sucursales, salas y horarios de clases.

Gestión de planes y membresías, con control de pagos.

Sistema de reservas con control automático de cupos.

Notificaciones automáticas (correo/SMS) para confirmaciones, recordatorios y cancelaciones.

Panel administrativo con reportes, KPIs y exportación de datos (CSV, XLSX, PDF).

Auditoría y registro de acciones críticas con control de acceso basado en roles.

Tecnologías principales:

Frontend: React + React-Bootstrap

Backend: ASP.NET Core (C#) – API RESTful

Base de datos: PostgreSQL (SQLite para prototipado)

Autenticación: JWT

Objetivo:
Optimizar procesos administrativos, mejorar la experiencia de los usuarios y generar información estratégica para la toma de decisiones en gimnasios de múltiples sucursales.

Estado del proyecto:

Desarrollo planificado por módulos: clientes, sucursales, clases, reservas, pagos, notificaciones, reportes y auditoría.

Con integración progresiva entre frontend, backend y base de datos.

Incluye pruebas unitarias e integración, documentación técnica y manuales de usuario.

Integrantes:

Simón Santarelli – Frontend / UI/UX

Francisco Cumini – Backend / Lógica de negocio

Pablo Cardillo – Base de datos / Automatizaciones


ESTRUCTURA:
/src
  /assets             -> imágenes, íconos, fuentes, logos
  /components         -> componentes reutilizables (Botones, Tablas, Inputs, Modales)
  /layouts            -> plantillas base (AuthLayout, DashboardLayout)
  /pages              -> vistas principales según rol
    /public           -> Landing, Login, Registro
    /cliente          -> Reservas, MisPagos, MiPerfil
    /recepcionista    -> CheckIn, RegistrarPago, GestionClientes
    /adminSucursal    -> Clases, Salas, ReportesSucursal
    /superadmin       -> Sucursales, Planes, ReportesGlobales, Usuarios
  /routes             -> configuración de rutas protegidas y públicas
  /services           -> conexión con API (axios/fetch) separados por módulo
    authService.js
    clienteService.js
    claseService.js
    pagoService.js
    reservaService.js
    planService.js
    sucursalService.js
  /context            -> Context API (auth, notificaciones, global state)
  /hooks              -> custom hooks (useAuth, useFetch, useReserva)
  /utils              -> validaciones, formateadores de fechas, helpers
  /styles             -> estilos globales o personalizados (además de Bootstrap)
  App.jsx             -> configuración principal
  main.jsx            -> punto de entrada
