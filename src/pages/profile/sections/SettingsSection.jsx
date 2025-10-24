import React from "react";
import { FaBell, FaLock } from "react-icons/fa";
import "../../../styles/pages/profile/settingsSection.css"

const SettingsSection = () => {
  return (
    <div className="settings-section">
      <h2>Configuración</h2>
      <div className="setting-item">
        <FaBell />
        <span>Notificaciones activadas</span>
      </div>
      <div className="setting-item">
        <FaLock />
        <span>Cambiar contraseña</span>
      </div>
    </div>
  );
};

export default SettingsSection;
