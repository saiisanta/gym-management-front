import React, { useState, useContext } from "react";
import { FaEdit, FaSave, FaImage } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import rolesData from "../../../mock/db.json";
import "../../../styles/pages/profile/personalSection.css"

const PersonalSection = () => {
  const { user } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.lastname || "",
    email: user?.email || "",
    telNumber: user?.telNumber || "",
    image: user?.image || "https://placehold.co/120x120?text=User    ",
  });

  const roleName =
    rolesData.roles.find((r) => r.id === user?.role)?.nombre || "Desconocido";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // aca podemos guardar los datos editados cuando tengamos api
  };

  return (
    <div className="personal-data">
      <h2>Datos Personales</h2>

      <div className="personal-card">
        <div className="image-section">
          <img src={userData.image} alt="perfil" />
          <button className="upload-btn">
            <FaImage /> Cambiar foto
          </button>
        </div>

        <div className="info-section">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={userData.nombre}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <label>Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={userData.apellido}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <label>Teléfono:</label>
          <input
            type="text"
            name="telNumber"
            value={userData.telNumber}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <label>Rol:</label>
          <input type="text" value={roleName} disabled />

          <button
            className="edit-btn"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? <FaSave /> : <FaEdit />}{" "}
            {isEditing ? "Guardar" : "Editar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalSection;
