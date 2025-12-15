// src/hooks/useApi/useUsuarios.js
import { useState, useEffect } from "react";
import {
  getAllUsers,
  getUserProfile,
  updateUser as apiUpdateUser,
  createUser as apiCreateUser,
  deleteUser as apiDeleteUser,
} from "../../services/api";
import { toast } from "react-toastify";
import { mapBackendRoleToRoleId } from "../../utils/RoleMapper";

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

  const normalizeUser = (u = {}) => {
    const raw = u.usuario ?? u;

    // planId raw detection (no convertir strings arbitrarios)
    const planIdRaw =
      raw.PlanId !== undefined
        ? raw.PlanId
        : raw.planId !== undefined
        ? raw.planId
        : undefined;

    // planName detection (preferir campos explícitos o plan string)
    const planNameRaw =
      raw.PlanName ??
      raw.planName ??
      (raw.Plan && typeof raw.Plan === "object"
        ? raw.Plan.Nombre ?? raw.Plan.name
        : raw.plan !== undefined
        ? (typeof raw.plan === "string" ? raw.plan : undefined)
        : undefined);

    // planId: convertir sólo si viene realmente numérico
    let planId = null;
    if (planIdRaw !== undefined && planIdRaw !== null && planIdRaw !== "") {
      const maybe = Number(planIdRaw);
      planId = Number.isFinite(maybe) ? maybe : null;
    } else if (raw.Plan && typeof raw.Plan === "object") {
      planId = raw.Plan.Id ?? null;
    } else {
      // si backend devolvió plan === null explícitamente, mantenemos null
      if (raw.plan === null) planId = null;
      // en otro caso dejamos planId = null (sin forzar 0 o NaN)
    }

    const planName = planNameRaw ?? null;

    return {
      id: raw.Id ?? raw.id ?? raw.userId ?? null,
      nombre: raw.Nombre ?? raw.nombre ?? "",
      apellido:
        raw.Apellido ??
        raw.apellido ??
        raw.lastname ??
        raw.Lastname ??
        raw.last_name ??
        "",
      email: raw.Email ?? raw.email ?? "",
      telNumber:
        raw.Telefono ?? raw.telefono ?? raw.TelNumber ?? raw.telNumber ?? "",
      dni: raw.Dni ?? raw.dni ?? raw.Documento ?? "",
      genero: raw.Genero ?? raw.genero ?? null,
      fechaNacimiento:
        raw.FechaNacimiento ?? raw.fechaNacimiento
          ? String(raw.FechaNacimiento ?? raw.fechaNacimiento).substring(0, 10)
          : "",
      direccion: raw.Direccion ?? raw.direccion ?? "",
      estado:
        typeof raw.Estado === "string"
          ? raw.Estado
          : raw.Estado === true
          ? "activo"
          : raw.Estado === false
          ? "inactivo"
          : raw.estado ?? "",
      planId: planId,
      planName: planName,
      sucursalId: raw.SucursalId ?? raw.sucursalId ?? raw.branchId ?? null,
      image: raw.Image ?? raw.image ?? null,
      role: raw.Role ?? raw.role ?? "",
      roleId: raw.RoleId ?? raw.roleId ?? null,
    };
  };

  /**
   * Smart merge: prev = existing normalized user; next = backendUser/raw
   */
  const smartMerge = (prev = {}, nextRaw = {}) => {
    const next = nextRaw.usuario ?? nextRaw;
    const mapped = {};

    if ("Id" in next || "id" in next) mapped.id = next.Id ?? next.id;
    if ("Nombre" in next || "nombre" in next)
      mapped.nombre = next.Nombre ?? next.nombre;
    if ("Apellido" in next || "apellido" in next)
      mapped.apellido = next.Apellido ?? next.apellido;
    if ("lastname" in next || "Lastname" in next)
      mapped.apellido = mapped.apellido ?? next.lastname ?? next.Lastname;
    if ("Email" in next || "email" in next)
      mapped.email = next.Email ?? next.email;
    if ("Telefono" in next || "telefono" in next)
      mapped.telNumber = next.Telefono ?? next.telefono;
    if ("TelNumber" in next || "telNumber" in next)
      mapped.telNumber = mapped.telNumber ?? next.TelNumber ?? next.telNumber;
    if ("Dni" in next || "dni" in next) mapped.dni = next.Dni ?? next.dni;
    if ("Genero" in next || "genero" in next)
      mapped.genero = next.Genero ?? next.genero;
    if ("FechaNacimiento" in next || "fechaNacimiento" in next)
      mapped.fechaNacimiento = next.FechaNacimiento ?? next.fechaNacimiento;
    if ("Direccion" in next || "direccion" in next)
      mapped.direccion = next.Direccion ?? next.direccion;
    if ("Estado" in next || "estado" in next)
      mapped.estado = next.Estado ?? next.estado;

    // PLAN: tratar null/empty explícitamente y evitar Number(...) sobre strings de nombre
    if ("Plan" in next || "plan" in next) {
      const rawPlanVal = next.Plan !== undefined ? next.Plan : next.plan;
      if (rawPlanVal === null) {
        mapped.planId = null;
        mapped.planName = null;
      } else if (rawPlanVal !== undefined && rawPlanVal !== "") {
        if (typeof rawPlanVal === "object") {
          mapped.planId = rawPlanVal.Id ?? rawPlanVal.PlanId ?? mapped.planId;
          mapped.planName = rawPlanVal.Nombre ?? rawPlanVal.name ?? mapped.planName;
        } else {
          const maybeNum = Number(rawPlanVal);
          if (Number.isFinite(maybeNum)) mapped.planId = maybeNum;
          else mapped.planName = rawPlanVal ?? mapped.planName;
        }
      } else {
        // empty string -> interpret as "Sin plan"
        mapped.planId = null;
        mapped.planName = "";
      }
    }
    if ("PlanId" in next || "planId" in next) mapped.planId = next.PlanId ?? next.planId;
    if ("PlanName" in next || "planName" in next)
      mapped.planName = next.PlanName ?? next.planName;
    if ("SucursalId" in next || "sucursalId" in next)
      mapped.sucursalId = next.SucursalId ?? next.sucursalId;
    if ("Image" in next || "image" in next)
      mapped.image = next.Image ?? next.image;
    if ("Role" in next || "role" in next) mapped.role = next.Role ?? next.role;
    if ("RoleId" in next || "roleId" in next)
      mapped.roleId = next.RoleId ?? next.roleId;

    // Build merged: start from prev then apply only keys present in mapped
    const merged = { ...prev };
    Object.keys(mapped).forEach((k) => {
      const v = mapped[k];
      // <-- aceptar null como valor intencional; solo ignorar undefined
      if (v !== undefined) {
        merged[k] = v;
      }
    });

    return merged;
  };

  const updateUsuario = async (id, updatedData) => {
    setLoading(true);
    try {
      const raw = await apiUpdateUser(id, updatedData);
      console.log("🔥 RAW RESPONSE DEL BACKEND:", raw);

      const backendUser = raw?.usuario ?? raw;
      const previous = usuarios.find((u) => u.id === id) || {};

      const merged = smartMerge(previous, backendUser);
      console.log("🔥 MERGED SMART:", merged);

      const normalized = normalizeUser(merged);
      console.log("🔥 NORMALIZED:", normalized);

      setUsuarios((prev) => prev.map((u) => (u.id === id ? normalized : u)));

      toast.success("Usuario actualizado correctamente");

      return normalized;
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
