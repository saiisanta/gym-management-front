import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../../../styles/pages/adminSucursal/clasesSection.css";
import {
  getClasesBySucursal,
  createClase,
  updateClase,
  deleteClase,
  getSucursalById,
} from "../../../services/api";
import { useProfesores } from "../../../hooks/useApi";

const DIAS = [
  { value: "Lunes", label: "Lunes" },
  { value: "Martes", label: "Martes" },
  { value: "Miércoles", label: "Miércoles" },
  { value: "Jueves", label: "Jueves" },
  { value: "Viernes", label: "Viernes" },
  { value: "Sábado", label: "Sábado" },
  { value: "Domingo", label: "Domingo" },
];

// === Helpers para formato de fechas ===
const toInputDatetime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const toISOStringFromInput = (input) => {
  if (!input) return null;
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

const ClasesSection = ({ sucursalId }) => {
  const { profesores } = useProfesores(); // 🔹 todos los profesores
  const [profesoresSucursal, setProfesoresSucursal] = useState([]); // 🔹 solo de esta sucursal
  const [clases, setClases] = useState([]);
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
    idSala: "",
    mostrarEnHome: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // === Helper para mostrar hora legible ===
  const formatHora = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // === Cargar clases, salas y filtrar profesores por sucursal ===
  useEffect(() => {
    if (!sucursalId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getClasesBySucursal(sucursalId);
        const clasesConFlag = (data || []).map((c) => ({
          ...c,
          mostrarEnHome: c.mostrarEnHome || false,
        }));
        setClases(clasesConFlag);

        const sucursal = await getSucursalById(sucursalId);
        const salasArray = Array.from(
          { length: sucursal?.salas || 0 },
          (_, i) => i + 1
        );
        setSalas(salasArray);

        // 🔹 Filtrar profesores por sucursal
        const filteredProfesores = (profesores || []).filter(
          (p) => p.sucursalId === sucursalId
        );
        setProfesoresSucursal(filteredProfesores);
      } catch (err) {
        console.error("Error al cargar clases o sucursal:", err);
        setError("No se pudieron cargar las clases o salas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sucursalId, profesores]);

  // === Handlers ===
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevaClase((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDiasChange = (selectedOptions) => {
    setNuevaClase((prev) => ({
      ...prev,
      dias: selectedOptions ? selectedOptions.map((o) => o.value) : [],
    }));
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
      idSala: clase.idSala?.toString() || "",
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
      idSala: "",
      mostrarEnHome: false,
    });
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const nombreTrim = nuevaClase.nombre?.trim();
    const profesorIdStr = nuevaClase.profesorId?.toString();
    const idSalaStr = nuevaClase.idSala?.toString();

    if (!nombreTrim || !idSalaStr || !profesorIdStr) {
      setError("Completa los campos obligatorios (nombre, sala, profesor).");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...nuevaClase,
        nombre: nombreTrim,
        profesorId: parseInt(profesorIdStr, 10),
        idSala: parseInt(idSalaStr, 10),
        horarioInicio: toISOStringFromInput(nuevaClase.horarioInicio),
        horarioFin: toISOStringFromInput(nuevaClase.horarioFin),
        idSucursal: sucursalId,
      };

      if (editingId) {
        const updated = await updateClase(editingId, payload);
        setClases((prev) =>
          prev.map((c) => (c.id === editingId ? { ...c, ...updated } : c))
        );
        setEditingId(null);
      } else {
        const created = await createClase(payload);
        setClases((prev) => [...prev, created]);
      }

      setNuevaClase({
        nombre: "",
        descripcion: "",
        imagen: "",
        cupoMaximo: "",
        horarioInicio: "",
        horarioFin: "",
        dias: [],
        profesorId: "",
        idSala: "",
        mostrarEnHome: false,
      });
    } catch (err) {
      console.error("Error al guardar clase:", err);
      setError("Error al guardar la clase. Revisá la consola.");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta clase?")) return;
    try {
      await deleteClase(id);
      setClases((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la clase.");
    }
  };

  if (loading) return <p>Cargando clases...</p>;

  return (
    <section className="clases-section">
      <h2 className="clases-section-title">
        {editingId ? "Modificar Clase" : "Crear Nueva Clase"}
      </h2>

      {error && <p className="clases-error-message">{error}</p>}

      <form className="clases-form" onSubmit={handleSubmit}>
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
          name="descripcion"
          placeholder="Descripción"
          value={nuevaClase.descripcion}
          onChange={handleChange}
        />
        <input
          className="clases-input"
          type="text"
          name="imagen"
          placeholder="URL de imagen"
          value={nuevaClase.imagen}
          onChange={handleChange}
        />
        <input
          className="clases-input"
          type="number"
          name="cupoMaximo"
          placeholder="Cupo máximo"
          value={nuevaClase.cupoMaximo}
          onChange={handleChange}
        />
        <input
          className="clases-input"
          type="datetime-local"
          name="horarioInicio"
          placeholder="Horario inicio"
          value={nuevaClase.horarioInicio}
          onChange={handleChange}
        />
        <input
          className="clases-input"
          type="datetime-local"
          name="horarioFin"
          placeholder="Horario fin"
          value={nuevaClase.horarioFin}
          onChange={handleChange}
        />

        <Select
          isMulti
          options={DIAS}
          placeholder="Seleccionar días"
          value={DIAS.filter((d) => nuevaClase.dias.includes(d.value))}
          onChange={handleDiasChange}
          styles={{
            control: (provided, state) => ({
              ...provided,
              minHeight: "43px",
              borderRadius: "8px",
              borderColor: state.isFocused
                ? "var(--color-celeste)"
                : "var(--color-celeste)",
              boxShadow: state.isFocused
                ? "0 0 0 1px var(--color-celeste)"
                : "none",
              backgroundColor: "var(--color-surface)",
              fontSize: "1rem",
              "&:hover": {
                borderColor: "var(--color-celeste)",
              },
            }),
            menu: (provided) => ({
              ...provided,
              borderRadius: "8px",
            }),
            multiValue: (provided) => ({
              ...provided,
              backgroundColor: "var(--color-celeste)",
              color: "white",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              color: "white",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              color: "white",
              ":hover": {
                backgroundColor: "#1aa0c1",
                color: "white",
              },
            }),
          }}
        />

        <select
          className="clases-input"
          name="profesorId"
          value={nuevaClase.profesorId}
          onChange={handleChange}
        >
          <option value="">Seleccionar profesor</option>
          {profesoresSucursal?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.apellido}
            </option>
          ))}
        </select>

        <select
          className="clases-input"
          name="idSala"
          value={nuevaClase.idSala}
          onChange={handleChange}
        >
          <option value="">Seleccionar sala</option>
          {salas?.map((s) => (
            <option key={s} value={s}>
              Sala {s}
            </option>
          ))}
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            name="mostrarEnHome"
            checked={!!nuevaClase.mostrarEnHome}
            onChange={handleChange}
          />
          Mostrar en Home
        </label>

        <div className="clases-form-buttons">
          <button type="submit" disabled={loading}>
            {editingId ? "Guardar Cambios" : "Agregar Clase"}
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

      <div className="clases-list-wrapper">
        <h3 className="clases-subtitulo">Clases existentes</h3>
        <div className="clases-list">
          {clases.length === 0 ? (
            <p>No hay clases creadas aún.</p>
          ) : (
            <ul>
              {clases.map((c) => {
                const profesor = profesoresSucursal.find((p) => p.id === c.profesorId);
                const nombreProfesor = profesor
                  ? `${profesor.nombre} ${profesor.apellido}`
                  : "Sin asignar";

                return (
                  <li key={c.id} className="clase-item">
                    <span>
                      <strong>{c.nombre}</strong> — Sala {c.idSala} — Profesor{" "}
                      {nombreProfesor} — Días: {c.dias?.join(", ")}{" "}
                      {c.horarioInicio && c.horarioFin && (
                        <>
                          — Hora: {formatHora(c.horarioInicio)} hasta{" "}
                          {formatHora(c.horarioFin)}
                        </>
                      )}{" "}
                      {c.mostrarEnHome && "— Mostrada en Home"}
                    </span>
                    <div className="clase-actions">
                      <button onClick={() => handleEditar(c)}>Editar</button>
                      <button
                        className="btn-eliminar"
                        onClick={() => handleEliminar(c.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default ClasesSection;
