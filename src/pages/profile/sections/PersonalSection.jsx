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
  apellido: "", // Propiedad de estado correcta
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

 useEffect(() => {
  const cleanDate = (dateString) => {
   return dateString && dateString.includes("T")
    ? dateString.substring(0, 10)
    : dateString || "";
  };
  if (user) {
   setUserData({
    // Lectura robusta de propiedades (PascalCase o camelCase)
    nombre: user.Nombre || user.nombre || "",
    // FIX: Aseguramos que se mapee a 'apellido' usando las posibles propiedades de entrada
    apellido: user.Apellido || user.apellido || "",
    email: user.Email || user.email || "",
    telNumber: user.TelNumber || user.telNumber || "",
    dni: user.Dni || user.dni || "",
    genero: user.Genero || user.genero || "",
    fechaNacimiento: cleanDate(
     user.FechaNacimiento || user.fechaNacimiento
    ),
    direccion: user.Direccion || user.direccion || "",
    estado: user.Estado || user.estado || "",
    plan: user.PlanId || user.Plan || user.plan || "",
    sucursalId: user.SucursalId || user.sucursalId || "",
    image:
     user.Image || user.image || "https://placehold.co/120x120?text=User",
   });
  }
 }, [user]);

 const role = mapRoleIdToRole(user?.roleId ?? 4);

 const planName = mapPlanIdToName(userData.plan);

 const handleChange = (e) => {
  const { name, value } = e.target;
  setUserData((prev) => ({ ...prev, [name]: value }));
 };

 const handleSave = async () => {
  try {
   setSaving(true);

   // La limpieza de la fecha a formato ISO 8601 (YYYY-MM-DD) debe realizarse aquí
   // antes de construir el objeto updatedData, si no se hace automáticamente.
   let fechaFormateada = userData.fechaNacimiento;
   if (fechaFormateada && fechaFormateada.includes("T")) {
    fechaFormateada = fechaFormateada.substring(0, 10);
   }
   
   // 1. Construir el objeto con todos los campos (incluyendo los que pueden estar vacíos)
   const updatedData = {
    Nombre: userData.nombre,
    Apellido: userData.apellido,
    Email: userData.email,
    Telefono: userData.telNumber,
    Dni: userData.dni,
    Genero: userData.genero,
    FechaNacimiento: fechaFormateada,
    Direccion: userData.direccion,
    PlanId: userData.plan,
    SucursalId: userData.sucursalId,
    Image: userData.image,
   };

   // 2. Definir campos que pueden ser omitidos si están vacíos.
   // Nota: 'Nombre', 'Apellido', 'Email' probablemente son obligatorios y no deberían estar aquí.
   const optionalFields = [
    "PlanId",
    "SucursalId",
    "Dni",
    "Telefono",
    "Genero",
    "Direccion",
    "FechaNacimiento", // Se añade aquí para ser eliminado si está vacío
    "Image",
   ];

   // 3. Filtrar solo los campos opcionales si son cadenas vacías, nulos o indefinidos.
   optionalFields.forEach((key) => {
    // Usamos una verificación explícita para cadenas vacías, null o undefined
    const value = updatedData[key];
    if (
     value === "" || 
     value === null || 
     value === undefined ||
          // También se considera eliminar si el valor es "Sin Plan"
          value === "Sin Plan" 
    ) {
     delete updatedData[key];
    }
   });
      
      // 4. (Potencial solución adicional) Iteramos sobre todos los campos y eliminamos aquellos que no tienen valor
      // y que NO son Nombre, Apellido o Email. Esto es más seguro si solo quieres actualizar datos y evitar enviar valores vacíos.
      const finalData = {};
      for (const key in updatedData) {
          const value = updatedData[key];
          // Asumimos que Nombre, Apellido y Email deben enviarse (aunque estén vacíos si el backend lo permite)
          // Pero eliminamos cualquier otra propiedad que esté vacía.
          if (key === 'Nombre' || key === 'Apellido' || key === 'Email') {
              // Si estos campos son obligatorios, deben enviarse
              finalData[key] = value;
          } else if (value !== "" && value !== null && value !== undefined) {
              // Solo incluimos otros campos si tienen un valor real
              finalData[key] = value;
          }
      }


   const updatedUser = await updateUsuario(user.id, finalData); // Usamos finalData

   setUser(updatedUser);
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
      {
       label: "Fecha de nacimiento",
       name: "fechaNacimiento",
       type: "date",
      },
      { label: "Dirección", name: "direccion", type: "text" },
     ].map((field) => (
      <React.Fragment key={field.name}>
       <label className="personal-label">{field.label}:</label>
       <input
        type={field.type}
        name={field.name}
        value={userData[field.name] || ''}
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
      value={planName}
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