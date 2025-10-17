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