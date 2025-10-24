import { useState, useEffect } from "react";
import {
  getSucursales,
  getSucursalById,
  createSucursal,
  updateSucursal,
  deleteSucursal,
} from "../../services/api";
import { toast } from "react-toastify";

export const useSucursales = (autoFetch = true) => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(autoFetch);

  const fetchSucursales = async () => {
    setLoading(true);
    try {
      const data = await getSucursales();
      setSucursales(data);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando sucursales");
    } finally {
      setLoading(false);
    }
  };

  const createNewSucursal = async (sucursalData) => {
    setLoading(true);
    try {
      await createSucursal(sucursalData);
      toast.success("Sucursal creada correctamente");
      fetchSucursales();
    } catch (err) {
      console.error(err);
      toast.error("Error al crear sucursal");
    } finally {
      setLoading(false);
    }
  };

  const updateExistingSucursal = async (id, sucursalData) => {
    setLoading(true);
    try {
      await updateSucursal(id, sucursalData);
      toast.success("Sucursal modificada correctamente");
      fetchSucursales();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar sucursal");
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingSucursal = async (id) => {
    setLoading(true);
    try {
      await deleteSucursal(id);
      toast.success("Sucursal eliminada correctamente");
      fetchSucursales();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar sucursal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) fetchSucursales();
  }, [autoFetch]);

  return {
    sucursales,
    loading,
    fetchSucursales,
    createNewSucursal,
    updateExistingSucursal,
    deleteExistingSucursal,
    getSucursalById,
  };
};
