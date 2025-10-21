import React, { useState, useContext, useEffect } from "react";
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
    nombre: "",
    apellido: "",
    email: "",
    telNumber: "",
    dni: "",
    genero: "",
    fechaNacimiento: "",
    direccion: "",
    estado: "",
    plan: "",
    sucursalId: "",
    image: "https://placehold.co/120x120?text=User",
  });

  // 🔹 Sincronizar userData con user cada vez que cambie
  useEffect(() => {
    if (user) {
      setUserData({
        nombre: user.nombre || "",
        apellido: user.lastname || "",
        email: user.email || "",
        telNumber: user.telNumber || "",
        dni: user.dni || "",
        genero: user.genero || "",
        fechaNacimiento: user.fechaNacimiento || "",
        direccion: user.direccion || "",
        estado: user.estado || "",
        plan: user.plan || "",
        sucursalId: user.sucursalId || "",
        image: user.image || "https://placehold.co/120x120?text=User",
      });
    }
  }, [user]);

  const role = mapRoleIdToRole(user?.roleId ?? 4);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // 🔹 Guardamos todos los campos editables
      const updatedData = {
        nombre: userData.nombre,
        lastname: userData.apellido,
        email: userData.email,
        telNumber: userData.telNumber,
        dni: userData.dni,
        genero: userData.genero,
        fechaNacimiento: userData.fechaNacimiento,
        direccion: userData.direccion,
        plan: userData.plan,
        sucursalId: userData.sucursalId,
        image: userData.image,
      };

      // 🔹 Actualizamos en la API
      const response = await updateUserProfile(user.id, updatedData);

      // 🔹 Actualizamos solo AuthContext
      setUser(response);
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
        {/* Imagen de perfil */}
        <div className="personal-image">
          <img src={userData.image} alt="perfil" className="personal-avatar" />
          <button className="personal-upload-btn" disabled={!isEditing}>
            <FaImage /> Cambiar foto
          </button>
        </div>

        <div className="personal-info">
          {[
            { label: "Nombre", name: "nombre", type: "text" },
            { label: "Apellido", name: "apellido", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Teléfono", name: "telNumber", type: "text" },
            { label: "DNI", name: "dni", type: "text" },
            { label: "Género", name: "genero", type: "text" },
            { label: "Fecha de nacimiento", name: "fechaNacimiento", type: "date" },
            { label: "Dirección", name: "direccion", type: "text" },
          ].map((field) => (
            <React.Fragment key={field.name}>
              <label className="personal-label">{field.label}:</label>
              <input
                type={field.type}
                name={field.name}
                value={userData[field.name]}
                disabled={!isEditing}
                onChange={handleChange}
                className={`personal-input ${!isEditing ? "bloqueado" : ""}`}
              />
            </React.Fragment>
          ))}

          {/* Campos no editables */}
          <label className="personal-label">Estado:</label>
          <input type="text" value={userData.estado} disabled className="personal-input bloqueado" />

          <label className="personal-label">Plan actual:</label>
          <input type="text" value={userData.plan || "Sin plan asignado"} disabled className="personal-input bloqueado" />

          <label className="personal-label">Sucursal:</label>
          <input type="text" value={userData.sucursalId || "No asignada"} disabled className="personal-input bloqueado" />

          <label className="personal-label">Rol:</label>
          <input type="text" value={role} disabled className="personal-input bloqueado" />

          {/* Botón de acción */}
          <div className="personal-actions">
            <button
              className="personal-btn"
              disabled={saving}
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {saving ? "Guardando..." : isEditing ? <><FaSave /> Guardar</> : <><FaEdit /> Editar</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSection;
