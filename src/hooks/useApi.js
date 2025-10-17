// src/hooks/useApi.js
import { useState, useEffect } from "react";
import { getPlanes, getSucursales } from "../services/api";
import { getClases } from "../services/api";


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


export const useClases = () => {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClases()
      .then((data) => setClases(data))
      .catch((err) => console.error("Error cargando clases:", err))
      .finally(() => setLoading(false));
  }, []);

  return { clases, loading };
};