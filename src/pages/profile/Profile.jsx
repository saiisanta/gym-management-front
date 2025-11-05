import React, { useState, useContext, useEffect } from "react";
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
  // 🚨 Corregida la importación de useEffect arriba
  const { showLoading, hideLoading} = useLoading();
  const [activeSection, setActiveSection] = useState("personal");
  // Extraemos 'loading' de AuthContext para manejar el estado de carga inicial del usuario
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🚨 Lógica de Integración del LoadingContext (Carga Inicial) 🚨
  useEffect(() => {
    if (loading) {
      // Muestra el spinner global mientras se verifica la sesión
      showLoading();
    } else {
      // Oculta el spinner una vez que la verificación de sesión termina (éxito o fallo)
      hideLoading();
    }
    // Limpieza: Asegura que el spinner se oculte si el componente se desmonta
    return () => {
      hideLoading();
    };
  }, [loading, showLoading, hideLoading]);

  // Función de navegación simplificada para que el componente de destino maneje hideLoading()
  const handleNavigate = (path) => {
    showLoading();
    // Quitamos el setTimeout y hideLoading() para que el componente de destino (por ejemplo, Home) 
    // sea el que oculte el loader al terminar su propia carga.
    navigate(path);
  };

  // La redirección debe esperar a que el 'loading' de AuthContext sea falso
  if (loading) {
    // Devolvemos null mientras el loader global está activo
    return null; 
  }
  
  // Redirección si el usuario no está autenticado después de cargar
  if (!user) {
    // Usamos navigate sin showLoading/hideLoading para evitar un bucle visual
    // El navbar o la ruta de login manejarán su propia carga si es necesario.
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
              // Usamos handleNavigate para que el loader se active antes de ir a /login
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