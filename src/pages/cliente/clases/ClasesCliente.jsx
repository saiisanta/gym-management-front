import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineCheckCircleOutline, MdCancel, MdInfoOutline, MdWarning, MdGpsFixed } from "react-icons/md";
import { useClases } from "../../../hooks/useApi/useClases";
import { useReservas } from "../../../hooks/useApi/useReservas";
import { toast } from "react-toastify";
import "../../../styles/pages/cliente/clasesCliente.css";
import { useLoading } from "../../../context/LoadingContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
// Importar del PlanMapper actualizado
import {
  PLAN_RESTRICTIONS,
  PLAN_IDS,
  mapPlanIdToName,
} from "../../../utils/PlanMapper";

const useAuth = () => useContext(AuthContext);

// --- HOOK DE RESTRICCIONES DEL PLAN ---
const usePlanRestrictions = (user, reservasCount) => {
  // Aseguramos que planId sea un número o null. Si es 0 o undefined, es null.
  const planId = user?.planId ? Number(user.planId) : null;
  
  // Si no hay planId, usamos el objeto 'Sin Plan' (maxReservas: 0)
  const restrictions =
    planId && PLAN_RESTRICTIONS[planId]
      ? PLAN_RESTRICTIONS[planId]
      : { maxReservas: 0, tiposPermitidos: [], nombre: "Sin Plan" };

  const planName = mapPlanIdToName(planId);
  // La condición para Sin Plan sigue siendo: maxReservas === 0
  const canReserveMore = reservasCount < restrictions.maxReservas; 

  const maxReservasText =
    restrictions.maxReservas === Infinity
      ? "sin límite"
      : `${restrictions.maxReservas} clase${
          restrictions.maxReservas !== 1 ? "s" : ""
        }`;

  const canEnroll = useCallback(
    (claseTipo) => {
      // **Ajuste para asegurar la detección de Sin Plan**
      if (!planId || planId === 0) return { allowed: false, reason: "Sin Plan" };

      if (!restrictions.tiposPermitidos.includes(claseTipo)) {
        return { allowed: false, reason: "Clase no permitida" };
      }
      if (!canReserveMore) {
        return { allowed: false, reason: "Límite de reservas alcanzado" };
      }

      return { allowed: true, reason: "" };
    },
    [planId, canReserveMore, restrictions.tiposPermitidos, restrictions]
  );
  return {
    planId,
    planName,
    restrictions,
    reservasCount,
    canReserveMore,
    maxReservasText,
    canEnroll,
  };
};
// ------------------------------------

// --- COMPONENTE DE BOTÓN CON LÓGICA DE ESTADO (Emojis eliminados) ---
const ClaseCardButton = ({
  clase,
  estaReservada,
  cupoLleno,
  planRestrictions,
  handleInscribirse,
}) => {
  const { planId, reservasCount, canEnroll } = planRestrictions;

  if (!planId || planId === 0) {
    return (
      <button
        className="btn-inscribirse btn-disabled plan-no-activo"
        disabled
        title="Debes tener un plan activo para reservar clases."
      >
        Sin Plan
      </button>
    );
  }

  if (cupoLleno) {
    return (
      <button className="btn-inscribirse btn-disabled cupo-lleno" disabled>
        Cupo completo
      </button>
    );
  }

  if (estaReservada) {
    return (
      <button className="btn-inscribirse btn-reservada" disabled>
        <MdOutlineCheckCircleOutline style={{ marginRight: 5 }} size={18} /> Ya inscripto
      </button>
    );
  }

  // Verificar restricciones del plan (límite y tipo de clase)
  const { allowed, reason } = canEnroll(clase.tipo);

  if (!allowed) {
    let buttonText = reason;
    let className = "btn-disabled";
    
    if (reason === "Límite de reservas alcanzado") {
      className += " limit-reached";
      buttonText = `Límite (${reservasCount})`;
    } else if (reason === "Clase no permitida") {
       className += " clase-not-allowed";
       buttonText = "No Permitida";
    }

    return (
      <button
        className={`btn-inscribirse ${className}`}
        title={`Restricción: ${reason}. Consulta tu plan ${planRestrictions.planName}.`}
        disabled
      >
        {buttonText}
      </button>
    );
  }

  // Si todo está permitido
  return (
    <button
      className="btn-inscribirse btn-active"
      onClick={() => handleInscribirse(clase)}
    >
      Anotarme
    </button>
  );
};
// ------------------------------------

// Componentes auxiliares (ReservaCard)
const ReservaCard = ({ reserva, clase, onCancelReserva }) => {
  if (!clase) return null;
  // ... (El cuerpo del componente ReservaCard, sin cambios)
  const inicio = new Date(clase.horarioInicio).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const fin = new Date(clase.horarioFin).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const fechaReserva = new Date(
    reserva.fechaReserva || reserva.createdAt
  ).toLocaleDateString();
  const handleCancel = () => {
    if (window.confirm(`¿Deseas cancelar la reserva de "${clase.nombre}"?`)) {
      onCancelReserva(reserva, clase);
    }
  };
  return (
    <div className="clase-card reserva-card">
      <div className="clase-info">
        <h3 className="reserva-title">{clase.nombre}</h3>
        <p className="clase-descripcion">
          <MdOutlineCheckCircleOutline size={20} className="reserva-icon" />
          Reserva Confirmada
        </p>
        <div className="clase-meta">
          <span className="clase-tipo">{clase.tipo}</span>
        </div>
        <div className="clase-dias">
          {(clase.dias || []).map((dia, i) => (
            <span key={i} className="clase-dia">
              {dia}
            </span>
          ))}
        </div>
        <div className="clase-horario">
          <strong>
            {inicio} - {fin}
          </strong>
        </div>
        <p className="reserva-date">Reservado el: {fechaReserva}</p>
        <button className="btn-cancelar" onClick={handleCancel}>
          <MdCancel style={{ marginRight: 6 }} /> Cancelar Reserva
        </button>
      </div>
    </div>
  );
};

// Componente HistorialCard (Mejorado para mostrar fecha y hora de la reserva)
const HistorialCard = ({ clase, reserva }) => {
  // 1. Extraer la fecha de la clase (ya que se agrupa por día)
  const fechaClase = new Date(clase.horarioInicio).toLocaleDateString('es-AR', {
      weekday: 'short', // Ej: Lun, Mar
      month: 'numeric',
      day: 'numeric',
  });
  
  // 2. Extraer los horarios de la clase
  const inicioClase = new Date(clase.horarioInicio).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
  });
  const finClase = new Date(clase.horarioFin).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
  });
  
  // 3. Opcional: Mostrar fecha y hora en que se hizo la reserva (createdAt)
  const fechaReserva = new Date(reserva.createdAt || reserva.fechaReserva).toLocaleDateString();

  return (
      <div className="historial-card large-row-style"> 
          
          {/* 1. Contenedor de la Imagen y Hora */}
          <div className="historial-img-wrap">
              <img src={clase.imagen} alt={clase.nombre} className="historial-img" />
              <div className="historial-time-overlay">
                  {/* Muestra el rango de hora de la clase */}
                  <strong>{inicioClase} - {finClase}</strong> 
              </div>
          </div>

          {/* 2. Contenedor de los Metadatos (A la derecha de la imagen) */}
          <div className="historial-meta-details">
              <h4 className="historial-title large-title">{clase.nombre}</h4>
              <div className="historial-sub type-badge">
                  Tipo: <strong>{clase.tipo}</strong>
              </div>
              <div className="historial-sub description-text">
                  {clase.descripcion.substring(0, 70)}... {/* Descripción corta */}
              </div>
              <div className="historial-sub reservation-info">
                  *Reservado el: {fechaReserva}
              </div>
          </div>
      </div>
  );
};

const ClasesCliente = ({ sucursalId }) => {
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const { user } = useAuth();
  const usuarioId = user?.id;

  const { clases, loading: loadingClases, updateClase } = useClases(sucursalId);
  const {
    reservas,
    loading: loadingReservas,
    addReserva,
    removeReserva,
  } = useReservas({ alumnoId: usuarioId }); 

  const [filterTipo, setFilterTipo] = useState("");
  const [filterNombre, setFilterNombre] = useState("");
  const [orden, setOrden] = useState("asc");
  const [activeTab, setActiveTab] = useState("clases");

  useEffect(() => {
    if (loadingClases || loadingReservas) {
      showLoading();
    } else {
      hideLoading();
    }
    return () => {
      hideLoading();
    };
  }, [loadingClases, loadingReservas, showLoading, hideLoading]);

  const handleNavigate = useCallback(
    (path) => {
      showLoading();
      setTimeout(() => {
        navigate(path);
        hideLoading();
      }, 500);
    },
    [navigate, showLoading, hideLoading]
  );

  const clasesReservadasIds = useMemo(() => {
    return new Set((reservas || []).map((r) => r.claseId));
  }, [reservas]);

  // Contar reservas para las restricciones
  const reservasCount = useMemo(() => {
    const availableClaseIds = new Set(clases.map((c) => c.id));
    return (reservas || [])
      .filter((r) => availableClaseIds.has(r.claseId))
      .length;
  }, [reservas, clases]);

  // ✅ INTEGRACIÓN DEL HOOK DE PERMISOS
  const planRestrictions = usePlanRestrictions(user, reservasCount);

  const clasesFiltradas = useMemo(() => {
    let filtradas = clases || [];

    if (filterTipo) {
      filtradas = filtradas.filter((c) => c.tipo === filterTipo);
    }

    if (filterNombre.trim() !== "") {
      filtradas = filtradas.filter((c) =>
        c.nombre.toLowerCase().includes(filterNombre.toLowerCase())
      );
    }

    return filtradas.sort((a, b) =>
      orden === "asc"
        ? a.nombre.localeCompare(b.nombre)
        : b.nombre.localeCompare(a.nombre)
    );
  }, [clases, filterTipo, filterNombre, orden]);

  const clasesReservadas = useMemo(() => {
    return (reservas || [])
      .map((reserva) => {
        const clase = (clases || []).find((c) => c.id === reserva.claseId);
        if (clase) {
          return { reserva, clase };
        }
        return null;
      })
      .filter((item) => item);
  }, [reservas, clases]);

  // ✅ Lógica de inscripción mejorada con chequeo de permisos (Emojis eliminados)
  const handleInscribirse = useCallback(
    async (clase) => {
      if (!usuarioId) {
        toast.error("Debes iniciar sesión para inscribirte en una clase.");
        return;
      }

      // Chequeo de permisos del plan ANTES de intentar reservar
      const { allowed, reason } = planRestrictions.canEnroll(clase.tipo);
      if (!allowed) {
        toast.warn(
          `No puedes inscribirte: ${reason}. Considera actualizar tu plan.`
        );
        return;
      }

      const cuposActuales = clase.cuposActuales || 0;
      const cupoMaximo = parseInt(clase.cupoMaximo);

      if (cuposActuales >= cupoMaximo) {
        toast.warn("Cupo máximo alcanzado, no es posible inscribirse.");
        return;
      }

      if (clasesReservadasIds.has(clase.id)) {
        toast.info("Ya estás inscripto en esta clase.");
        return;
      }

      showLoading();
      try {
        const nuevaReserva = {
          alumnoId: usuarioId,
          claseId: clase.id,
          fechaReserva: new Date().toISOString(), // Usar para compatibilidad
          estado: "confirmada",
          createdAt: new Date().toISOString(), // Mejor campo para fecha/hora real de reserva
        };
        await addReserva(nuevaReserva);

        const nuevoCupo = cuposActuales + 1;
        await updateClase(clase.id, {
          cuposActuales: nuevoCupo,
        });

        toast.success(`Reserva exitosa. Te anotaste en "${clase.nombre}".`);
      } catch (error) {
        toast.error("Ocurrió un error al intentar inscribirte.");
        console.error("Error al inscribir:", error);
      } finally {
        hideLoading();
      }
    },
    [
      usuarioId,
      clasesReservadasIds,
      addReserva,
      updateClase,
      showLoading,
      hideLoading,
      planRestrictions,
    ]
  );

  const handleCancelReserva = useCallback(
    async (reserva, clase) => {
      showLoading();
      try {
        await removeReserva(reserva.id);

        const cuposActuales = clase.cuposActuales ?? null;
        if (cuposActuales !== null) {
          const nuevoCupo = Math.max(0, cuposActuales - 1);
          await updateClase(clase.id, { cuposActuales: nuevoCupo });
        }

        toast.success(
          `Reserva de "${clase.nombre}" cancelada correctamente.`
        );
      } catch (error) {
        toast.error("Ocurrió un error al cancelar la reserva.");
        console.error("Error al cancelar reserva:", error);
      } finally {
        hideLoading();
      }
    },
    [removeReserva, updateClase, showLoading, hideLoading]
  );

  // Lógica para Historial agrupado (Corregida para agrupar por fecha de clase pasada)
  const historialAgrupado = useMemo(() => {
    const now = Date.now();
    const taken = (reservas || [])
      .map((r) => {
        const clase = (clases || []).find((c) => c.id === r.claseId);
        // Filtramos para incluir solo reservas de clases que ya pasaron
        if (clase && new Date(clase.horarioInicio).getTime() <= now) { 
          return { reserva: r, clase };
        }
        return null;
      })
      .filter(Boolean);

    // Ordenar por fecha de inicio de clase (más reciente primero)
    taken.sort((a, b) => {
      const ai = new Date(a.clase.horarioInicio).getTime();
      const bi = new Date(b.clase.horarioInicio).getTime();
      return bi - ai;
    });

    const groups = {};
    taken.forEach(({ reserva, clase }) => {
      // Usar la fecha de la clase para agrupar (como estaba)
      const dayKey = new Date(clase.horarioInicio).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
      if (!groups[dayKey]) groups[dayKey] = [];
      groups[dayKey].push({ reserva, clase });
    });

    const groupedArray = Object.keys(groups)
      .map((dateStr) => ({ date: dateStr, items: groups[dateStr] }))
      .sort((a, b) => {
        // Asegurar que los grupos de días estén ordenados correctamente
        const ad = new Date(a.items[0].clase.horarioInicio).getTime();
        const bd = new Date(b.items[0].clase.horarioInicio).getTime();
        return bd - ad;
      });

    return groupedArray;
  }, [reservas, clases]);

  // ✅ Función para renderizar el Banner de Información del Plan (Emojis eliminados)
  const renderPlanInfo = () => {
    const { planId, planName, reservasCount, maxReservasText, restrictions } =
      planRestrictions;

    let statusText = "";
    let statusClass = "";
    let icon = <MdInfoOutline size={20} />;

    if (!planId || planId === 0) {
      statusText =
        "Actualmente estás **Sin Plan**. Inscríbete a uno para poder reservar clases.";
      statusClass = "no-plan";
      icon = <MdCancel size={20} />;
    } else if (planId === PLAN_IDS.PREMIUM) {
      statusText =
        "**Plan Premium** activo. Tienes acceso ilimitado a todas las clases (generales y especializadas).";
      statusClass = "premium-plan";
      icon = <MdGpsFixed size={20} />;
    } else {
      const allowedTypes = restrictions.tiposPermitidos.join(", ");
      const limitText =
        maxReservasText === "sin límite"
          ? ""
          : `Reservas activas: **${reservasCount}** de ${maxReservasText}.`;

      statusText = `Tienes Plan **${planName}.** ${limitText} Puedes reservar clases de tipo:**${allowedTypes}.**`;
      statusClass = planRestrictions.canReserveMore
        ? "limited-plan"
        : "limit-reached";
      icon = planRestrictions.canReserveMore ? <MdWarning size={20} /> : <MdCancel size={20} />;
    }

    // Reemplazar **texto** por <strong>texto</strong>
    const formattedText = statusText.split('**').map((segment, index) => {
        return index % 2 === 1 ? <strong key={index}>{segment}</strong> : segment;
    });

    return (
      <div className={`plan-info-banner ${statusClass}`}>
        <p className="plan-info-text">
          {icon} {formattedText}
        </p>
        <p className="plan-info-upgrade">
          {planId && planId !== PLAN_IDS.PREMIUM && (
            <span> ¿Necesitas más? Considera actualizar al Plan Premium.</span>
          )}
        </p>
      </div>
    );
  };
  
  // --- RENDERING ---
  return (
    <div className="clases-section">
      <div className="clases-header">
        <Button
          className="clase-back-button clase-custom-button"
          onClick={() => handleNavigate("/dashboard")}
        >
          <FaArrowLeft size={24} />
        </Button>
        <h2 className="clases-title">Gestor de Clases y Reservas</h2>
      </div>

      <div className="clases-tabs">
        <button
          className={`tab-button ${activeTab === "clases" ? "active" : ""}`}
          onClick={() => setActiveTab("clases")}
        >
          Clases Disponibles
        </button>
        <button
          className={`tab-button ${activeTab === "reservas" ? "active" : ""}`}
          onClick={() => setActiveTab("reservas")}
        >
          Mis Reservas ({clasesReservadas.length})
        </button>
        <button
          className={`tab-button ${activeTab === "historial" ? "active" : ""}`}
          onClick={() => setActiveTab("historial")}
        >
          Historial
        </button>
      </div>

      {activeTab === "clases" && (
        <>
          <div className="clases-filtros">
            <input
              type="text"
              placeholder="Buscar clase..."
              value={filterNombre}
              onChange={(e) => setFilterNombre(e.target.value)}
              className="clase-filter-input"
            />
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="clase-filter-input"
            >
              <option value="">Todos los tipos</option>
              <option value="general">General</option>
              <option value="especializada">Especializada</option>
            </select>
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="clase-filter-input"
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>
          {renderPlanInfo()}
          <div className="clases-grid">
            {!sucursalId ? (
              <p>
                Por favor, selecciona una sucursal para ver las clases
                disponibles.
              </p>
            ) : clasesFiltradas.length === 0 && !loadingClases ? (
              <p>
                No hay clases disponibles que coincidan con los filtros en tu
                sucursal.
              </p>
            ) : (
              clasesFiltradas.map((clase) => {
                const cuposActuales = clase.cuposActuales || 0;
                const cupoMaximo = parseInt(clase.cupoMaximo);
                const cupoLleno = cuposActuales >= cupoMaximo;
                const estaReservada = clasesReservadasIds.has(clase.id);

                const inicio = new Date(clase.horarioInicio).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );
                const fin = new Date(clase.horarioFin).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={clase.id}
                    className={`clase-card ${cupoLleno ? "clase-llena" : ""}`}
                  >
                    <img
                      src={clase.imagen}
                      alt={clase.nombre}
                      className="clase-img"
                      loading="lazy"
                    />
                    <div className="clase-info">
                      <h3>{clase.nombre}</h3>
                      <p className="clase-descripcion">{clase.descripcion}</p>
                      <div className="clase-meta">
                        <span className="clase-tipo">{clase.tipo}</span>
                        <span className="clase-cupo">
                          Cupo: {cuposActuales}/{cupoMaximo}
                        </span>
                      </div>

                      <div className="clase-dias">
                        {clase.dias.map((dia, i) => (
                          <span key={i} className="clase-dia">
                            {dia}
                          </span>
                        ))}
                      </div>

                      <div className="clase-horario">
                        <strong>
                          {inicio} - {fin}
                        </strong>
                      </div>
                      <ClaseCardButton
                        clase={clase}
                        estaReservada={estaReservada}
                        cupoLleno={cupoLleno}
                        planRestrictions={planRestrictions}
                        handleInscribirse={handleInscribirse}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
      {activeTab === "reservas" && (
        <div className="clases-grid">
          {loadingReservas ? (
            <p>Cargando tus reservas...</p>
          ) : clasesReservadas.length === 0 ? (
            <p>
              Aún no tienes clases reservadas en esta sucursal. ¡Anótate en
              alguna!
            </p>
          ) : (
            clasesReservadas.map(({ reserva, clase }) => (
              <ReservaCard
                key={reserva.id}
                reserva={reserva}
                clase={clase}
                onCancelReserva={handleCancelReserva}
              />
            ))
          )}
        </div>
      )}
      
      {activeTab === "historial" && (
        <div className="historial-section">
          {historialAgrupado.length === 0 ? (
            <p>No hay historial de clases aún.</p>
          ) : (
            historialAgrupado.map((group) => (
              <div key={group.date} className="historial-group-container"> {/* Contenedor de grupo principal */}
                <div className="historial-day-header">{group.date}</div> {/* Header tipo fecha grande */}
                <div className="historial-grid"> {/* Grid para las tarjetas */}
                  {group.items.map(({ reserva, clase }) => (
                    <HistorialCard
                      key={reserva.id}
                      clase={clase}
                      reserva={reserva}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ClasesCliente;