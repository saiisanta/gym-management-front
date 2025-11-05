import React, { useState, useContext, useEffect } from "react";
import "../../styles/pages/profile/profile.css";
import {
  FaUsers,
  FaBuilding,
  FaExchangeAlt,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";

import UsuariosSection from "./sections/UsuariosSection";
import SucursalesSection from "./sections/SucursalesSection";
import CrearAdminSection from "./sections/CrearAdminSection";

const SuperAdmin = () => {
  const { showLoading, hideLoading } = useLoading();
  const [activeSection, setActiveSection] = useState("usuarios");
  const { user, logout, loading } = useContext(AuthContext); 
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      showLoading();
    } else {
      hideLoading();
    }
    return () => {
      hideLoading();
    };
  }, [loading, showLoading, hideLoading]);

  const handleNavigate = (path) => {
    showLoading();
    navigate(path);
  };


  if (loading) {
    return null;
  }
  
  if (!user || user.roleId !== 1) {
    navigate("/login");
    return null;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "usuarios":
        return <UsuariosSection />;
      case "sucursales":
        return <SucursalesSection />;
      case "CrearAdminSection": 
        return <CrearAdminSection />;
      default:
        return <UsuariosSection />;
    }
  };

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <h2 className="profile-title">Panel SuperAdmin</h2>
        <ul className="profile-menu">
          <li
            className={activeSection === "usuarios" ? "active" : ""}
            onClick={() => setActiveSection("usuarios")}
          >
            <FaUsers /> Gestionar Usuarios
          </li>
          <li
            className={activeSection === "sucursales" ? "active" : ""}
            onClick={() => setActiveSection("sucursales")}
          >
            <FaBuilding /> Gestionar Sucursales
          </li>
          <li
            className={activeSection === "CrearAdminSection" ? "active" : ""}
            onClick={() => setActiveSection("CrearAdminSection")}
          >
            <FaExchangeAlt /> Designar Admins
          </li>
        </ul>

        <div className="profile-bottom-buttons">
          <button
            className="sidebar-btn back-home"
            onClick={() => handleNavigate("/")}
          >
            <FaHome /> Volver al inicio
          </button>
          <button
            className="sidebar-btn logout"
            onClick={() => {
              logout();
              handleNavigate("/login");
            }}
          >
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="profile-content">{renderSection()}</main>
    </div>
  );
};

export default SuperAdmin;