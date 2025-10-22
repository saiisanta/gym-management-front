import React, { useEffect, useState } from "react";
import {
  getSucursales,
  createSucursal,
  updateSucursal,
  deleteSucursal,
} from "../../../services/api";
import "../../../styles/pages/superadmin/sucursalesSection.css";
import { toast } from "react-toastify";

const SucursalesSection = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);

  // Formulario creación / edición
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    email: "",
    telefono: "",
    salas: 1,
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const suc = await getSucursales();
      setSucursales(suc);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar sucursales");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Crear nueva sucursal
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.direccion || !form.email) {
      return toast.error("Completa todos los campos obligatorios");
    }

    setLoading(true);

    try {
      if (editingId) {
        // Modo edición
        await updateSucursal(editingId, {
          nombre: form.nombre,
          direccion: form.direccion,
          email: form.email,
          telefono: form.telefono,
          salas: parseInt(form.salas),
        });
        toast.success("Sucursal modificada correctamente");
        setEditingId(null);
      } else {
        // Modo creación
        await createSucursal({
          nombre: form.nombre,
          direccion: form.direccion,
          email: form.email,
          telefono: form.telefono,
          salas: parseInt(form.salas),
        });
        toast.success(`Sucursal creada: ${form.nombre}`);
      }

      setForm({ nombre: "", direccion: "", email: "", telefono: "", salas: 1 });
      cargarDatos();
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar sucursal");
    } finally {
      setLoading(false);
    }
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
    try {
      await deleteSucursal(id);
      toast.success("Sucursal eliminada");
      cargarDatos();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar sucursal");
    }
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
          placeholder="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        <input
          className="sucursal-input"
          type="text"
          placeholder="Dirección"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
        />
        <input
          className="sucursal-input"
          type="text"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="sucursal-input"
          type="text"
          placeholder="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
        />
        <input
          className="sucursal-input"
          type="number"
          min={1}
          placeholder="Salas"
          name="salas"
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
              ? "Guardar Cambios"
              : "Crear Sucursal"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn-eliminar"
              onClick={handleCancelar}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="sucursales-list-wrapper">
        <h3 className="sucursales-subtitulo">Sucursales existentes</h3>
        <div className="sucursales-list">
          {sucursales.length === 0 ? (
            <p>No hay sucursales creadas aún.</p>
          ) : (
            <ul>
              {sucursales.map((s) => (
                <li key={s.id} className="sucursal-item">
                  <span>
                    {s.nombre} - {s.direccion} - {s.email} - {s.telefono || "-"}{" "}
                    - {s.salas} salas
                  </span>
                  <div className="sucursal-actions">
                    <button onClick={() => handleEditar(s)}>Editar</button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminar(s.id)}
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
    </div>
  );
};

export default SucursalesSection;
