// src/hooks/useApi.js
import { useState, useEffect } from "react";
import { getPlanes, getSucursales, getClasesBySucursal, getProfesores, API } from "../services/api";



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

export const useProfesores = () => {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const data = await getProfesores();
        setProfesores(data || []);
      } catch (err) {
        console.error("Error cargando profesores:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfesores();
  }, []);

  return { profesores, loading };
};


