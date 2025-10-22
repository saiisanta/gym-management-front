// src/hooks/useApi.js
import { useState, useEffect } from "react";
import { API, getPlanes, getSucursales, getClasesBySucursal, getProfesores, createProfesor, updateProfesor, deleteProfesor } from "../services/api";



export const usePlanes = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlanes()
      .then((data) => setPlanes(data))
      .catch((err) => console.error("Error cargando planes:", err))
      .finally(() => setLoading(false));
  }, []);

  return { planes, loading };
};

export const useSucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSucursales()
      .then((data) => setSucursales(data))
      .catch((err) => console.error("Error cargando sucursales:", err))
      .finally(() => setLoading(false));
  }, []);

  return { sucursales, loading };
};


export const useClases = (sucursalId = null) => {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClases = async () => {
      setLoading(true);
      try {
        let data = [];
        if (sucursalId) {
          data = await getClasesBySucursal(sucursalId);
        } else {
          // Traer todas las clases para Home
          const response = await API.get("/clases");
          data = response.data;
        }
        setClases(data || []);
      } catch (err) {
        console.error("Error cargando clases:", err);
        setClases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClases();
  }, [sucursalId]);

  return { clases, loading };
};

// Hook existente de profesores
export const useProfesores = (sucursalId = null) => {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const data = await getProfesores(sucursalId);
        setProfesores(data || []);
      } catch (err) {
        console.error("Error cargando profesores:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfesores();
  }, [sucursalId]);

  // Funciones CRUD
  const addProfesor = async (profesorData) => {
    const created = await createProfesor(profesorData);
    setProfesores((prev) => [...prev, created]);
    return created;
  };

  const editProfesor = async (id, updatedData) => {
    const updated = await updateProfesor(id, updatedData);
    setProfesores((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    return updated;
  };

  const removeProfesor = async (id) => {
    await deleteProfesor(id);
    setProfesores((prev) => prev.filter((p) => p.id !== id));
  };

  return { profesores, loading, addProfesor, editProfesor, removeProfesor };
};


