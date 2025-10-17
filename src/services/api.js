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
  const { data } = await API.get(`/Users/${id}`);
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
  const { data } = await API.post("/Users", userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await API.put(`/Users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await API.delete(`/Users/${id}`);
  return data;
};

// Revisar
export const getUsuariosSucursal = async (sucursalId) => {
  const { data } = await API.get(`/Usuarios?sucursalId=${sucursalId}`);
  return data;
};

export const updateUserSucursal = async (userId, updatedData) => {
  const { data } = await API.patch(`/Usuarios/${userId}`, updatedData);
  return data;
};

// ===== Sucursales =====
export const getSucursales = async () => {
  const { data } = await API.get("/Sucursales");
  return data;
};

export const createSucursal = async (sucursalData) => {
  const { data } = await API.post("/Sucursales", sucursalData);
  return data;
};

export const updateSucursal = async (id, sucursalData) => {
  const { data } = await API.put(`/Sucursales/${id}`, sucursalData);
  return data;
};

export const deleteSucursal = async (id) => {
  const { data } = await API.delete(`/Sucursales/${id}`);
  return data;
};

// revisar
export const assignAdminToSucursal = async (userId, sucursalId) => {
  const { data } = await API.post(`/Users/${userId}/assign-admin`, { sucursalId });
  return data;
};

// ===== CLASES =====
export const getClases = async (sucursalId) => {
  const { data } = await API.get(`/Clases?sucursalId=${sucursalId}`);
  return data;
};

// Alias
export const getClasesBySucursal = getClases;

export const createClase = async (claseData) => {
  const { data } = await API.post("/Clases", claseData);
  return data;
};

export const updateClase = async (id, claseData) => {
  const { data } = await API.put(`/Clases/${id}`, claseData);
  return data;
};

export const deleteClase = async (id) => {
  const { data } = await API.delete(`/Clases/${id}`);
  return data;
};

// ===== Profesores y asignaciones =====
// Revisar
export const assignProfesorToClase = async (claseId, profesorId) => {
  const { data } = await API.post(`/Clases/${claseId}/assign-profesor`, { profesorId });
  return data;
};

// Revisar
export const asignarClaseAProfesor = async (profesorId, claseId) => {
  const { data } = await API.patch(`/Usuarios/${profesorId}/asignar-clase`, { claseId });
  return data;
};

// Revisar
export const getProfesoresSucursal = async (sucursalId) => {
  const { data } = await API.get(`/Usuarios/sucursal/${sucursalId}/profesores`);
  return data;
};

// ===== PLANES =====
export const getPlanes = async () => {
  const { data } = await API.get("/Planes");
  return data;
};
