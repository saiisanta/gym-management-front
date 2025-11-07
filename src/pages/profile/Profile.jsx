import React, { useState, useContext, useEffect } from "react";
import "../../styles/pages/profile/profile.css";
import {
  FaUser,
  FaDumbbell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";

import PersonalSection from "./sections/PersonalSection";
import PlanSection from "./sections/PlanSection";
import SettingsSection from "./sections/SettingsSection";

const Profile = () => {

  const { showLoading, hideLoading} = useLoading();
  const [activeSection, setActiveSection] = useState("personal");
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
            onClick={() => handleNavigate("/dashboard")}
          >
          Volver
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