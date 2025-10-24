import { useState, useEffect } from "react";
import {
  getReservasByAlumno,
  getReservasByClase,
  createReserva,
  updateReserva,
  deleteReserva,
} from "../../services/api";

export const useReservas = ({ alumnoId = null, claseId = null } = {}) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        let data = [];
        if (alumnoId) data = await getReservasByAlumno(alumnoId);
        else if (claseId) data = await getReservasByClase(claseId);
        setReservas(data);
      } catch (error) {
        console.error("Error cargando reservas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, [alumnoId, claseId]);

  const addReserva = async (data) => {
    const nueva = await createReserva(data);
    setReservas((prev) => [...prev, nueva]);
  };

  const editReserva = async (id, data) => {
    const actualizada = await updateReserva(id, data);
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? actualizada : r))
    );
  };

  const removeReserva = async (id) => {
    await deleteReserva(id);
    setReservas((prev) => prev.filter((r) => r.id !== id));
  };

  return { reservas, loading, addReserva, editReserva, removeReserva };
};
