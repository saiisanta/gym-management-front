import { useState, useEffect } from "react";
import {
  getMembresiasByAlumno,
  createMembresia,
  updateMembresia,
} from "../../services/api";

export const useMembresias = (alumnoId = null) => {
  const [membresias, setMembresias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!alumnoId) return;
    const fetchMembresias = async () => {
      try {
        const data = await getMembresiasByAlumno(alumnoId);
        setMembresias(data);
      } catch (error) {
        console.error("Error cargando membresías:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembresias();
  }, [alumnoId]);

  const addMembresia = async (data) => {
    const nueva = await createMembresia(data);
    setMembresias((prev) => [...prev, nueva]);
  };

  const editMembresia = async (id, data) => {
    const actualizada = await updateMembresia(id, data);
    setMembresias((prev) =>
      prev.map((m) => (m.id === id ? actualizada : m))
    );
  };

  return { membresias, loading, addMembresia, editMembresia };
};
