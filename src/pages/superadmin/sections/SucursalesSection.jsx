import React, { useState } from "react";
import { useSucursales } from "../../../hooks/useApi/useSucursales";
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
    salas: 1,
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.direccion || !form.email) return;

    const payload = { ...form, salas: parseInt(form.salas) };
    if (editingId) {
      await updateExistingSucursal(editingId, payload);
      setEditingId(null);
    } else {
      await createNewSucursal(payload);
    }

    setForm({ nombre: "", direccion: "", email: "", telefono: "", salas: 1 });
  };

  const handleEditar = (sucursal) => {
    setForm({
      nombre: sucursal.nombre,
      direccion: sucursal.direccion,
      email: sucursal.email,
      telefono: sucursal.telefono || "",
      salas: sucursal.salas || 1,
    });
    setEditingId(sucursal.id);
  };

  const handleCancelar = () => {
    setForm({ nombre: "", direccion: "", email: "", telefono: "", salas: 1 });
    setEditingId(null);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta sucursal?")) return;
    await deleteExistingSucursal(id);
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
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        <input
          className="sucursal-input"
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
        />
        <input
          className="sucursal-input"
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="sucursal-input"
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
        />
        <input
          className="sucursal-input"
          type="number"
          min={1}
          name="salas"
          placeholder="Salas"
          value={form.salas}
          onChange={handleChange}
        />

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
                  value={`${s.salas} salas`}
                  disabled
                />

                <div className="sucursal-actions">
                  <button onClick={() => handleEditar(s)}>Editar</button>
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
    </div>
  );
};

export default SucursalesSection;
