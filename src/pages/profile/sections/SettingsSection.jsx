import React, { useState } from "react";
import { FaBell, FaLock, FaEnvelope, FaMobileAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Form, Button } from "react-bootstrap";
import "../../../styles/pages/profile/settingsSection.css";

// ===================================
// Subcomponente 1: Notificaciones
// ===================================
const NotificationSettings = () => {
  return (
    <div className="setting-content-panel">
      <h4 className="panel-title">Preferencias de Notificación</h4>
      
      {/* Switch 1: Notificación por Email */}
      <div className="switch-item">
        <FaEnvelope className="switch-icon" />
        <span className="switch-label">Notificación por Email</span>
        <Form.Check 
          type="switch"
          id="email-switch"
          label=""
          defaultChecked 
        />
      </div>

      {/* Switch 2: Notificación por Celular (SMS/App) */}
      <div className="switch-item">
        <FaMobileAlt className="switch-icon" />
        <span className="switch-label">Notificación por Celular (SMS)</span>
        <Form.Check 
          type="switch"
          id="mobile-switch"
          label=""
          defaultChecked={false}
        />
      </div>

    </div>
  );
};

// ===================================
// Subcomponente 2: Cambiar Contraseña
// ===================================
const ChangePasswordForm = () => {
  return (
    <div className="setting-content-panel">
      <h4 className="panel-title">Actualizar Contraseña</h4>
      <Form className="password-form-grid">
        <Form.Group controlId="currentPassword">
          <Form.Control 
            type="password" 
            placeholder="Contraseña Actual" 
            className="input-custom" 
          />
        </Form.Group>
        
        <Form.Group controlId="newPassword">
          <Form.Control 
            type="password" 
            placeholder="Nueva Contraseña" 
            className="input-custom" 
          />
        </Form.Group>
        
        <Form.Group controlId="confirmNewPassword">
          <Form.Control 
            type="password" 
            placeholder="Confirmar Nueva Contraseña" 
            className="input-custom" 
          />
        </Form.Group>

        <Button 
          variant="primary" 
          className="btn-custom-save"
        >
          Guardar Contraseña
        </Button>
      </Form>
    </div>
  );
};


// ===================================
// Componente Principal
// ===================================
const SettingsSection = () => {
  const [activeSetting, setActiveSetting] = useState(null);

  const toggleSetting = (settingName) => {
    setActiveSetting(activeSetting === settingName ? null : settingName);
  };

  const isNotificationsActive = activeSetting === 'notifications';
  const isPasswordActive = activeSetting === 'password';

  return (
    <div className="settings-section">
      <h2>Configuración</h2>
      
      <div className="setting-item-wrapper">
        <div 
          className={`setting-item ${isNotificationsActive ? 'open' : ''}`}
          onClick={() => toggleSetting('notifications')}
        >
          <FaBell />
          <span>Notificaciones activadas</span>
          {isNotificationsActive ? <FaChevronUp className="toggle-icon" /> : <FaChevronDown className="toggle-icon" />}
        </div>
        
        <div className={`content-accordion ${isNotificationsActive ? 'expanded' : ''}`}>
          <div className="content-inner">
            <NotificationSettings />
          </div>
        </div>
      </div>

      <div className="setting-item-wrapper">
        <div 
          className={`setting-item ${isPasswordActive ? 'open' : ''}`}
          onClick={() => toggleSetting('password')}
        >
          <FaLock />
          <span>Cambiar contraseña</span>
          {isPasswordActive ? <FaChevronUp className="toggle-icon" /> : <FaChevronDown className="toggle-icon" />}
        </div>
        
        <div className={`content-accordion ${isPasswordActive ? 'expanded' : ''}`}>
          <div className="content-inner">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;