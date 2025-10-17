import React, { useState, useEffect } from "react";
import "../../../styles/pages/adminSucursal/clasesSection.css";
import { getClasesBySucursal, createClase, deleteClase } from "../../../services/api";

const ClasesSection = () => {
  const [clases, setClases] = useState([]);
  const [nuevaClase, setNuevaClase] = useState({
    nombre: "",
    horario: "",
    profesor: "",
  });

  useEffect(() => {
    const fetchClases = async () => {
      const data = await getClasesBySucursal();
      setClases(data);
    };
    fetchClases();
  }, []);

  const handleChange = (e) => {
    setNuevaClase({ ...nuevaClase, [e.target.name]: e.target.value });
  };

  const handleAgregar = async () => {
    if (!nuevaClase.nombre || !nuevaClase.horario) return;
    await createClase(nuevaClase);
    setClases([...clases, nuevaClase]);
    setNuevaClase({ nombre: "", horario: "", profesor: "" });
  };

  const handleEliminar = async (id) => {
    await deleteClase(id);
    setClases(clases.filter((c) => c.id !== id));
  };

  return (
    <section className="clases-section">
      <h2 className="clases-section-title">Clases</h2>

      {/* Formulario para agregar clase */}
      <div className="clases-section-card clases-section-form">
        <input
          className="clases-input"
          type="text"
          name="nombre"
          placeholder="Nombre de la clase"
          value={nuevaClase.nombre}
          onChange={handleChange}
        />
        <input
          className="clases-input"
          type="text"
          name="horario"
          placeholder="Horario"
          value={nuevaClase.horario}
          onChange={handleChange}
        />
        <input
          className="clases-input"
          type="text"
          name="profesor"
          placeholder="Profesor asignado"
          value={nuevaClase.profesor}
          onChange={handleChange}
        />
        <button className="clases-button" onClick={handleAgregar}>
          Agregar clase
        </button>
      </div>

      {/* Lista de clases */}
      <div className="clases-section-card clases-list">
        {clases.map((clase) => (
          <div className="clase-item" key={clase.id}>
            <span>
              <strong>{clase.nombre}</strong> — {clase.horario} ({clase.profesor})
            </span>
            <button
              className="btn-eliminar"
              onClick={() => handleEliminar(clase.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClasesSection;
