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
    const planIdFromBackend = data.planId ?? data.PlanId ?? data.plan ?? null;
    const planNameFromBackend =
      data.planName ?? data.PlanName ?? data.planName ?? null;
    
    // if planIdFromBackend is a numeric string, convert
    const planIdNormalized =
      planIdFromBackend !== undefined && planIdFromBackend !== null
        ? Number(planIdFromBackend)
        : null;
    
    const loggedUser = {
      id: data.id ?? data.userId ?? null,
      token: data.token ?? null,
      roleId: roleId,
      role: mapRoleIdToRole(roleId),
      nombre: data.nombre ?? "",
      apellido: data.apellido ?? "",
      email: data.email ?? "",
      telNumber: data.telNumber ?? "",
      dni: data.dni ?? "",
      genero: data.genero ?? "",
      fechaNacimiento: data.fechaNacimiento ?? "",
      direccion: data.direccion ?? "",
      estado: data.estado ?? "",
      sucursalId: data.sucursalId ?? null,
      // NUEVO: planId + planName (canónicos)
      planId: planIdNormalized,
      planName: planNameFromBackend ?? (planIdNormalized ? mapPlanIdToName(planIdNormalized) : null),
      image: data.image ?? "https://placehold.co/120x120?text=User",
    };
    

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    return loggedUser;
  };

  const register = async (userData) => {
    const data = await registerUser(userData); // El backend devuelve: { token, role, id, nombre, ... }
    const backendRole = data.role || null;
    const roleId = mapBackendRoleToRoleId(backendRole);

    const registeredUser = {
      id: data.id ?? data.userId ?? null,
      token: data.token ?? null,
      roleId: roleId,
      role: mapRoleIdToRole(roleId),
      nombre: data.nombre ?? "",
      apellido: data.apellido ?? "",
      email: data.email ?? userData.Email,
      dni: data.dni,

      telNumber: data.telNumber ?? "",
      
      fechaNacimiento: data.fechaNacimiento,
      direccion: data.direccion,
      genero: data.genero,
      image: data.image,

      plan: data.plan ?? null,
      estado: data.estado ?? "",

      sucursalId: data.sucursalId,
    };

    setUser(registeredUser);
    localStorage.setItem("user", JSON.stringify(registeredUser));

    return registeredUser;
  };

  const saveUser = (updatedUser) => {
    if (!user) return;

    const safeUser = {
      ...user,
      ...updatedUser,
      roleId: updatedUser.roleId || user.roleId || 4,
      role: mapRoleIdToRole(updatedUser.roleId || user.roleId || 4),
      nombre: updatedUser.nombre ?? user.nombre,
      apellido: updatedUser.apellido ?? user.apellido,
      email: updatedUser.email ?? user.email,
      telNumber: updatedUser.telNumber ?? user.telNumber,
      dni: updatedUser.dni ?? user.dni,
      genero: updatedUser.genero ?? user.genero,
      fechaNacimiento: updatedUser.fechaNacimiento ?? user.fechaNacimiento,
      direccion: updatedUser.direccion ?? user.direccion,
      estado: updatedUser.estado ?? user.estado,
      sucursalId: updatedUser.sucursalId ?? user.sucursalId,
      // NUEVO: prioridad planId > planName > fallback user.planId
      planId: updatedUser.planId ?? updatedUser.PlanId ?? user.planId ?? user.plan ?? null,
      planName: updatedUser.planName ?? updatedUser.PlanName ?? ( (updatedUser.planId ?? updatedUser.PlanId) ? mapPlanIdToName(updatedUser.planId ?? updatedUser.PlanId) : user.planName ?? ( user.planId ? mapPlanIdToName(user.planId) : user.plan ?? null ) ),
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
