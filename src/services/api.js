import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

//Interceptor de token
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ===== AUTH =====
export const loginUser = async (email, password) => {
  const { data } = await API.post("/Auth/login", { email, password });
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await API.post("/Auth/register", userData);
  return data;
};

// ===== PROFILE =====
export const getUserProfile = async (id) => {
  const { data } = await API.get(`/usuarios/${id}`);
  return data;
};

export const updateUserProfile = async (id, updatedData) => {
  const { data } = await API.patch(`/usuarios/${id}`, updatedData);
  return data;
};

// ===== USERS =====
export const getAllUsers = async () => {
  const { data } = await API.get("/usuarios");
  return data;
};

export const createUser = async (userData) => {
  const { data } = await API.post("/usuarios", userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await API.put(`/usuarios/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await API.delete(`/usuarios/${id}`);
  return data;
};

//Superadmin: Admin Sucursal

// Obtener solo adminSucursal (roleId = 2)
export const getAdminSucursales = async () => {
  const { data } = await API.get("/usuarios?roleId=2");
  return data;
};

// Crear adminSucursal
export const createAdminSucursal = async (userData) => {
  const { data } = await API.post("/usuarios", { ...userData, roleId: 2 });
  return data;
};

// Actualizar adminSucursal
export const updateAdminSucursal = async (id, updatedData) => {
  const { data } = await API.patch(`/usuarios/${id}`, updatedData);
  return data;
};

// Eliminar adminSucursal
export const deleteAdminSucursalById = async (id) => {
  const { data } = await API.delete(`/usuarios/${id}`);
  return data;
};


// Revisar
export const getUsuariosSucursal = async (sucursalId) => {
  const { data } = await API.get(`/usuarios?sucursalId=${sucursalId}`);
  return data;
};

export const updateUserSucursal = async (userId, updatedData) => {
  const { data } = await API.patch(`/usuarios/${userId}`, updatedData);
  return data;
};

// ===== Sucursales =====
export const getSucursales = async () => {
  const { data } = await API.get("/sucursales");
  return data;
};

export const createSucursal = async (sucursalData) => {
  const { data } = await API.post("/sucursales", sucursalData);
  return data;
};

export const updateSucursal = async (id, sucursalData) => {
  const { data } = await API.put(`/sucursales/${id}`, sucursalData);
  return data;
};

export const deleteSucursal = async (id) => {
  const { data } = await API.delete(`/sucursales/${id}`);
  return data;
};

// revisar
export const assignAdminToSucursal = async (userId, sucursalId) => {
  const { data } = await API.post(`/usuarios/${userId}/assign-admin`, { sucursalId });
  return data;
};

// ===== CLASES =====
export const getClases = async (sucursalId) => {
  const { data } = await API.get(`/clases?sucursalId=${sucursalId}`);
  return data;
};

// Alias
export const getClasesBySucursal = getClases;

export const createClase = async (claseData) => {
  const { data } = await API.post("/clases", claseData);
  return data;
};

export const updateClase = async (id, claseData) => {
  const { data } = await API.put(`/clases/${id}`, claseData);
  return data;
};

export const deleteClase = async (id) => {
  const { data } = await API.delete(`/clases/${id}`);
  return data;
};

// ===== Profesores y asignaciones =====
// Revisar
export const assignProfesorToClase = async (claseId, profesorId) => {
  const { data } = await API.post(`/clases/${claseId}/assign-profesor`, { profesorId });
  return data;
};

// Revisar
export const asignarClaseAProfesor = async (profesorId, claseId) => {
  const { data } = await API.patch(`/usuarios/${profesorId}/asignar-clase`, { claseId });
  return data;
};

// Revisar
export const getProfesoresSucursal = async (sucursalId) => {
  const { data } = await API.get(`/usuarios/sucursal/${sucursalId}/profesores`);
  return data;
};

// ===== PLANES =====
export const getPlanes = async () => {
  const { data } = await API.get("/planes");
  return data;
};
