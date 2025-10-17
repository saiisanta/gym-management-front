import React, { useEffect, useState } from "react";
import "../../../styles/pages/adminSucursal/profesoresSection.css";
import { getProfesoresSucursal } from "../../../services/api";

const ProfesoresSection = () => {
  const [profesores, setProfesores] = useState([]);
  const [nuevoProfesor, setNuevoProfesor] = useState({
    nombre: "",
    especialidad: "",
  });

  useEffect(() => {
    const fetchProfesores = async () => {
      const data = await getProfesoresSucursal();
      setProfesores(data);
    };
    fetchProfesores();
  }, []);

  const handleChange = (e) => {
    setNuevoProfesor({ ...nuevoProfesor, [e.target.name]: e.target.value });
  };

  const handleAgregar = () => {
    if (!nuevoProfesor.nombre || !nuevoProfesor.especialidad) return;
    setProfesores([...profesores, nuevoProfesor]);
    setNuevoProfesor({ nombre: "", especialidad: "" });
  };

  return (
    <section className="profesores-section">
      <h2 className="profesores-section-title">Profesores</h2>

      <div className="profesores-section-form">
        <input
          className="profesores-section-input"
          type="text"
          name="nombre"
          placeholder="Nombre del profesor"
          value={nuevoProfesor.nombre}
          onChange={handleChange}
        />
        <input
          className="profesores-section-input"
          type="text"
          name="especialidad"
          placeholder="Especialidad"
          value={nuevoProfesor.especialidad}
          onChange={handleChange}
        />
        <button
          className="profesores-section-button"
          onClick={handleAgregar}
        >
          Agregar profesor
        </button>
      </div>

      <div className="profesores-section-list">
        <ul>
          {profesores.map((prof, index) => (
            <li className="profesor-item" key={index}>
              <span>
                <strong>{prof.nombre}</strong> — {prof.especialidad}
              </span>
              <small className="profesor-status">Activo</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ProfesoresSection;
