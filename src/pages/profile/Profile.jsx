// src/pages/profile/Profile.jsx
import React, { useState, useContext } from "react";
import "../../styles/pages/profile/profile.css";
import {
  FaUser,
  FaDumbbell,
  FaCog,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";

import PersonalSection from "./sections/PersonalSection";
import PlanSection from "./sections/PlanSection";
import SettingsSection from "./sections/SettingsSection";

const Profile = () => {
  const { showLoading, hideLoading } = useLoading();
  const [activeSection, setActiveSection] = useState("personal");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    showLoading();
    setTimeout(() => {
      navigate(path);
      hideLoading();
    }, 500);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "personal":
        return <PersonalSection />;
      case "plan":
        return <PlanSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <PersonalSection />;
    }
  };

  return (
    <div className="profile-page">
      {/* Sidebar izquierda */}
      <aside className="profile-sidebar">
        <h2 className="profile-title">Mi Perfil</h2>
        <ul className="profile-menu">
          <li
            className={activeSection === "personal" ? "active" : ""}
            onClick={() => setActiveSection("personal")}
          >
            <FaUser /> Datos personales
          </li>
          <li
            className={activeSection === "plan" ? "active" : ""}
            onClick={() => setActiveSection("plan")}
          >
            <FaDumbbell /> Mi plan
          </li>
          <li
            className={activeSection === "settings" ? "active" : ""}
            onClick={() => setActiveSection("settings")}
          >
            <FaCog /> Configuración
          </li>
        </ul>

        {/* Botones inferiores */}
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

      {/* Contenido derecho */}
      <main className="profile-content">{renderSection()}</main>
    </div>
  );
};

export default Profile;
