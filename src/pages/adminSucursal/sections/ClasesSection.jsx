import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../../../styles/pages/adminSucursal/clasesSection.css";

import { useClases } from "../../../hooks/useApi/useClases";
import { useProfesores } from "../../../hooks/useApi/useProfesores";
import { useSalas } from "../../../hooks/useApi/useSalas";

const DIAS = [
    { value: "Lunes", label: "Lunes" },
    { value: "Martes", label: "Martes" },
    { value: "Miércoles", label: "Miércoles" },
    { value: "Jueves", label: "Jueves" },
    { value: "Viernes", label: "Viernes" },
    { value: "Sábado", label: "Sábado" },
    { value: "Domingo", label: "Domingo" },
];

const TIPOS_CLASE = [
    { value: "general", label: "General" },
    { value: "especializada", label: "Especializada" },
];

const ClasesSection = ({ sucursalId }) => {
    const {
        clases,
        createClase,
        updateClase,
        deleteClase,
        loading: clasesLoading,
    } = useClases(sucursalId);
    
    const { profesores } = useProfesores();
    const { salas: salasData, fetchSalas, loading: salasLoading } = useSalas(); 

    const [profesoresSucursal, setProfesoresSucursal] = useState([]);
    
    const [nuevaClase, setNuevaClase] = useState({
        nombre: "",
        descripcion: "",
        imagen: "",
        capacidad: "",
        horarioInicioForm: "",
        horarioFinForm: "",
        dias: [],
        profesorId: "",
        salaId: "",
        tipo: "general",
        mostrarEnHome: true,
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [loadingDependencies, setLoadingDependencies] = useState(true);


    useEffect(() => {
        if (!sucursalId) return;
        const fetchData = async () => {
            setLoadingDependencies(true);
            try {
                await fetchSalas(sucursalId); 

                const filteredProfesores = (profesores || []).filter(
                    (p) => p.sucursalId === sucursalId
                );
                setProfesoresSucursal(filteredProfesores);
            } catch (err) {
                console.error("Error cargando dependencias:", err);
                setError("Error al cargar salas o profesores");
            } finally {
                setLoadingDependencies(false);
            }
        };
        fetchData();
    }, [sucursalId, profesores, fetchSalas]);


    // Handlers
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === "capacidad") return;

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
    
    const handleSalaChange = (e) => {
        const salaId = e.target.value;
        let capacidadAsignada = "";

        if (salaId) {
            const salaSeleccionada = salasData.find(s => s.id === parseInt(salaId, 10));
            if (salaSeleccionada) {
                capacidadAsignada = salaSeleccionada.capacidad.toString();
            }
        }

        setNuevaClase((prev) => ({
            ...prev,
            salaId: salaId, 
            capacidad: capacidadAsignada,
        }));
    };

    const handleEditar = (clase) => {
        const inicioCompleto = clase.horarioInicio?.substring(0, 16) || "";
        const finCompleto = clase.horarioFin?.substring(0, 16) || "";
        let capacidadAUsar = clase.capacidad?.toString() || "";
        
        const salaSeleccionada = salasData.find(s => s.id === clase.salaId);
        if (salaSeleccionada) {
            capacidadAUsar = salaSeleccionada.capacidad.toString();
        }

        setNuevaClase({
            nombre: clase.nombre || "",
            descripcion: clase.descripcion || "",
            imagen: clase.imagen || "",
            capacidad: capacidadAUsar,
            horarioInicioForm: inicioCompleto,
            horarioFinForm: finCompleto,
            dias: clase.dias || [],
            profesorId: clase.profesorId?.toString() || "",
            salaId: clase.salaId?.toString() || "",
            tipo: clase.tipo || "general",
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
            capacidad: "",
            horarioInicioForm: "",
            horarioFinForm: "",
            dias: [],
            profesorId: "",
            salaId: "",
            tipo: "general",
            mostrarEnHome: true,
        });
        setEditingId(null);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (
            !nuevaClase.nombre.trim() ||
            !nuevaClase.profesorId ||
            !nuevaClase.salaId ||
            !nuevaClase.horarioInicioForm ||
            !nuevaClase.horarioFinForm
        ) {
            setError("Completa todos los campos obligatorios (*).");
            return;
        }
        
        if (!nuevaClase.capacidad || parseInt(nuevaClase.capacidad, 10) <= 0) {
            setError("Selecciona una sala para asignar la capacidad automáticamente.");
            return;
        }

        const inicioDate = new Date(nuevaClase.horarioInicioForm);
        const finDate = new Date(nuevaClase.horarioFinForm);
        
        if (finDate <= inicioDate) {
            setError("La hora de fin debe ser posterior a la hora de inicio.");
            return;
        }
        
        const diffMs = finDate.getTime() - inicioDate.getTime();
        const duracionMinutos = Math.round(diffMs / 60000); 

        const [fecha, hora] = nuevaClase.horarioInicioForm.split('T');
        const horaInicio = `${hora}:00`; 

        const payload = {
            profesorId: parseInt(nuevaClase.profesorId, 10),
            salaId: parseInt(nuevaClase.salaId, 10),
            sucursalId: sucursalId,
            nombre: nuevaClase.nombre.trim(),
            descripcion: nuevaClase.descripcion.trim(),
            imagen: nuevaClase.imagen || null,
            tipo: nuevaClase.tipo,
            duracionMinutos: duracionMinutos, 
            capacidad: parseInt(nuevaClase.capacidad, 10), 
            mostrarEnHome: nuevaClase.mostrarEnHome,
            fecha: fecha, 
            horaInicio: horaInicio, 
            dias: nuevaClase.dias,
        };

        try {
            if (editingId) await updateClase(editingId, payload);
            else await createClase(payload);

            handleCancelar();
        } catch (err) {
            console.error("Error al guardar clase:", err);
            setError(err.response?.data?.message || "Error al guardar la clase. Verifique formato de datos.");
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

    if (clasesLoading || loadingDependencies || salasLoading) return <p>Cargando clases...</p>;

    return (
        <section className="clases-section">
            <h2 className="clases-section-title">
                {editingId ? "Modificar Clase" : "Crear Nueva Clase"}
            </h2>

            {error && <p className="clases-error-message">{error}</p>}

            <form className="clases-form" onSubmit={handleSubmit}>
                {/* -------------------- CAMPOS DE TEXTO -------------------- */}
                <input
                    className="clases-input"
                    type="text"
                    name="nombre"
                    placeholder="Nombre de la clase (*)"
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
                
                {/* -------------------- SELECT SALA (Define la capacidad) -------------------- */}
                <select
                    className="clases-input"
                    name="salaId"
                    value={nuevaClase.salaId}
                    onChange={handleSalaChange}
                >
                    <option value="">Seleccionar sala (*)</option>
                    {salasData.map((s) => (
                        <option key={s.id} value={s.id}> 
                           {s.nombre} (Cap. Máx: {s.capacidad})
                        </option>
                    ))}
                </select>

                {/* -------------------- CAMPO CAPACIDAD (SOLO LECTURA) -------------------- */}
                <input
                    className="clases-input"
                    type="number"
                    name="capacidad"
                    placeholder={`Capacidad (Cupo máximo: ${nuevaClase.capacidad || '0'})`}
                    value={nuevaClase.capacidad}
                    readOnly
                    style={{ fontWeight: 'bold' }}
                    onChange={handleChange} 
                />
                
                {/* -------------------- FECHA Y HORA -------------------- */}
                <input
                    className="clases-input"
                    type="datetime-local"
                    name="horarioInicioForm"
                    placeholder="Fecha y Hora de Inicio (*)"
                    value={nuevaClase.horarioInicioForm}
                    onChange={handleChange}
                />
                <input
                    className="clases-input"
                    type="datetime-local"
                    name="horarioFinForm"
                    placeholder="Fecha y Hora de Fin (*)"
                    value={nuevaClase.horarioFinForm}
                    onChange={handleChange}
                />

                {/* -------------------- DÍAS (Select Multi) -------------------- */}
                <Select
                    isMulti
                    options={DIAS}
                    placeholder="Seleccionar días (Opcional)"
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
                            "&:hover": { borderColor: "var(--color-celeste)" },
                        }),
                    }}
                />

                {/* -------------------- SELECT PROFESOR -------------------- */}
                <select
                    className="clases-input"
                    name="profesorId"
                    value={nuevaClase.profesorId}
                    onChange={handleChange}
                >
                    <option value="">Seleccionar profesor (*)</option>
                    {profesoresSucursal.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nombre} {p.apellido}
                        </option>
                    ))}
                </select>
                
                {/* -------------------- SELECT TIPO DE CLASE -------------------- */}
                <select
                    className="clases-input"
                    name="tipo"
                    value={nuevaClase.tipo}
                    onChange={handleChange}
                >
                    {TIPOS_CLASE.map((t) => (
                        <option key={t.value} value={t.value}>
                            Tipo: {t.label}
                        </option>
                    ))}
                </select>

                {/* -------------------- CHECKBOX -------------------- */}
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input
                        type="checkbox"
                        name="mostrarEnHome"
                        checked={!!nuevaClase.mostrarEnHome}
                        onChange={handleChange}
                    />
                    Mostrar en Home
                </label>

                {/* -------------------- BOTONES -------------------- */}
                <div className="clases-form-buttons">
                    <button type="submit" disabled={clasesLoading}>
                        {editingId ? "Guardar Cambios" : "Agregar Clase"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancelar}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            <h3 className="clases-subtitulo">Clases existentes</h3>
            <div className="clases-list-wrapper">
                <div className="clases-list">
                    {clases.length === 0 ? (
                        <p>No hay clases creadas aún.</p>
                    ) : (
                        <ul>
                            {clases.map((c) => {
                                const profesor = profesoresSucursal.find((p) => p.id === c.profesorId);
                                const nombreProfesor = profesor ? `${profesor.nombre} ${profesor.apellido}` : "Sin asignar";
                                
                                const salaIdNumerico = parseInt(c.salaId, 10);
                                const salaInfo = salasData.find(s => s.id === salaIdNumerico);
                                const numeroSala = salaInfo?.numero;
                                const salaNombre = salaInfo?.nombre;

                                const horaInicioStr = c.horarioInicio?.substring(11, 16) || "N/A";
                                const horaFinStr = c.horarioFin?.substring(11, 16) || "N/A";
                                
                                return (
                                    <li key={c.id} className="clase-item">
                                        <div className="clase-list-info">
                                            <strong>{c.nombre} ({c.tipo})</strong>
                                        </div>
                                        <div className="clase-list-info">
                                            {`${salaNombre} `}
                                            (Cupo: {c.capacidad})
                                        </div> 
                                        <div className="clase-list-info">
                                            Profesor {nombreProfesor}
                                        </div>
                                        <div className="clase-list-info">
                                            Días: {c.dias?.join(", ")}
                                        </div>
                                        <div className="clase-list-info">
                                            Hora: {horaInicioStr} a {horaFinStr} ({c.duracionMinutos} min)
                                        </div>
                                        <div className="clase-list-info">
                                            {c.mostrarEnHome ? "Mostrada en Home" : "Oculta en Home"}
                                        </div>
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