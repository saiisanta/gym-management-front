// AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/api";
import { mapRoleIdToRole } from "../utils/RoleMapper";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar usuario desde localStorage y reparar role/roleId
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // 🔹 Aseguramos que siempre existan roleId y role válidos
      if (!parsedUser.roleId && parsedUser.role) {
        switch (parsedUser.role) {
          case "superadmin":
            parsedUser.roleId = 1;
            break;
          case "adminSucursal":
            parsedUser.roleId = 2;
            break;
          case "recepcionista":
            parsedUser.roleId = 3;
            break;
          case "cliente":
          default:
            parsedUser.roleId = 4;
            break;
        }
      }

      // 🔹 Normalizamos el nombre del rol usando el mapper
      parsedUser.role = mapRoleIdToRole(parsedUser.roleId);

      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  // ✅ Login: guarda usuario con roleId + role coherentes
  const login = async (email, password) => {
    const data = await loginUser(email, password);

    const roleId = data.roleId || data.role;
    const loggedUser = {
      id: data.userId,
      token: data.token,
      roleId,
      role: mapRoleIdToRole(roleId),
      email: data.email,
      nombre: data.nombre,
      lastname: data.lastname,
      telNumber: data.telNumber,
      plan: data.plan,
    };

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    return loggedUser;
  };

  // ✅ Registrar nuevo usuario
  const register = async (userData) => {
    const newUser = await registerUser(userData);
    return newUser;
  };

  // ✅ Guardar usuario actualizado (por ejemplo desde el perfil)
  const saveUser = (updatedUser) => {
    if (!user) return;

    const safeUser = {
      ...user,
      ...updatedUser,
      roleId: updatedUser.roleId || user.roleId || 4,
      role: mapRoleIdToRole(updatedUser.roleId || user.roleId || 4),
    };

    setUser(safeUser);
    localStorage.setItem("user", JSON.stringify(safeUser));
  };

  // ✅ Logout seguro
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: saveUser, // usamos saveUser para evitar inconsistencias
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
