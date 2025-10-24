import React, { useState } from "react";
import "../../../styles/pages/adminSucursal/clasesSection.css";
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
      telefono: profesor.telefono || "",
      especialidad: profesor.especialidad || "",
    });
    setEditingId(profesor.id);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setNuevoProfesor({ nombre: "", apellido: "", telefono: "", especialidad: "" });
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nuevoProfesor.nombre || !nuevoProfesor.apellido) {
      setError("Nombre y apellido son obligatorios.");
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

      setNuevoProfesor({ nombre: "", apellido: "", telefono: "", especialidad: "" });
    } catch (err) {
      console.error(err);
      setError("Error al guardar el profesor.");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este profesor?")) return;
    try {
      await removeProfesor(id);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el profesor.");
    }
  };

  if (loadingProfesores) return <p>Cargando profesores...</p>;

  return (
    <section className="clases-section">
      <h2 className="clases-section-title">
        {editingId ? "Modificar Profesor" : "Agregar Nuevo Profesor"}
      </h2>

      {error && <p className="clases-error-message">{error}</p>}

      <form className="clases-form" onSubmit={handleSubmit}>
        <input
          className="clases-input"
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevoProfesor.nombre}
          onChange={handleChange}
        />
        <input
          className="clases-input"
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={nuevoProfesor.apellido}
          onChange={handleChange}
        />
        <input
          className="clases-input"
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={nuevoProfesor.telefono}
          onChange={handleChange}
        />
        <input
          className="clases-input"
          type="text"
          name="especialidad"
          placeholder="Especialidad"
          value={nuevoProfesor.especialidad}
          onChange={handleChange}
        />

        <div className="clases-form-buttons">
          <button type="submit" disabled={loading}>
            {editingId ? "Guardar Cambios" : "Agregar Profesor"}
          </button>
          {editingId && (
            <button type="button" className="btn-eliminar" onClick={handleCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="clases-list-wrapper">
        <h3 className="clases-subtitulo">Profesores existentes</h3>
        <div className="clases-list">
          {profesores.length === 0 ? (
            <p>No hay profesores en esta sucursal.</p>
          ) : (
            <ul>
              {profesores.map((p) => (
                <li key={p.id} className="clase-item">
                  <span>
                    <strong>
                      {p.nombre} {p.apellido}
                    </strong>{" "}
                    — Tel: {p.telefono || "-"} — Especialidad: {p.especialidad || "-"}
                  </span>
                  <div className="clase-actions">
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
