import React, { useState, useContext, useEffect } from "react";
import { FaEdit, FaSave, FaImage } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import { useUsuarios } from "../../../hooks/useApi/useUsuarios";
import { mapRoleIdToRole } from "../../../utils/RoleMapper";
import { mapPlanIdToName } from "../../../utils/PlanMapper";
import "../../../styles/pages/profile/personalSection.css";

const PersonalSection = () => {
  const { user, setUser } = useContext(AuthContext);
  const { updateUsuario } = useUsuarios(false);

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
    planId: null,
    planName: "Sin plan",
    sucursalId: "",
    image: "https://placehold.co/120x120?text=User",
  });

  useEffect(() => {
    const cleanDate = (dateString) =>
      dateString && dateString.includes("T")
        ? dateString.substring(0, 10)
        : dateString || "";

    if (user) {
      setUserData({
        nombre: user.Nombre || user.nombre || "",
        apellido: user.Apellido || user.apellido || "",
        email: user.Email || user.email || "",
        telNumber: user.TelNumber || user.telNumber || "",
        dni: user.Dni || user.dni || "",
        genero: user.Genero || user.genero || "",
        fechaNacimiento: cleanDate(user.FechaNacimiento || user.fechaNacimiento),
        direccion: user.Direccion || user.direccion || "",
        estado: user.Estado || user.estado || "",
        planId: user.PlanId ? Number(user.PlanId) : null,
        planName:
          user.planName ??
          user.plan ??
          (user.PlanId ? mapPlanIdToName(Number(user.PlanId)) : "Sin plan"),
        sucursalId: user.SucursalId || user.sucursalId || "",
        image: user.Image || user.image || "https://placehold.co/120x120?text=User",
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

      let fechaFormateada = userData.fechaNacimiento;
      if (fechaFormateada?.includes("T")) {
        fechaFormateada = fechaFormateada.substring(0, 10);
      }

      const safePlanId =
        userData.planId !== null &&
        userData.planId !== "" &&
        Number.isFinite(Number(userData.planId))
          ? Number(userData.planId)
          : undefined;

      const updatedData = {
        Nombre: userData.nombre,
        Apellido: userData.apellido,
        Email: userData.email,
        Telefono: userData.telNumber,
        Dni: userData.dni,
        Genero: userData.genero,
        FechaNacimiento: fechaFormateada,
        Direccion: userData.direccion,
        SucursalId: userData.sucursalId,
        Image: userData.image,
      };

      if (safePlanId !== undefined) updatedData.PlanId = safePlanId;

      const finalData = {};
      for (const key in updatedData) {
        const value = updatedData[key];
        if (
          key === "Nombre" ||
          key === "Apellido" ||
          key === "Email" ||
          (value !== "" && value !== null && value !== undefined)
        ) {
          finalData[key] = value;
        }
      }

      const updatedUser = await updateUsuario(user.id, finalData);

      if (updatedUser && typeof updatedUser === "object") {
        const normalizedForAuth = {
          ...updatedUser,
          nombre: updatedUser.nombre ?? updatedUser.Nombre ?? "",
          apellido: updatedUser.apellido ?? updatedUser.Apellido ?? "",
          email: updatedUser.email ?? updatedUser.Email ?? "",
          telNumber: updatedUser.telNumber ?? updatedUser.Telefono ?? "",
          dni: updatedUser.dni ?? updatedUser.Dni ?? "",
          genero: updatedUser.genero ?? updatedUser.Genero ?? "",
          fechaNacimiento:
            updatedUser.fechaNacimiento ?? updatedUser.FechaNacimiento ?? "",
          direccion: updatedUser.direccion ?? updatedUser.Direccion ?? "",
          estado: updatedUser.estado ?? updatedUser.Estado ?? "",
          planId: updatedUser.PlanId ?? null,
          planName:
            updatedUser.planName ??
            updatedUser.plan ??
            (updatedUser.PlanId ? mapPlanIdToName(Number(updatedUser.PlanId)) : "Sin plan"),
          sucursalId: updatedUser.sucursalId ?? updatedUser.SucursalId ?? null,
          image: updatedUser.image ?? updatedUser.Image ?? null,
          role: updatedUser.role ?? updatedUser.Role ?? "",
          roleId: updatedUser.roleId ?? updatedUser.RoleId ?? null,
          id: updatedUser.id ?? updatedUser.Id ?? null,
        };

        setUser(normalizedForAuth);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="personal-section">
      <h2 className="personal-section-title">Datos Personales</h2>

      <div className="personal-section-card">
        <div className="personal-image">
          <img src={userData.image} alt="perfil" className="personal-avatar" />

          <button className="personal-upload-btn" disabled={!isEditing}>
            <FaImage /> Cambiar foto
          </button>

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
                value={userData[field.name] || ""}
                disabled={!isEditing}
                onChange={handleChange}
                className={`personal-input ${!isEditing ? "bloqueado" : ""}`}
              />
            </React.Fragment>
          ))}

          <label className="personal-label">Estado:</label>
          <input
            type="text"
            value={userData.estado}
            disabled
            className="personal-input bloqueado"
          />

          <label className="personal-label">Plan actual:</label>
          <input
            type="text"
            value={userData.planName || "Sin plan"}
            disabled
            className="personal-input bloqueado"
          />

          <label className="personal-label">Sucursal:</label>
          <input
            type="text"
            value={userData.sucursalId || "No asignada"}
            disabled
            className="personal-input bloqueado"
          />

          <label className="personal-label">Rol:</label>
          <input
            type="text"
            value={role}
            disabled
            className="personal-input bloqueado"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalSection;
