import { useState, useEffect, useCallback } from "react";
import {
  getClasesBySucursal as apiGetClasesBySucursal,
  getClases as apiGetAllClases,
  createClase as apiCreateClase,
  updateClase as apiUpdateClase,
  deleteClase as apiDeleteClase,
} from "../../services/api";
import { toast } from "react-toastify";

export const useClases = (sucursalId) => {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshClases = useCallback(async () => {
    setLoading(true);
    try {
      const cacheBuster = Date.now();
      let data = [];

      //Cargar por Sucursal o cargar Todas
      if (sucursalId) {
        // Si se proporciona un ID, filtra por sucursal
        data = await apiGetClasesBySucursal(sucursalId, { cacheBuster });
      } else {
        // Si no se proporciona ID trae todas
        data = await apiGetAllClases({ cacheBuster }); 
      }
      
      setClases(data);
    } catch (err) {
      toast.error("Error cargando clases", err);
    } finally {
      setLoading(false);
    }
  }, [sucursalId]);

  useEffect(() => {
    refreshClases();
  }, [refreshClases]);

  const createClase = useCallback(
    async (payload) => {
      try {
        await apiCreateClase(payload);
        await refreshClases();
      } catch (err) {
        toast.error("Error creando clase", err);
        throw err;
      }
    },
    [refreshClases]
  );

  const updateClase = useCallback(
    async (id, payload) => {
      try {
        await apiUpdateClase(id, payload);
        await refreshClases();
      } catch (err) {
        toast.error("Error actualizando clase", err);
        throw err;
      }
    },
    [refreshClases]
  );

  const deleteClase = useCallback(
    async (id) => {
      try {
        await apiDeleteClase(id);
        await refreshClases();
      } catch (err) {
        toast.error("Error eliminando clase", err);
        throw err;
      }
    },
    [refreshClases]
  );

  return {
    clases,
    loading,
    createClase,
    updateClase,
    deleteClase,
    refreshClases,
  };
};