import {
    getAdminSucursales,
    createAdminSucursal,
    updateAdminSucursal,
    deleteAdminSucursalById,
    getUsuariosSucursal,
    assignAdminToSucursal,
  } from "../../services/api";
  
  export const useAdminSucursales = () => {
    return {
      getAdminSucursales,
      createAdminSucursal,
      updateAdminSucursal,
      deleteAdminSucursalById,
      getUsuariosSucursal,
      assignAdminToSucursal,
    };
  };
  