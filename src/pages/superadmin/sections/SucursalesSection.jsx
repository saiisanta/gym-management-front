import React, { useState } from "react";
import { useSucursales } from "../../../hooks/useApi/useSucursales";
import SalasModal from "../../../components/SalasModal/SalasModal"; // Importar el nuevo Modal
import "../../../styles/pages/superadmin/sucursalesSection.css";

const SucursalesSection = () => {
 const {
  sucursales,
  loading,
  createNewSucursal,
  updateExistingSucursal,
  deleteExistingSucursal,
 } = useSucursales();

 const [form, setForm] = useState({
  nombre: "",
  direccion: "",
  email: "",
  telefono: "",
  // ELIMINADO: 'salas: 1' se quita del estado inicial
 });
 const [editingId, setEditingId] = useState(null);
  
  // ESTADO PARA EL MODAL DE SALAS
  const [modalSucursal, setModalSucursal] = useState(null); // { id, nombre }

 const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  // VALIDACIÓN SIN EL CAMPO SALAS
  if (!form.nombre || !form.direccion || !form.email) return;

  // PAYLOAD SIN EL CAMPO SALAS
  const payload = { ...form }; 
  if (editingId) {
   await updateExistingSucursal(editingId, payload);
   setEditingId(null);
  } else {
   await createNewSucursal(payload);
  }

  // LIMPIAR FORMULARIO SIN EL CAMPO SALAS
  setForm({ nombre: "", direccion: "", email: "", telefono: "" });
 };

 const handleEditar = (sucursal) => {
  setForm({
   nombre: sucursal.nombre,
   direccion: sucursal.direccion,
   email: sucursal.email,
   telefono: sucursal.telefono || "",
   // ELIMINADO: No se carga 'salas'
  });
  setEditingId(sucursal.id);
 };

 const handleCancelar = () => {
  // LIMPIAR FORMULARIO SIN EL CAMPO SALAS
  setForm({ nombre: "", direccion: "", email: "", telefono: "" });
  setEditingId(null);
 };

 const handleEliminar = async (id) => {
  if (!window.confirm("¿Seguro que deseas eliminar esta sucursal? Esta acción eliminará permanentemente todos sus datos asociados (incluyendo Salas y Clases).")) return;
  await deleteExistingSucursal(id);
 };

  // ABRIR MODAL
  const handleAbrirSalasModal = (sucursal) => {
    setModalSucursal({ id: sucursal.id, nombre: sucursal.nombre });
  };

  // CERRAR MODAL
  const handleCerrarSalasModal = () => {
    setModalSucursal(null);
  };


 return (
  <div className="sucursales-section">
   <h2 className="sucursales-section-title">
    {editingId ? "Modificar Sucursal" : "Crear Nueva Sucursal"}
   </h2>
   <form className="sucursales-form" onSubmit={handleSubmit}>
    <input
     className="sucursal-input"
     type="text"
     name="nombre"
     placeholder="Nombre (*)"
     value={form.nombre}
     onChange={handleChange}
     required
    />
    <input
     className="sucursal-input"
     type="text"
     name="direccion"
     placeholder="Dirección (*)"
     value={form.direccion}
     onChange={handleChange}
     required
    />
    <input
     className="sucursal-input"
     type="text"
     name="email"
     placeholder="Email (*)"
     value={form.email}
     onChange={handleChange}
     required
    />
    <input
     className="sucursal-input"
     type="text"
     name="telefono"
     placeholder="Teléfono"
     value={form.telefono}
     onChange={handleChange}
    />
    {/* ELIMINADO: Se quita el campo 'salas' */}
    
    <div className="form-buttons">
     <button type="submit" disabled={loading}>
      {loading
       ? editingId
        ? "Modificando..."
        : "Creando..."
       : editingId
       ? "Guardar"
       : "Crear Sucursal"}
     </button>
     {editingId && (
      <button type="button" onClick={handleCancelar}>
       Cancelar
      </button>
     )}
    </div>
   </form>
   <h3 className="sucursales-subtitulo">Sucursales existentes</h3>
   <div className="sucursales-list-wrapper">
    {sucursales.length === 0 ? (
     <p>No hay sucursales creadas aún.</p>
    ) : (
     <ul className="sucursales-cards">
      {sucursales.map((s) => (
       <div className="sucursal-card" key={s.id}>
        <input className="sucursal-input" value={s.nombre} disabled />
        <input
         className="sucursal-input"
         value={s.direccion}
         disabled
        />
        <input className="sucursal-input" value={s.email} disabled />
        <input
         className="sucursal-input"
         value={s.telefono || "-"}
         disabled
        />
        <input
         className="sucursal-input"
         value={"Gestionar Salas"} // Se actualiza el valor
         disabled
        />

        <div className="sucursal-actions">
         <button onClick={() => handleEditar(s)}>Editar</button>
                  {/* NUEVO BOTÓN para abrir el Modal */}
                  <button onClick={() => handleAbrirSalasModal(s)}>Gestionar Salas</button>
         <button
          className="btn-eliminar"
          onClick={() => handleEliminar(s.id)}
         >
          Eliminar
         </button>
        </div>
       </div>
      ))}
     </ul>
    )}
   </div>
      
      {/* RENDERIZAR EL MODAL DE SALAS */}
      {modalSucursal && (
        <SalasModal 
          sucursalId={modalSucursal.id} 
          sucursalNombre={modalSucursal.nombre}
          onClose={handleCerrarSalasModal}
        />
      )}
  </div>
 );
};

export default SucursalesSection;