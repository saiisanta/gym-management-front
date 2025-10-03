import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
});

// Agregar token automáticamente en cada request
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

// ----- AUTH -----
export const loginUser = async (email, password) => {
  const { data } = await API.post("/Auth/login", { email, password });
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await API.post("/Auth/register", userData);
  return data;
};

// ----- PROFILE -----
export const getUserProfile = async (id) => {
  const { data } = await API.get(`/Users/${id}`);
  return data;
};
