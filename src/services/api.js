import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5262/api",
});

// ===== Intercepta token =====
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    const { token } = JSON.parse(storedUser);

    if (token) {
      // Fuerza clave EXACTA para ASP.NET
      config.headers['Authorization'] = `Bearer ${token}`;
    }
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
  const { data } = await API.get(`/Usuarios/${id}`);
  return data;
};

export const updateUserProfile = async (id, updatedData) => {
  const { data } = await API.patch(`/Usuarios/${id}`, updatedData);
  return data;
};

export const getAllUsers = async () => {
  const { data } = await API.get("/Usuarios");
  return data;
};

export const createUser = async (userData) => {
  const { data } = await API.post("/Usuarios", userData);
  return data;
};

export const updateUser = async (id, updatedData) => {
  
   const { data } = await API.patch(`/Usuarios/${id}`, updatedData);
   return data;
  };

export const deleteUser = async (id) => {
  const { data } = await API.delete(`/Usuarios/${id}`);
  return data;
};

/* ==========================
ADMIN SUCURSAL
========================== */
export const getAdminSucursales = async () => {
  const { data } = await API.get("/Usuarios", { params: { roleId: 2 } });
  return data;
};

export const createAdminSucursal = async (userData) => {
  const { data } = await API.post("/Usuarios", { ...userData, roleId: 2 });
  return data;
};

export const updateAdminSucursal = async (id, updatedData) => {
  const { data } = await API.patch(`/Usuarios/${id}`, updatedData);
  return data;
};

export const deleteAdminSucursalById = async (id) => {
  const { data } = await API.delete(`/Usuarios/${id}`);
  return data;
};

export const getAdminSucursalById = async (id) => {
  const { data } = await API.get(`/Usuarios/${id}`);
  return data;
};

export const updateUserSucursal = updateUser;

/* ==========================
SUCURSALES
========================== */
export const getSucursales = async () => {
  const { data } = await API.get("/Sucursales");
  return data;
};

export const getSucursalById = async (id) => {
  const { data } = await API.get(`/Sucursales/${id}`);
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


/* ==========================
SALAS
========================== */
export const getSalasBySucursal = async (sucursalId) => {
  // Usamos el endpoint específico de C#
  const { data } = await API.get(`/Salas/sucursal/${sucursalId}`); 
  return data;
};

export const createSala = async (salaData) => {
  // salaData debe contener { SucursalId, Nombre, Tipo, Capacidad, Descripcion }
  const { data } = await API.post("/Salas", salaData);
  return data;
};

export const updateSala = async (id, salaData) => {
  // salaData debe contener { Nombre, Tipo, Capacidad, Descripcion }
  const { data } = await API.put(`/Salas/${id}`, salaData);
  return data;
};

export const deleteSala = async (id) => {
  // Usamos el método DELETE que mapea a la acción Desactivar en el Controller
  const { data } = await API.delete(`/Salas/${id}`); 
  return data;
};

/* ==========================
PROFESORES
========================== */
export const getProfesores = async (sucursalId = null) => {
  const params = sucursalId ? { sucursalId } : {};
  const { data } = await API.get("/Profesores", { params });
  return data;
};

export const getProfesorById = async (id) => {
  const { data } = await API.get(`/Profesores/${id}`);
  return data;
};

export const createProfesor = async (profesorData) => {
  const { data } = await API.post("/Profesores", profesorData);
  return data;
};

export const updateProfesor = async (id, updatedData) => {
  const { data: existingProfesor } = await API.get(`/profesores/${id}`);
  const payload = { ...existingProfesor, ...updatedData };
  const { data } = await API.patch(`/Profesores/${id}`, payload);
  return data;
};

export const deleteProfesor = async (id) => {
  const { data } = await API.delete(`/Profesores/${id}`);
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
  const { data } = await API.get("/Membresias", {
    params: { alumnoId, ...params },
  });
  return data;
};


export const getPlanById = async (id) => {
  const { data } = await API.get(`/Planes/${id}`);
  return data;
};


export const updatePlan = async (id, updatedData) => {
  const { data: existing } = await API.get(`/Planes/${id}`);
  const payload = { ...existing, ...updatedData };
  const { data } = await API.patch(`/Planes/${id}`, payload);
  return data;
};

export const createPlan = async (planData) => {
  const { data } = await API.post("/Planes", planData);
  return data;
};

export const createMembresia = async (membresiaData) => {
  const { data } = await API.post("/Membresias", membresiaData);
  return data;
};

export const updateMembresia = async (id, updatedData) => {
  const { data: existing } = await API.get(`/Membresias/${id}`);
  const payload = { ...existing, ...updatedData };
  const { data } = await API.patch(`/Membresias/${id}`, payload);
  return data;
};

export const deletePlan = async (id) => {
  const { data } = await API.delete(`/Planes/${id}`);
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
  const { data } = await API.get("/Clases", { 
    params: { 
      sucursalId, 
      ...params
    } 
  });
  return data;
};

export const getClaseById = async (id) => {
  const { data } = await API.get(`/Clases/${id}`);
  return data;
};

export const createClase = async (claseData) => {
  const { data } = await API.post("/Clases", claseData);
  return data;
};

export const updateClase = async (id, updatedData) => {
  const { data: existingClase } = await API.get(`/Clases/${id}`);
  const payload = { ...existingClase, ...updatedData };
  const { data } = await API.patch(`/Clases/${id}`, payload);
  return data;
};

export const deleteClase = async (id) => {
  const { data } = await API.delete(`/Clases/${id}`);
  return data;
};

export const getClaseCupo = async (claseId) => {
  const [{ data: clase }, { data: reservas }] = await Promise.all([
    API.get(`/Clases/${claseId}`),
    API.get("/Reservas", { params: { claseId, estado: "confirmada" } }),
  ]);
  return {
    cupoMaximo: clase.cupoMaximo,
    reservasActuales: reservas?.length || 0,
  };
};

export const getReservasByAlumno = async (alumnoId) => {
  const { data } = await API.get("/Reservas", { params: { alumnoId } });
  return data;
};

export const getReservasByClase = async (claseId, params = {}) => {
  const { data } = await API.get("/Reservas", {
    params: { claseId, ...params },
  });
  return data;
};

export const createReserva = async (reservaData) => {
  const { data } = await API.post("/Reservas", reservaData);
  return data;
};

export const updateReserva = async (id, updatedData) => {
  const { data: existing } = await API.get(`/Reservas/${id}`);
  const payload = { ...existing, ...updatedData };
  const { data } = await API.patch(`/Reservas/${id}`, payload);
  return data;
};

export const deleteReserva = async (id) => {
  const { data } = await API.delete(`/Reservas/${id}`);
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
  const { data } = await API.get("/Usuarios", { params: { sucursalId } });
  return data;
};

export const assignAdminToSucursal = async (userId, sucursalId) => {
  const { data } = await API.post(`/Usuarios/${userId}/assign-admin`, {
    sucursalId,
  });
  return data;
};

/* ==========================
Export Axios Instance
========================== */
export { API };
