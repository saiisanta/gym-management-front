import { useState, useEffect } from "react";
import {
  getAllUsers,
  getUserProfile,
  updateUser as apiUpdateUser,
  createUser as apiCreateUser,
  deleteUser as apiDeleteUser,
} from "../../services/api";
import { toast } from "react-toastify";

export const useUsuarios = (autoFetch = true) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(autoFetch);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  };

  const createUsuario = async (userData) => {
    setLoading(true);
    try {
      const newUser = await apiCreateUser(userData);
      setUsuarios((prev) => [...prev, newUser]);
      toast.success("Usuario creado correctamente");
      return newUser;
    } catch (err) {
      console.error(err);
      toast.error("Error creando usuario");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUsuario = async (id, updatedData) => {
    setLoading(true);
    try {
      const updatedUser = await apiUpdateUser(id, updatedData);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? updatedUser : u))
      );
      toast.success("Usuario actualizado correctamente");
      return updatedUser;
    } catch (err) {
      console.error(err);
      toast.error("Error actualizando usuario");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUsuario = async (id) => {
    setLoading(true);
    try {
      await apiDeleteUser(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      toast.success("Usuario eliminado correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error eliminando usuario");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUsuarioById = async (id) => {
    try {
      return await getUserProfile(id);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) fetchUsuarios();
  }, [autoFetch]);

  return {
    usuarios,
    loading,
    fetchUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuarioById,
  };
};
