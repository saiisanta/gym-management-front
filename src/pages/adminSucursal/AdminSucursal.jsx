import React, { useState, useContext, useEffect } from "react";
import "../../styles/pages/profile/profile.css";
import {
  FaCalendarAlt,
  FaUsers,
  FaChalkboardTeacher,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";
import { mapRoleIdToRole } from "../../utils/RoleMapper";

import ClasesSection from "./sections/ClasesSection";
import UsuariosSucursalSection from "./sections/UsuariosSucursalSection";
import ProfesoresSection from "./sections/ProfesoresSection";

const AdminSucursal = () => {
  const { showLoading, hideLoading } = useLoading();
  const [activeSection, setActiveSection] = useState("clases");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const userRole =
      typeof user.role === "string"
        ? user.role
        : mapRoleIdToRole(user.roleId || 4);

    
    if (userRole !== "adminSucursal" && userRole !== "superadmin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleNavigate = (path) => {
    showLoading();
    setTimeout(() => {
      navigate(path);
      hideLoading();
    }, 500);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "clases":
        return <ClasesSection  sucursalId={user.sucursalId} />;
      case "usuarios":
        return <UsuariosSucursalSection />;
      case "profesores":
        return <ProfesoresSection />;
      default:
        return <ClasesSection />;
    }
  };

  if (!user) {
    return <div className="loading">Cargando panel...</div>;
  }

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <h2 className="profile-title">Panel Sucursal</h2>
        <ul className="profile-menu">
          <li
            className={activeSection === "clases" ? "active" : ""}
            onClick={() => setActiveSection("clases")}
          >
            <FaCalendarAlt /> Clases
          </li>
          <li
            className={activeSection === "usuarios" ? "active" : ""}
            onClick={() => setActiveSection("usuarios")}
          >
            <FaUsers /> Usuarios
          </li>
          <li
            className={activeSection === "profesores" ? "active" : ""}
            onClick={() => setActiveSection("profesores")}
          >
            <FaChalkboardTeacher /> Profesores
          </li>
        </ul>

        <div className="profile-bottom-buttons">
          <button
            className="sidebar-btn back-home"
            onClick={() => handleNavigate("/")}
          >
            <FaHome /> Volver
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

export default AdminSucursal;
