import React, { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/api";
import { mapRoleIdToRole, mapBackendRoleToRoleId } from "../utils/RoleMapper";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // dentro del useEffect: normalizar storedUser cuando se carga desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // Si el storedUser vino del backend (role string), convertirlo
      if (!parsedUser.roleId && parsedUser.role) {
        parsedUser.roleId = mapBackendRoleToRoleId(parsedUser.role);
      }

      // Asegurarnos de que parsedUser.role sea la clave amigable del front
      parsedUser.role = mapRoleIdToRole(parsedUser.roleId);

      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  // en login:
const login = async (email, password) => {
  const data = await loginUser(email, password);

  // backend devuelve: { token, role, id, nombre, ... }
  const backendRole = data.role || null;
  const roleId = mapBackendRoleToRoleId(backendRole);

  const loggedUser = {
    id: data.id ?? data.userId ?? null,
    token: data.token ?? null,
    roleId: roleId,
    role: mapRoleIdToRole(roleId),
    nombre: data.nombre ?? "",
    lastname: data.lastname ?? "",
    email: data.email ?? "",
    telNumber: data.telNumber ?? "",
    dni: data.dni ?? "",
    genero: data.genero ?? "",
    fechaNacimiento: data.fechaNacimiento ?? "",
    direccion: data.direccion ?? "",
    estado: data.estado ?? "",
    sucursalId: data.sucursalId ?? null,
    plan: data.plan ?? null,
    image: data.image ?? "https://placehold.co/120x120?text=User",
  };

  setUser(loggedUser);
  localStorage.setItem("user", JSON.stringify(loggedUser));
  return loggedUser;
};

  const register = async (userData) => {
    const newUser = await registerUser(userData);
    return newUser;
  };

  const saveUser = (updatedUser) => {
    if (!user) return;

    const safeUser = {
      ...user,
      ...updatedUser,
      roleId: updatedUser.roleId || user.roleId || 4,
      role: mapRoleIdToRole(updatedUser.roleId || user.roleId || 4),
      nombre: updatedUser.nombre ?? user.nombre,
      lastname: updatedUser.lastname ?? user.lastname,
      email: updatedUser.email ?? user.email,
      telNumber: updatedUser.telNumber ?? user.telNumber,
      dni: updatedUser.dni ?? user.dni,
      genero: updatedUser.genero ?? user.genero,
      fechaNacimiento: updatedUser.fechaNacimiento ?? user.fechaNacimiento,
      direccion: updatedUser.direccion ?? user.direccion,
      estado: updatedUser.estado ?? user.estado,
      sucursalId: updatedUser.sucursalId ?? user.sucursalId,
      plan: updatedUser.plan ?? user.plan,
      image: updatedUser.image ?? user.image,
    };

    setUser(safeUser);
    localStorage.setItem("user", JSON.stringify(safeUser));
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: saveUser,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
