import { useState, useEffect } from "react";
import {
  getProfesores,
  getProfesorById,
  createProfesor,
  updateProfesor,
  deleteProfesor,
} from "../../services/api";

export const useProfesores = (sucursalId = null) => {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);

  // === Carga profesores ===
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const data = await getProfesores();
        const filtrados = sucursalId
          ? data.filter((p) => p.sucursalId === sucursalId)
          : data;
        setProfesores(filtrados);
      } catch (error) {
        console.error("Error cargando profesores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfesores();
  }, [sucursalId]);

  const addProfesor = async (profesorData) => {
    const nuevo = await createProfesor(profesorData);
    setProfesores((prev) => [...prev, nuevo]);
  };

  const editProfesor = async (id, profesorData) => {
    const actualizado = await updateProfesor(id, profesorData);
    setProfesores((prev) =>
      prev.map((p) => (p.id === id ? actualizado : p))
    );
  };

  const removeProfesor = async (id) => {
    await deleteProfesor(id);
    setProfesores((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    profesores,
    loading,
    addProfesor,
    editProfesor,
    removeProfesor,
  };
};
