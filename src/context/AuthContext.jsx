import React, { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/api";
import { mapRoleIdToRole, mapBackendRoleToRoleId } from "../utils/RoleMapper";
// Asumo que tienes una función mapPlanIdToName en PlanMapper
import { mapPlanIdToName } from "../utils/PlanMapper"; 

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

      // Normalizar PlanId y PlanName para el estado del front
      parsedUser.planId = parsedUser.planId ?? parsedUser.PlanId ?? null;
      if (parsedUser.planId && !parsedUser.planName) {
        parsedUser.planName = mapPlanIdToName(Number(parsedUser.planId));
      } else {
        parsedUser.planName = parsedUser.planName ?? "Sin plan";
      }


      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  // en login:
  const login = async (email, password) => {
    const data = await loginUser(email, password);

    // backend devuelve: { token, role, id, nombre, planId, planName, ... }
    const backendRole = data.role || null;
    const roleId = mapBackendRoleToRoleId(backendRole);
    // Manejar diferentes casings que pueden venir del backend
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
      estado: data.Estado ?? data.estado ?? "",
      sucursalId: data.sucursalId ?? null,
      // PlanId y PlanName (canónicos)
      planId: planIdNormalized,
      planName: planNameFromBackend ?? (planIdNormalized ? mapPlanIdToName(planIdNormalized) : "Sin plan"),
      image: data.image ?? "https://placehold.co/120x120?text=User",
    };
    

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
    return loggedUser;
  };

  // en register:
  const register = async (userData) => {
    const data = await registerUser(userData); // El backend devuelve: { token, role, id, nombre, planId, planName, ... }
    if (!data) return null; // Si el registro falla, no continuar

    const backendRole = data.role || null;
    const roleId = mapBackendRoleToRoleId(backendRole);

    // ✅ CORRECCIÓN PRINCIPAL: Capturar PlanId y PlanName desde la respuesta del backend
    const planIdFromBackend = data.planId ?? data.PlanId ?? data.plan ?? null;
    const planNameFromBackend = data.planName ?? data.PlanName ?? null; // data.planName ya viene del backend

    // Normalizar planId a número, igual que en login
    const planIdNormalized =
      planIdFromBackend !== undefined && planIdFromBackend !== null
        ? Number(planIdFromBackend)
        : null;
    

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

      // Almacenar el plan para el estado del front
      planId: planIdNormalized,
      planName: planNameFromBackend ?? (planIdNormalized ? mapPlanIdToName(planIdNormalized) : "Sin plan"),
      
      estado: data.Estado ?? data.estado ?? "",

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
      // Actualización de PlanId y PlanName: toma el valor más reciente o usa el existente.
      planId: updatedUser.planId ?? updatedUser.PlanId ?? user.planId ?? null,
      planName: updatedUser.planName ?? updatedUser.PlanName ?? ( (updatedUser.planId ?? updatedUser.PlanId) ? mapPlanIdToName(updatedUser.planId ?? updatedUser.PlanId) : user.planName ?? "Sin plan" ),
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