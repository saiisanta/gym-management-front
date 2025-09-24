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
