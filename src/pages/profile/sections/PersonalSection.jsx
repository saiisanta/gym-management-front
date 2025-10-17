import React, { useState, useContext } from "react";
import { FaEdit, FaSave, FaImage } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import { updateUserProfile } from "../../../services/api";
import { mapRoleIdToRole } from "../../../utils/RoleMapper";
import "../../../styles/pages/profile/personalSection.css";

const PersonalSection = () => {
  const { user, setUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.lastname || "",
    email: user?.email || "",
    telNumber: user?.telNumber || "",
    image: user?.image || "https://placehold.co/120x120?text=User",
  });

  const roleId = user?.roleId ?? 4;
  const role = mapRoleIdToRole(roleId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedData = {
        nombre: userData.nombre,
        lastname: userData.apellido,
        email: userData.email,
        telNumber: userData.telNumber,
        image: userData.image,
      };

      const response = await updateUserProfile(user.id, updatedData);

      const updatedUser = {
        ...user,
        ...response,
        roleId: user.roleId,
        role: mapRoleIdToRole(user.roleId),
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      alert("No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="personal-section">
      <h2 className="personal-section-title">Datos Personales</h2>

      <div className="personal-section-card">
        <div className="personal-image">
          <img
            src={userData.image}
            alt="perfil"
            className="personal-avatar"
          />
          <button className="personal-upload-btn">
            <FaImage /> Cambiar foto
          </button>
        </div>

        <div className="personal-info">
          <label className="personal-label">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={userData.nombre}
            disabled={!isEditing}
            onChange={handleChange}
            className={`personal-input ${!isEditing ? "bloqueado" : ""}`}
          />

          <label className="personal-label">Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={userData.apellido}
            disabled={!isEditing}
            onChange={handleChange}
            className={`personal-input ${!isEditing ? "bloqueado" : ""}`}
          />

          <label className="personal-label">Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            disabled={!isEditing}
            onChange={handleChange}
            className={`personal-input ${!isEditing ? "bloqueado" : ""}`}
          />

          <label className="personal-label">Teléfono:</label>
          <input
            type="text"
            name="telNumber"
            value={userData.telNumber}
            disabled={!isEditing}
            onChange={handleChange}
            className={`personal-input ${!isEditing ? "bloqueado" : ""}`}
          />

          <label className="personal-label">Rol:</label>
          <input
            type="text"
            value={role}
            disabled
            className="personal-input bloqueado"
          />

          <div className="personal-actions">
            <button
              className="personal-btn"
              disabled={saving}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {saving ? (
                "Guardando..."
              ) : isEditing ? (
                <>
                  <FaSave /> Guardar
                </>
              ) : (
                <>
                  <FaEdit /> Editar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSection;
