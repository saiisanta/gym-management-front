import React, { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    const loggedUser = {
      id: data.userId,
      token: data.token,
      role: data.role,
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

  const register = async (userData) => {
    const newUser = await registerUser(userData);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
