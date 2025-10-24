import { useState, useEffect } from "react";
import { 
  getAdminSucursales, 
  createAdminSucursal, 
  updateAdminSucursal, 
  deleteAdminSucursalById, 
  getSucursales 
} from "../../services/api";
import { toast } from "react-toastify";

export const useAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [adminData, sucData] = await Promise.all([getAdminSucursales(), getSucursales()]);
      
      const adminsConSucursal = adminData.map((a) => {
        const sucursal = sucData.find((s) => s.id === a.sucursalId);
        const nombreSucursal = sucursal ? sucursal.nombre.replace(/-/g, " ").trim() : "Sin sucursal";
        return {
          id: a.id,
          nombre: a.nombre || "",
          lastname: a.lastname || "",
          email: a.email || "",
          sucursalId: a.sucursalId || "",
          sucursal: nombreSucursal,
        };
      });

      setAdmins(adminsConSucursal);
      setSucursales(sucData);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar admins o sucursales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const createAdmin = async (userData) => {
    setLoading(true);
    try {
      await createAdminSucursal(userData);
      toast.success("Admin creado correctamente");
      cargarDatos();
    } catch (err) {
      console.error(err);
      toast.error("Error al crear admin");
    } finally {
      setLoading(false);
    }
  };

  const updateAdmin = async (id, updatedData) => {
    setLoading(true);
    try {
      await updateAdminSucursal(id, updatedData);
      toast.success("Admin actualizado correctamente");
      cargarDatos();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar admin");
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (id) => {
    setLoading(true);
    try {
      await deleteAdminSucursalById(id);
      toast.success("Admin eliminado correctamente");
      cargarDatos();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar admin");
    } finally {
      setLoading(false);
    }
  };

  return { admins, sucursales, loading, createAdmin, updateAdmin, deleteAdmin, reload: cargarDatos };
};
