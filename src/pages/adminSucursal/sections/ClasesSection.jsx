import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../../../styles/pages/adminSucursal/clasesSection.css";

import { useClases } from "../../../hooks/useApi/useClases";
import { useSucursales } from "../../../hooks/useApi/useSucursales";
import { useProfesores } from "../../../hooks/useApi/useProfesores";

const DIAS = [
  { value: "Lunes", label: "Lunes" },
  { value: "Martes", label: "Martes" },
  { value: "Miércoles", label: "Miércoles" },
  { value: "Jueves", label: "Jueves" },
  { value: "Viernes", label: "Viernes" },
  { value: "Sábado", label: "Sábado" },
  { value: "Domingo", label: "Domingo" },
];

// Helpers
const toInputDatetime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
  
    // Usar métodos UTC para obtener los valores crudos 
    // del ISO (fecha y hora) y que el input los interprete correctamente como locales.
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  };
  
  const toISOStringFromInput = (input) => {
    if (!input) return null;
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  };

const ClasesSection = ({ sucursalId }) => {
  const { clases, createClase, updateClase, deleteClase, loading: clasesLoading } = useClases(sucursalId);
  const { getSucursalById } = useSucursales();
  const { profesores } = useProfesores();

  const [profesoresSucursal, setProfesoresSucursal] = useState([]);
  const [salas, setSalas] = useState([]);
  const [nuevaClase, setNuevaClase] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
    cupoMaximo: "",
    horarioInicio: "",
    horarioFin: "",
    dias: [],
    profesorId: "",
    salaId: "",
    mostrarEnHome: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loadingDependencies, setLoadingDependencies] = useState(true);

  const formatHora = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // Cargar salas y profesores
  useEffect(() => {
    if (!sucursalId) return;
    const fetchData = async () => {
      setLoadingDependencies(true);
      try {
        const sucursal = await getSucursalById(sucursalId);
        const salasArray = Array.from({ length: sucursal?.salas || 0 }, (_, i) => i + 1);
        setSalas(salasArray);

        const filteredProfesores = (profesores || []).filter(p => p.sucursalId === sucursalId);
        setProfesoresSucursal(filteredProfesores);
      } catch (err) {
        console.error("Error cargando dependencias:", err);
        setError("Error al cargar salas o profesores");
      } finally {
        setLoadingDependencies(false);
      }
    };
    fetchData();
  }, [sucursalId, profesores, getSucursalById]);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevaClase(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleDiasChange = (selectedOptions) => {
    setNuevaClase(prev => ({ ...prev, dias: selectedOptions ? selectedOptions.map(o => o.value) : [] }));
  };

  const handleEditar = (clase) => {
    setNuevaClase({
      nombre: clase.nombre || "",
      descripcion: clase.descripcion || "",
      imagen: clase.imagen || "",
      cupoMaximo: clase.cupoMaximo?.toString() || "",
      horarioInicio: toInputDatetime(clase.horarioInicio),
      horarioFin: toInputDatetime(clase.horarioFin),
      dias: clase.dias || [],
      profesorId: clase.profesorId?.toString() || "",
      salaId: clase.salaId?.toString() || "",
      mostrarEnHome: !!clase.mostrarEnHome,
    });
    setEditingId(clase.id);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => {
    setNuevaClase({
      nombre: "",
      descripcion: "",
      imagen: "",
      cupoMaximo: "",
      horarioInicio: "",
      horarioFin: "",
      dias: [],
      profesorId: "",
      salaId: "",
      mostrarEnHome: false,
    });
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nuevaClase.nombre.trim() || !nuevaClase.profesorId || !nuevaClase.salaId) {
      setError("Completa los campos obligatorios (nombre, sala, profesor).");
      return;
    }

    const payload = {
      ...nuevaClase,
      nombre: nuevaClase.nombre.trim(),
      profesorId: parseInt(nuevaClase.profesorId, 10),
      salaId: parseInt(nuevaClase.salaId, 10),
      horarioInicio: toISOStringFromInput(nuevaClase.horarioInicio),
      horarioFin: toISOStringFromInput(nuevaClase.horarioFin),
      sucursalId: sucursalId,
    };

    try {
      if (editingId) await updateClase(editingId, payload);
      else await createClase(payload);

      handleCancelar();
    } catch (err) {
      console.error("Error al guardar clase:", err);
      setError("Error al guardar la clase.");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta clase?")) return;
    try {
      await deleteClase(id);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la clase.");
    }
  };

  if (clasesLoading || loadingDependencies) return <p>Cargando clases...</p>;

  return (
    <section className="clases-section">
      <h2 className="clases-section-title">{editingId ? "Modificar Clase" : "Crear Nueva Clase"}</h2>

      {error && <p className="clases-error-message">{error}</p>}

      <form className="clases-form" onSubmit={handleSubmit}>
        <input className="clases-input" type="text" name="nombre" placeholder="Nombre de la clase" value={nuevaClase.nombre} onChange={handleChange} />
        <input className="clases-input" type="text" name="descripcion" placeholder="Descripción" value={nuevaClase.descripcion} onChange={handleChange} />
        <input className="clases-input" type="text" name="imagen" placeholder="URL de imagen" value={nuevaClase.imagen} onChange={handleChange} />
        <input className="clases-input" type="number" name="cupoMaximo" placeholder="Cupo máximo" value={nuevaClase.cupoMaximo} onChange={handleChange} />
        <input className="clases-input" type="datetime-local" name="horarioInicio" value={nuevaClase.horarioInicio} onChange={handleChange} />
        <input className="clases-input" type="datetime-local" name="horarioFin" value={nuevaClase.horarioFin} onChange={handleChange} />

        <Select
          isMulti
          options={DIAS}
          placeholder="Seleccionar días"
          value={DIAS.filter(d => nuevaClase.dias.includes(d.value))}
          onChange={handleDiasChange}
          styles={{
            control: (provided, state) => ({
              ...provided,
              minHeight: "43px",
              borderRadius: "8px",
              borderColor: state.isFocused ? "var(--color-celeste)" : "var(--color-celeste)",
              boxShadow: state.isFocused ? "0 0 0 1px var(--color-celeste)" : "none",
              backgroundColor: "var(--color-surface)",
              fontSize: "1rem",
              "&:hover": { borderColor: "var(--color-celeste)" },
            }),
          }}
        />

        <select className="clases-input" name="profesorId" value={nuevaClase.profesorId} onChange={handleChange}>
          <option value="">Seleccionar profesor</option>
          {profesoresSucursal.map(p => <option key={p.id} value={p.id}>{p.nombre} {p.apellido}</option>)}
        </select>

        <select className="clases-input" name="salaId" value={nuevaClase.salaId} onChange={handleChange}>
          <option value="">Seleccionar sala</option>
          {salas.map(s => <option key={s} value={s}>Sala {s}</option>)}
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input type="checkbox" name="mostrarEnHome" checked={!!nuevaClase.mostrarEnHome} onChange={handleChange} />
          Mostrar en Home
        </label>

        <div className="clases-form-buttons">
          <button type="submit" disabled={clasesLoading}>{editingId ? "Guardar Cambios" : "Agregar Clase"}</button>
          {editingId && <button type="button" className="btn-eliminar" onClick={handleCancelar}>Cancelar</button>}
        </div>
      </form>

      <div className="clases-list-wrapper">
        <h3 className="clases-subtitulo">Clases existentes</h3>
        <div className="clases-list">
          {clases.length === 0 ? <p>No hay clases creadas aún.</p> :
            <ul>
              {clases.map(c => {
                const profesor = profesoresSucursal.find(p => p.id === c.profesorId);
                const nombreProfesor = profesor ? `${profesor.nombre} ${profesor.apellido}` : "Sin asignar";
                return (
                  <li key={c.id} className="clase-item">
                    <span>
                      <strong>{c.nombre}</strong> — Sala {c.salaId} — Profesor {nombreProfesor} — Días: {c.dias?.join(", ")}{" "}
                      {c.horarioInicio && c.horarioFin && <> — Hora: {formatHora(c.horarioInicio)} hasta {formatHora(c.horarioFin)}</>}
                      {c.mostrarEnHome && " — Mostrada en Home"}
                    </span>
                    <div className="clase-actions">
                      <button onClick={() => handleEditar(c)}>Editar</button>
                      <button className="btn-eliminar" onClick={() => handleEliminar(c.id)}>Eliminar</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          }
        </div>
      </div>
    </section>
  );
};

export default ClasesSection;
