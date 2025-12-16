// /src/components/SalasModal.jsx

import React, { useState, useEffect } from "react";
import { useSalas } from "../../hooks/useApi/useSalas";
// ¡Importamos SOLO el CSS específico para el modal!
import "./salasModal.css";

// Define tipos de sala para el select
const TIPOS_SALA = [
  { value: "general", label: "General" },
  { value: "cardio", label: "Cardio" },
  { value: "fuerza", label: "Fuerza/Pesas" },
  { value: "clases_grupales", label: "Clases Grupales" },
  { value: "yoga_pilates", label: "Yoga/Pilates" },
];

// Función auxiliar para obtener el Label (se mantiene)
const getTipoLabel = (value) =>
  TIPOS_SALA.find((t) => t.value === value)?.label || value;

const SalasModal = ({ sucursalId, sucursalNombre, onClose }) => {
  const {
    salas,
    loading,
    error: apiError,
    fetchSalas,
    createNewSala,
    updateExistingSala,
    deleteExistingSala,
  } = useSalas();

  const [form, setForm] = useState({
    nombre: "",
    tipo: TIPOS_SALA[0].value,
    capacidad: 10,
    descripcion: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (sucursalId) {
      fetchSalas(sucursalId);
    }
  }, [sucursalId, fetchSalas]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleCrearOActualizar = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!form.nombre || form.capacidad < 1) {
      setLocalError("El nombre y la capacidad (mínimo 1) son obligatorios.");
      return;
    }

    const payload = {
      Nombre: form.nombre,
      Tipo: form.tipo,
      Capacidad: form.capacidad,
      Descripcion: form.descripcion,
    };

    try {
      if (editingId) {
        await updateExistingSala(editingId, payload);
      } else {
        await createNewSala({ ...payload, SucursalId: sucursalId });
      }
      handleCancelar();
      fetchSalas(sucursalId);
    } catch (err) {
      setLocalError(err.message || "Error al guardar la sala.");
    }
  };

  const handleEditar = (sala) => {
    setForm({
      nombre: sala.nombre,
      tipo: sala.tipo,
      capacidad: sala.capacidad,
      descripcion: sala.descripcion || "",
    });
    setEditingId(sala.id);
    setLocalError(null);
  };

  const handleCancelar = () => {
    setForm({
      nombre: "",
      tipo: TIPOS_SALA[0].value,
      capacidad: 10,
      descripcion: "",
    });
    setEditingId(null);
    setLocalError(null);
  };

  const handleEliminar = async (id, nombre) => {
    if (
      !window.confirm(
        `¡ADVERTENCIA! ¿Seguro que deseas ELIMINAR PERMANENTEMENTE la sala "${nombre}"? Esta acción no se puede deshacer y afectará a todas las clases asociadas.`
      )
    )
      return;
    try {
      const success = await deleteExistingSala(id);
      if (success === false) {
        setLocalError(
          `ERROR: No se pudo eliminar la sala "${nombre}". Probablemente tiene clases programadas o dependencias asociadas.`
        );
      } else {
        fetchSalas(sucursalId);
        setLocalError(null);
      }
    } catch (err) {
      setLocalError(err.message || "Error grave al intentar eliminar la sala.");
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          {/* El sucursales-section-title se usa para mantener el estilo del título */}
          <h3 className="sucursales-section-title">
            Gestión de Salas: {sucursalNombre}
          </h3>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {/* El sucursales-subtitulo se usa para mantener el estilo del subtítulo */}
          <h4 className="sucursales-subtitulo">
            {editingId ? "Modificar Sala Existente" : "Crear Nueva Sala"}
          </h4>

          {/* Contenedor de errores */}
          {(localError || apiError) && (
            <p
              style={{
                color: "#e74c3c",
                backgroundColor: "#fde7e7",
                padding: "10px",
                border: "1px solid #e74c3c",
                borderRadius: "8px",
                marginBottom: "15px",
                marginTop: "15px",
              }}
            >
              🛑 Error: {localError || apiError}
            </p>
          )}

          {/* FORMULARIO DE EDICIÓN/CREACIÓN - CLASE NUEVA: salas-form-modal */}
          <form className="salas-form-modal" onSubmit={handleCrearOActualizar}>
            {/* 1. Nombre */}
            <input
              className="sucursal-input"
              type="text"
              name="nombre"
              placeholder="Nombre de la Sala (*)"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            {/* 2. Tipo (Select) */}
            <select
              className="sucursal-input"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              required
            >
              {TIPOS_SALA.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {/* 3. Capacidad */}
            <input
              className="sucursal-input"
              type="number"
              min={1}
              name="capacidad"
              placeholder="Capacidad Máxima (*)"
              value={form.capacidad}
              onChange={handleChange}
              required
            />
            {/* 4. Descripción (Usamos un textarea para mejor UX, pero mantenemos el estilo de input) */}
            <textarea
              rows={1}
              className="sucursal-input"
              name="descripcion"
              placeholder="Descripción (ej: equipos o características)"
              value={form.descripcion}
              onChange={handleChange}
              // El estilo para que ocupe las dos columnas ahora está en el CSS: .salas-form-modal .form-buttons
              style={{ gridColumn: "span 2", resize: "vertical" }}
            />

            {/* Botones de acción: usa la clase .form-buttons */}
            <div className="form-buttons">
              <button type="submit" disabled={loading}>
                {loading
                  ? editingId
                    ? "Guardando..."
                    : "Creando..."
                  : editingId
                  ? "Guardar Cambios"
                  : "Agregar Sala"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelar}>
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>

          {/* LISTADO DE SALAS */}
          <h4
            className="sucursales-subtitulo"
            style={{ marginTop: "2rem", borderRadius: "12px 12px 0 0" }}
          >
            Salas Activas en {sucursalNombre} (
            {salas.filter((s) => s.activa).length})
          </h4>

          {loading && <p>Cargando salas...</p>}

          {/* Contenedor de lista: usa la clase .sucursales-cards */}
          <div className="sucursales-cards">
            {!loading && salas.length === 0 && (
              <p style={{ padding: "10px" }}>
                Aún no hay salas configuradas para esta sucursal.
              </p>
            )}

            {salas.map((s) => (
              // CARD DE SALA: CLASE NUEVA: sala-card-modal
              <div
                className={`sala-card-modal ${
                  !s.activa ? "disabled-card" : ""
                }`}
                key={s.id}
              >
                {/* Campos de Sala */}
                <input
                  className="sucursal-input"
                  value={s.nombre}
                  disabled
                  title="Nombre"
                />
                <input
                  className="sucursal-input"
                  value={getTipoLabel(s.tipo)}
                  disabled
                  title="Tipo de Sala"
                />
                <input
                  className="sucursal-input"
                  value={`Cap: ${s.capacidad}`}
                  disabled
                  title="Capacidad Máxima"
                />
                <input
                  className="sucursal-input"
                  value={s.descripcion || "Sin Descripción"}
                  disabled
                  title="Descripción"
                />
                <input
                  className="sucursal-input"
                  value={s.activa ? "Activa" : "Desactivada"}
                  disabled
                  // Estilos inline para el estado, para dar feedback visual
                  style={{
                    color: s.activa ? "var(--color-celeste)" : "#e74c3c",
                    fontWeight: 600,
                    border: s.activa
                      ? "1px solid var(--color-celeste)"
                      : "1px solid #e74c3c",
                  }}
                />

                <div className="sucursal-actions">
                  <button
                    onClick={() => handleEditar(s)}
                    disabled={!s.activa || editingId === s.id}
                    // Usa la clase 'btn-editando' que ya definimos en el CSS
                    className={editingId === s.id ? "btn-editando" : ""}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleEliminar(s.id, s.nombre)}
                    style={{ backgroundColor: s.activa ? "#e74c3c" : "#888" }}
                  >
                    {s.activa ? "Eliminar" : "Eliminada"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalasModal;
