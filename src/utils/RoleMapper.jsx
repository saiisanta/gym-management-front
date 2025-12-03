export const mapRoleIdToRole = (roleId) => {
  switch (roleId) {
    case 1:
      return "superadmin";
    case 2:
      return "adminSucursal";
    case 3:
      return "recepcionista";
    case 4:
      return "cliente";
    default:
      return "cliente";
  }
};

// NUEVA: mapea el role string del backend a roleId del frontend
export const mapBackendRoleToRoleId = (backendRole) => {
  if (!backendRole) return 4; // cliente por defecto

  const r = backendRole.trim().toLowerCase();
  switch (r) {
    case "superadministrador":
    case "superadmin":
      return 1;
    case "administrador":
    case "admin":
    case "adminSucursal":
    case "admin_sucursal":
      return 2;
    case "recepcionista":
      return 3;
    case "profesor":
      // en tu app profesor no equivale a admin -> lo tratamos como cliente en el front
      // si querés un roleId específico, ajustalo aquí
      return 4;
    case "alumno":
    case "usuario":
    default:
      return 4;
  }
};
