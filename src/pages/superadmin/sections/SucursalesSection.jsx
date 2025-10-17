import React, { useEffect, useState } from "react";
import { getSucursales, updateSucursal, deleteSucursal } from "../../../services/api";
import "../../../styles/pages/superadmin/sucursalesSection.css";

const SucursalesSection = () => {
  const [sucursales, setSucursales] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  useEffect(() => {
    getSucursales().then(setSucursales);
  }, []);

  const handleEdit = async (id, field, value) => {
    setEditingData((prev) => ({ ...prev, [field]: value }));
    await updateSucursal(id, { [field]: value });
    setSucursales(
      sucursales.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Desea eliminar esta sucursal?")) {
      await deleteSucursal(id);
      setSucursales(sucursales.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="sucursales-section">
      <h2 className="sucursales-section-title">Gestión de Sucursales</h2>
      <div className="sucursales-section-card">
        {sucursales.map((s) => (
          <div className="sucursal-item" key={s.id}>
            <input
              className="sucursal-input"
              value={s.nombre}
              disabled={editingId !== s.id}
              onChange={(e) => handleEdit(s.id, "nombre", e.target.value)}
            />
            <input
              className="sucursal-input"
              value={s.direccion}
              disabled={editingId !== s.id}
              onChange={(e) => handleEdit(s.id, "direccion", e.target.value)}
            />
            <input
              className="sucursal-input"
              value={s.email}
              disabled={editingId !== s.id}
              onChange={(e) => handleEdit(s.id, "email", e.target.value)}
            />
            <input
              className="sucursal-input"
              value={s.telefono}
              disabled={editingId !== s.id}
              onChange={(e) => handleEdit(s.id, "telefono", e.target.value)}
            />
            <div className="sucursal-actions">
              {editingId === s.id ? (
                <button onClick={() => setEditingId(null)}>Guardar</button>
              ) : (
                <button onClick={() => setEditingId(s.id)}>Modificar</button>
              )}
              <button className="btn-eliminar" onClick={() => handleDelete(s.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SucursalesSection;
