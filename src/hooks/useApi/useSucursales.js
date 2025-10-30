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
  const [error, setError] = useState(null);

  const fetchSucursales = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSucursales();
      setSucursales(data);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando sucursales");
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createNewSucursal = async (sucursalData) => {
    setLoading(true);
    setError(null);
    try {
      await createSucursal(sucursalData);
      toast.success("Sucursal creada correctamente");
      fetchSucursales();
    } catch (err) {
      console.error(err);
      toast.error("Error al crear sucursal");
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateExistingSucursal = async (id, sucursalData) => {
    setLoading(true);
    setError(null);
    try {
      await updateSucursal(id, sucursalData);
      toast.success("Sucursal modificada correctamente");
      fetchSucursales();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar sucursal");
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingSucursal = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteSucursal(id);
      toast.success("Sucursal eliminada correctamente");
      fetchSucursales();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar sucursal");
      setError(err);
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
    error,
    fetchSucursales,
    createNewSucursal,
    updateExistingSucursal,
    deleteExistingSucursal,
    getSucursalById,
  };
};