import React, { useState } from "react";
import "../../../styles/pages/adminSucursal/profesoresSection.css";
import { useProfesores } from "../../../hooks/useApi";

const ProfesoresSection = ({ sucursalId }) => {
 const {
  profesores,
  loading: loadingProfesores,
  addProfesor,
  editProfesor,
  removeProfesor,
 } = useProfesores(sucursalId);

 const [nuevoProfesor, setNuevoProfesor] = useState({
  nombre: "",
  apellido: "",
  dni: "", 
  email: "", 
  telefono: "",
  especialidad: "",
 });
 const [editingId, setEditingId] = useState(null);
 const [error, setError] = useState(null);
 const [loading, setLoading] = useState(false);

 const handleChange = (e) => {
  const { name, value } = e.target;
  setNuevoProfesor((prev) => ({ ...prev, [name]: value }));
 };

 const handleEditar = (profesor) => {
  setNuevoProfesor({
   nombre: profesor.nombre || "",
   apellido: profesor.apellido || "",
   dni: profesor.dni || "", 
   email: profesor.email || "", 
   telefono: profesor.telefono || "",
   especialidad: profesor.especialidad || "",
  });
  setEditingId(profesor.id);
  setError(null);
  window.scrollTo({ top: 0, behavior: "smooth" });
 };

 const handleCancelar = () => {
  setNuevoProfesor({
   nombre: "",
   apellido: "",
   dni: "",
   email: "",
   telefono: "",
   especialidad: "",
  });
  setEditingId(null);
  setError(null);
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (
   !nuevoProfesor.nombre ||
   !nuevoProfesor.apellido ||
   !nuevoProfesor.email ||
   !nuevoProfesor.dni
  ) {
   setError("Nombre, apellido, DNI y Email son obligatorios.");
   return;
  }

  setLoading(true);
  try {
   const payload = { ...nuevoProfesor, sucursalId };

   if (editingId) {
    await editProfesor(editingId, payload);
    setEditingId(null);
   } else {
    await addProfesor(payload);
   }

   // Resetear formulario
   setNuevoProfesor({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    telefono: "",
    especialidad: "",
   });
  } catch (err) {
   console.error(err);
   setError(
    err.message || "Error al guardar el profesor. Verifique el DNI/Email."
   );
  } finally {
   setLoading(false);
  }
 };

 const handleEliminar = async (id) => {
  if (
   !window.confirm(
    "¿Seguro que deseas eliminar este profesor? (Se desactivará)"
   )
  )
   return;
  try {
   await removeProfesor(id);
  } catch (err) {
   console.error(err);
   setError("No se pudo eliminar el profesor.");
  }
 };

 if (loadingProfesores) return <p>Cargando profesores...</p>;

 return (
  <section className="profesor-section">
   <h2 className="profesor-section-title">
    {editingId ? "Modificar Profesor" : "Agregar Nuevo Profesor"}
   </h2>

   {error && <p className="clases-error-message">{error}</p>}

   {/* Usamos la clase profesor-form */}
   <form className="profesor-form" onSubmit={handleSubmit}>
    <input
     className="profesor-input"
     type="text"
     name="nombre"
     placeholder="Nombre"
     value={nuevoProfesor.nombre}
     onChange={handleChange}
    />
    <input
     className="profesor-input"
     type="text"
     name="apellido"
     placeholder="Apellido"
     value={nuevoProfesor.apellido}
     onChange={handleChange}
    />
    <input
     className="profesor-input"
     type="text"
     name="dni" 
     placeholder="DNI (Obligatorio)"
     value={nuevoProfesor.dni}
     onChange={handleChange}
    />
    <input
     className="profesor-input"
     type="email"
     name="email" 
     placeholder="Email (Obligatorio)"
     value={nuevoProfesor.email}
     onChange={handleChange}
    />
    <input
     className="profesor-input"
     type="text"
     name="telefono"
     placeholder="Teléfono"
     value={nuevoProfesor.telefono}
     onChange={handleChange}
    />
    <input
     className="profesor-input"
     type="text"
     name="especialidad"
     placeholder="Especialidad"
     value={nuevoProfesor.especialidad}
     onChange={handleChange}
    />

    {/* Usamos la clase profesor-form-buttons */}
    <div className="profesor-form-buttons">
     <button type="submit" disabled={loading} className={editingId ? "" : "full-width-btn"}>
      {editingId ? "Guardar Cambios" : "Agregar Profesor"}
     </button>
     {editingId && (
      <button
       type="button"
       className="btn-eliminar btn-cancelar"
       onClick={handleCancelar}
      >
       Cancelar
      </button>
     )}
    </div>
   </form>
   
   <h3 className="profesor-subtitulo">Profesores existentes</h3>
   {/* Usamos la clase profesor-list-wrapper */}
   <div className="profesor-list-wrapper">
    {/* Usamos la clase profesor-list */}
    <div className="profesor-list">
     {profesores.length === 0 ? (
      <p>No hay profesores en esta sucursal.</p>
     ) : (
      <ul>
       {profesores.map((p) => (
        <li key={p.id} className="profesor-item"> 
         <div className="profesor-list-info">
          <strong>{p.nombre} {p.apellido}</strong>
         </div>

         <div className="profesor-list-info">DNI: {p.dni || "-"}</div>

         <div className="profesor-list-info">Email: {p.email || "-"}</div>

         <div className="profesor-list-info">Tel: {p.telefono || "-"}</div>
         <div className="profesor-list-info">Especialidad: {p.especialidad || "-"}</div>
         <div className="profesor-actions">
          <button onClick={() => handleEditar(p)}>Editar</button>
          <button
           className="btn-eliminar"
           onClick={() => handleEliminar(p.id)}
          >
           Eliminar
          </button>
         </div>
        </li>
       ))}
      </ul>
     )}
    </div>
   </div>
  </section>
 );
};

export default ProfesoresSection;