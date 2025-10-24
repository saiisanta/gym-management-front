import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// ===== Intercepta token =====
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ==========================
AUTHENTICATION
========================== */
export const loginUser = async (email, password) => {
  const { data } = await API.post("/Auth/login", { email, password });
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await API.post("/Auth/register", userData);
  return data;
};

/* ==========================
USERS / PROFILE
========================== */
export const getUserProfile = async (id) => {
  const { data } = await API.get(`/usuarios/${id}`);
  return data;
};

export const updateUserProfile = async (id, updatedData) => {
  const { data } = await API.patch(`/usuarios/${id}`, updatedData);
  return data;
};

export const getAllUsers = async () => {
  const { data } = await API.get("/usuarios");
  return data;
};

export const createUser = async (userData) => {
  const { data } = await API.post("/usuarios", userData);
  return data;
};

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

/* ==========================
ADMIN SUCURSAL
========================== */
export const getAdminSucursales = async () => {
  const { data } = await API.get("/usuarios", { params: { roleId: 2 } });
  return data;
};

export const createAdminSucursal = async (userData) => {
  const { data } = await API.post("/usuarios", { ...userData, roleId: 2 });
  return data;
};

export const updateAdminSucursal = async (id, updatedData) => {
  const { data } = await API.patch(`/usuarios/${id}`, updatedData);
  return data;
};

export const deleteAdminSucursalById = async (id) => {
  const { data } = await API.delete(`/usuarios/${id}`);
  return data;
};

export const getAdminSucursalById = async (id) => {
  const { data } = await API.get(`/usuarios/${id}`);
  return data;
};

export const updateUserSucursal = updateUser;

/* ==========================
SUCURSALES
========================== */
export const getSucursales = async () => {
  const { data } = await API.get("/sucursales");
  return data;
};

export const getSucursalById = async (id) => {
  const { data } = await API.get(`/sucursales/${id}`);
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

/* ==========================
PROFESORES
========================== */
export const getProfesores = async (sucursalId = null) => {
  const params = sucursalId ? { sucursalId } : {};
  const { data } = await API.get("/profesores", { params });
  return data;
};

export const getProfesorById = async (id) => {
  const { data } = await API.get(`/profesores/${id}`);
  return data;
};

export const createProfesor = async (profesorData) => {
  const { data } = await API.post("/profesores", profesorData);
  return data;
};

export const updateProfesor = async (id, updatedData) => {
  const { data: existingProfesor } = await API.get(`/profesores/${id}`);
  const payload = { ...existingProfesor, ...updatedData };
  const { data } = await API.patch(`/profesores/${id}`, payload);
  return data;
};

export const deleteProfesor = async (id) => {
  const { data } = await API.delete(`/profesores/${id}`);
  return data;
};

/* ==========================
PLANES / MEMBRESIAS
========================== */
export const getPlanes = async () => {
  const { data } = await API.get("/planes");
  return data;
};

export const getMembresiasByAlumno = async (alumnoId, params = {}) => {
  const { data } = await API.get("/membresias", {
    params: { alumnoId, ...params },
  });
  return data;
};


export const getPlanById = async (id) => {
  const { data } = await API.get(`/planes/${id}`);
  return data;
};


export const updatePlan = async (id, updatedData) => {
  const { data: existing } = await API.get(`/planes/${id}`);
  const payload = { ...existing, ...updatedData };
  const { data } = await API.patch(`/planes/${id}`, payload);
  return data;
};

export const createPlan = async (planData) => {
  const { data } = await API.post("/planes", planData);
  return data;
};

export const createMembresia = async (membresiaData) => {
  const { data } = await API.post("/membresias", membresiaData);
  return data;
};

export const updateMembresia = async (id, updatedData) => {
  const { data: existing } = await API.get(`/membresias/${id}`);
  const payload = { ...existing, ...updatedData };
  const { data } = await API.patch(`/membresias/${id}`, payload);
  return data;
};

export const deletePlan = async (id) => {
  const { data } = await API.delete(`/planes/${id}`);
  return data;
};

/* ==========================
CLASES / RESERVAS
========================== */
export const getClases = async (params = {}) => {
  const { data } = await API.get("/clases", { params });
  return data;
};

export const getClasesBySucursal = async (sucursalId, params = {}) => {
  const { data } = await API.get("/clases", { 
    params: { 
      sucursalId, 
      ...params
    } 
  });
  return data;
};

export const getClaseById = async (id) => {
  const { data } = await API.get(`/clases/${id}`);
  return data;
};

export const createClase = async (claseData) => {
  const { data } = await API.post("/clases", claseData);
  return data;
};

export const updateClase = async (id, updatedData) => {
  const { data: existingClase } = await API.get(`/clases/${id}`);
  const payload = { ...existingClase, ...updatedData };
  const { data } = await API.patch(`/clases/${id}`, payload);
  return data;
};

export const deleteClase = async (id) => {
  const { data } = await API.delete(`/clases/${id}`);
  return data;
};

export const getClaseCupo = async (claseId) => {
  const [{ data: clase }, { data: reservas }] = await Promise.all([
    API.get(`/clases/${claseId}`),
    API.get("/reservas", { params: { claseId, estado: "confirmada" } }),
  ]);
  return {
    cupoMaximo: clase.cupoMaximo,
    reservasActuales: reservas?.length || 0,
  };
};

export const getReservasByAlumno = async (alumnoId) => {
  const { data } = await API.get("/reservas", { params: { alumnoId } });
  return data;
};

export const getReservasByClase = async (claseId, params = {}) => {
  const { data } = await API.get("/reservas", {
    params: { claseId, ...params },
  });
  return data;
};

export const createReserva = async (reservaData) => {
  const { data } = await API.post("/reservas", reservaData);
  return data;
};

export const updateReserva = async (id, updatedData) => {
  const { data: existing } = await API.get(`/reservas/${id}`);
  const payload = { ...existing, ...updatedData };
  const { data } = await API.patch(`/reservas/${id}`, payload);
  return data;
};

export const deleteReserva = async (id) => {
  const { data } = await API.delete(`/reservas/${id}`);
  return data;
};

/* ==========================
WAITLIST
========================== */
export const getWaitlistByClase = async (claseId) => {
  const { data } = await API.get("/waitlists", { params: { claseId } });
  return data;
};

export const createWaitlistEntry = async (entry) => {
  const { data } = await API.post("/waitlists", entry);
  return data;
};

export const deleteWaitlistEntry = async (id) => {
  const { data } = await API.delete(`/waitlists/${id}`);
  return data;
};

/* ==========================
OTROS
========================== */
export const getUsuariosSucursal = async (sucursalId) => {
  const { data } = await API.get("/usuarios", { params: { sucursalId } });
  return data;
};

export const assignAdminToSucursal = async (userId, sucursalId) => {
  const { data } = await API.post(`/usuarios/${userId}/assign-admin`, {
    sucursalId,
  });
  return data;
};

/* ==========================
Export Axios Instance
========================== */
export { API };
