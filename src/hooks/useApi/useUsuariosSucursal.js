import { useState, useEffect } from "react";
import { getUsuariosSucursal, updateUserSucursal } from "../../services/api";

export const useUsuariosSucursal = (sucursalId) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sucursalId) return;

    let isMounted = true;
    setLoading(true);

    const fetchUsuarios = async () => {
      try {
        const data = await getUsuariosSucursal(sucursalId);
        const usuariosNormalizados = data.map(u => ({
          ...u,
          apellido: u.lastname || "",
          telefono: u.telNumber || "",
        }));
        if (isMounted) {
          setUsuarios(usuariosNormalizados);
          setError(null);
        }
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsuarios();

    return () => {
      isMounted = false;
    };
  }, [sucursalId]);

  const toggleEstadoUsuario = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";

    setUsuarios(prev =>
      prev.map(u => (u.id === id ? { ...u, estado: nuevoEstado } : u))
    );

    try {
      await updateUserSucursal(id, { estado: nuevoEstado });
    } catch (err) {
      console.error("Error actualizando usuario:", err);

      setUsuarios(prev =>
        prev.map(u => (u.id === id ? { ...u, estado: estadoActual } : u))
      );
      setError(err);
    }
  };

  return { usuarios, loading, error, toggleEstadoUsuario };
};
