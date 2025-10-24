import { useState, useEffect } from "react";
import {
  getPlanes,
  getPlanById,
  createPlan as apiCreatePlan,
  updatePlan as apiUpdatePlan,
  deletePlan as apiDeletePlan,
} from "../../services/api";
import { toast } from "react-toastify";

export const usePlanes = (autoFetch = true) => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(autoFetch);

  const fetchPlanes = async () => {
    setLoading(true);
    try {
      const data = await getPlanes();
      setPlanes(data);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando planes");
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (planData) => {
    setLoading(true);
    try {
      const newPlan = await apiCreatePlan(planData);
      setPlanes((prev) => [...prev, newPlan]);
      toast.success("Plan creado correctamente");
      return newPlan;
    } catch (err) {
      console.error(err);
      toast.error("Error creando plan");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (id, planData) => {
    setLoading(true);
    try {
      const updatedPlan = await apiUpdatePlan(id, planData);
      setPlanes((prev) => prev.map((p) => (p.id === id ? updatedPlan : p)));
      toast.success("Plan actualizado correctamente");
      return updatedPlan;
    } catch (err) {
      console.error(err);
      toast.error("Error actualizando plan");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (id) => {
    setLoading(true);
    try {
      await apiDeletePlan(id);
      setPlanes((prev) => prev.filter((p) => p.id !== id));
      toast.success("Plan eliminado correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error eliminando plan");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) fetchPlanes();
  }, [autoFetch]);

  return {
    planes,
    loading,
    fetchPlanes,
    createPlan,
    updatePlan,
    deletePlan,
    getPlanById,
  };
};
