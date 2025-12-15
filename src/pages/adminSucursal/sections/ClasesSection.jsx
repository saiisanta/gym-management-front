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

const TIPOS_CLASE = [
    { value: "general", label: "General" },
    { value: "especializada", label: "Especializada" },
];

// Helper: Ya no es necesario el helper toLocalDatetimeString ni formatTimeOnly
// porque usaremos las propiedades ISO que el backend ya calcula (HorarioInicio, HorarioFin).

const ClasesSection = ({ sucursalId }) => {
    const {
        clases,
        createClase,
        updateClase,
        deleteClase,
        loading: clasesLoading,
    } = useClases(sucursalId);
    const { getSucursalById } = useSucursales();
    const { profesores } = useProfesores();

    const [profesoresSucursal, setProfesoresSucursal] = useState([]);
    const [salas, setSalas] = useState([]);
    const [nuevaClase, setNuevaClase] = useState({
        nombre: "",
        descripcion: "",
        imagen: "",
        capacidad: "",
        // CAMBIOS DE TIEMPO: Usaremos estos campos para el input del usuario (YYYY-MM-DDTHH:mm)
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

    // Cargar salas y profesores (LÓGICA CORRECTA MANTENIDA)
    useEffect(() => {
        if (!sucursalId) return;
        const fetchData = async () => {
            setLoadingDependencies(true);
            try {
                const sucursal = await getSucursalById(sucursalId);
                const salasArray = Array.from(
                    { length: sucursal?.salas || 0 },
                    (_, i) => i + 1
                );
                setSalas(salasArray);

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
    }, [sucursalId, profesores, getSucursalById]);

    // Handlers
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
        // --- CAMBIO CLAVE: Usamos HorarioInicio y HorarioFin que el backend calcula ---

        // El backend envía HorarioInicio y HorarioFin en formato ISO: "YYYY-MM-DDTHH:mm:ss"
        // Los inputs datetime-local esperan "YYYY-MM-DDTHH:mm".
        const inicioCompleto = clase.horarioInicio?.substring(0, 16) || "";
        const finCompleto = clase.horarioFin?.substring(0, 16) || "";

        setNuevaClase({
            nombre: clase.nombre || "",
            descripcion: clase.descripcion || "",
            imagen: clase.imagen || "",
            capacidad: clase.capacidad?.toString() || "",
            // Establecer los valores directamente en los inputs datetime-local
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

        // Validación básica
        if (
            !nuevaClase.nombre.trim() ||
            !nuevaClase.profesorId ||
            !nuevaClase.salaId ||
            !nuevaClase.horarioInicioForm ||
            !nuevaClase.horarioFinForm
        ) {
            setError("Completa todos los campos obligatorios.");
            return;
        }

        // 1. Obtener objetos Date para el cálculo de duración
        const inicioDate = new Date(nuevaClase.horarioInicioForm);
        const finDate = new Date(nuevaClase.horarioFinForm);

        if (isNaN(inicioDate.getTime()) || isNaN(finDate.getTime())) {
            setError("Las fechas/horas de inicio y fin no son válidas.");
            return;
        }

        if (finDate <= inicioDate) {
            setError("La hora de fin debe ser posterior a la hora de inicio.");
            return;
        }

        // 2. Calcular DuracionMinutos
        const diffMs = finDate.getTime() - inicioDate.getTime();
        const duracionMinutos = Math.round(diffMs / 60000); // 60000 ms en 1 minuto

        // 3. Formatear Fecha y HoraInicio para C#
        const fecha = nuevaClase.horarioInicioForm.split('T')[0]; // YYYY-MM-DD
        const horaInicio = nuevaClase.horarioInicioForm.split('T')[1]; // HH:mm

        // 4. Construir Payload para el Backend (CreateClaseRequest / UpdateClaseRequest)
        const payload = {
            // CAMPOS DE ID Y TEXTO
            profesorId: parseInt(nuevaClase.profesorId, 10),
            salaId: parseInt(nuevaClase.salaId, 10),
            sucursalId: sucursalId,
            nombre: nuevaClase.nombre.trim(),
            descripcion: nuevaClase.descripcion.trim(),
            imagen: nuevaClase.imagen || null,
            tipo: nuevaClase.tipo,
            
            // CAMPOS NUMÉRICOS Y BOOLEANOS
            duracionMinutos: duracionMinutos, // CALCULADO
            capacidad: parseInt(nuevaClase.capacidad, 10) || 0,
            mostrarEnHome: nuevaClase.mostrarEnHome,
            
            // CAMPOS DE FECHA/HORA (DateOnly y TimeOnly en C#)
            fecha: fecha, // YYYY-MM-DD
            horaInicio: `${horaInicio}:00`, // HH:mm:ss (TimeOnly espera segundos)
            
            // CAMPO DE LISTA
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

    if (clasesLoading || loadingDependencies) return <p>Cargando clases...</p>;

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
                <input
                    className="clases-input"
                    type="number"
                    name="capacidad"
                    placeholder="Capacidad (Cupo máximo)"
                    value={nuevaClase.capacidad}
                    onChange={handleChange}
                />
                
                {/* CAMBIO: Se usa horarioInicioForm */}
                <input
                    className="clases-input"
                    type="datetime-local"
                    name="horarioInicioForm"
                    placeholder="Fecha y Hora de Inicio (*)"
                    value={nuevaClase.horarioInicioForm}
                    onChange={handleChange}
                />
                {/* CAMBIO: Se usa horarioFinForm */}
                <input
                    className="clases-input"
                    type="datetime-local"
                    name="horarioFinForm"
                    placeholder="Fecha y Hora de Fin (*)"
                    value={nuevaClase.horarioFinForm}
                    onChange={handleChange}
                />

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
                
                {/* NUEVO CAMPO: Tipo de Clase */}
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

                <select
                    className="clases-input"
                    name="salaId"
                    value={nuevaClase.salaId}
                    onChange={handleChange}
                >
                    <option value="">Seleccionar sala (*)</option>
                    {salas.map((s) => (
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
                                const profesor = profesoresSucursal.find(
                                    (p) => p.id === c.profesorId
                                );
                                const nombreProfesor = profesor
                                    ? `${profesor.nombre} ${profesor.apellido}`
                                    : "Sin asignar";
                                
                                // --- CAMBIO CLAVE: Usamos HorarioInicio y HorarioFin que el backend envía ---
                                
                                // Extrae HH:mm de "YYYY-MM-DDTHH:mm:ss"
                                const horaInicioStr = c.horarioInicio
                                    ? c.horarioInicio.substring(11, 16)
                                    : "N/A";

                                // Extrae HH:mm de "YYYY-MM-DDTHH:mm:ss"
                                const horaFinStr = c.horarioFin
                                    ? c.horarioFin.substring(11, 16)
                                    : "N/A";
                                
                                // -----------------------------------------------------------------------------

                                return (
                                    <li key={c.id} className="clase-item">
                                        <div className="clase-list-info">
                                            <strong>{c.nombre} ({c.tipo})</strong>
                                        </div>
                                        <div className="clase-list-info">Sala {c.salaId}</div> 
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