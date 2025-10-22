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

// Obtener perfil (funcion para admins, ya que el perfil del usuario se obtiene de AuthContext)
export const getUserProfile = async (id) => {
  const { data } = await API.get(`/usuarios/${id}`);
  return data;
};

//Actualizar perfil
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


// Actualizar usuario (PATCH)
export const updateUser = async (id, updatedData) => {
  const { data: existingUser } = await API.get(`/usuarios/${id}`);
  const payload = { ...existingUser, ...updatedData };
  const { data } = await API.patch(`/usuarios/${id}`, payload);
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


//Superadmin: Crear Sucursal

// Obtener sucursales
export const getSucursales = async () => {
  const { data } = await API.get("/sucursales");
  return data;
};

// Obtener sucursales
export const getSucursalById = async (id) => {
  const { data } = await API.get(`/sucursales/${id}`);
  return data;
};

// Crear sucursal
export const createSucursal = async (sucursalData) => {
  const { data } = await API.post("/sucursales", sucursalData);
  return data;
};

// Actualizar sucursal
export const updateSucursal = async (id, sucursalData) => {
  const { data } = await API.put(`/sucursales/${id}`, sucursalData);
  return data;
};

// Eliminar sucursal
export const deleteSucursal = async (id) => {
  const { data } = await API.delete(`/sucursales/${id}`);
  return data;
};

//adminSucursal: Clases

// Obtener todas las clases de una sucursal
export const getClasesBySucursal = async (sucursalId) => {
  console.log("SucursalId recibido:", sucursalId);
  if (!sucursalId) {
    console.warn("No se recibió sucursalId válido");
    return [];
  }

  const { data } = await API.get(`/clases?sucursalId=${sucursalId}`);
  console.log("Clases recibidas del backend:", data);
  return data;
};

// Crear una nueva clase
export const createClase = async (claseData) => {
  const { data } = await API.post("/clases", claseData);
  return data;
};

// Actualizar clase parcialmente (PATCH)
export const updateClase = async (id, updatedData) => {
  const { data: existingClase } = await API.get(`/clases/${id}`);

  const payload = { ...existingClase, ...updatedData };
  const { data } = await API.patch(`/clases/${id}`, payload);
  return data;
};

// Eliminar clase
export const deleteClase = async (id) => {
  const { data } = await API.delete(`/clases/${id}`);
  return data;
};

// ===== PROFESORES =====
// Obtener profesores (opcional por sucursal)
export const getProfesores = async (sucursalId = null) => {
  let url = "/profesores";
  if (sucursalId) url += `?sucursalId=${sucursalId}`;
  const { data } = await API.get(url);
  return data;
};

// Crear profesor
export const createProfesor = async (profesorData) => {
  const { data } = await API.post("/profesores", profesorData);
  return data;
};

// Actualizar profesor parcialmente (PATCH)
export const updateProfesor = async (id, updatedData) => {
  // Traer primero el profesor actual para merge
  const { data: existingProfesor } = await API.get(`/profesores/${id}`);
  const payload = { ...existingProfesor, ...updatedData };
  const { data } = await API.patch(`/profesores/${id}`, payload);
  return data;
};

// Eliminar profesor
export const deleteProfesor = async (id) => {
  const { data } = await API.delete(`/profesores/${id}`);
  return data;
};



// === Usuarios de Sucursal ===
export const getUsuariosSucursal = async (sucursalId) => {
  try {
    const response = await API.get(`/usuarios?sucursalId=${sucursalId}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo usuarios de la sucursal:", error);
    throw error;
  }
};

// === Actualizar estado de usuario (dar alta/baja) ===
export const updateUserSucursal = async (id, body) => {
  try {
    const { data: existingUser } = await API.get(`/usuarios/${id}`);
    const payload = { ...existingUser, ...body };
    const { data } = await API.patch(`/usuarios/${id}`, payload);
    return data;
  } catch (error) {
    console.error("Error actualizando usuario de sucursal:", error);
    throw error;
  }
};


// revisar
export const assignAdminToSucursal = async (userId, sucursalId) => {
  const { data } = await API.post(`/usuarios/${userId}/assign-admin`, { sucursalId });
  return data;
};

// ===== PLANES =====
export const getPlanes = async () => {
  const { data } = await API.get("/planes");
  return data;
};

export { API };