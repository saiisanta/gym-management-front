import React, { useState, useMemo, useEffect, useCallback, useContext } from "react";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineCheckCircleOutline, MdCancel } from "react-icons/md";
import { useClases } from "../../../hooks/useApi/useClases"; 
import { useReservas } from "../../../hooks/useApi/useReservas";
import { toast } from "react-toastify";
import "../../../styles/pages/cliente/clasesCliente.css";
import { useLoading } from "../../../context/LoadingContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const useAuth = () => useContext(AuthContext); 

const ReservaCard = ({ reserva, clase, onCancelReserva }) => {
  if (!clase) return null;

  const inicio = new Date(clase.horarioInicio).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const fin = new Date(clase.horarioFin).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const fechaReserva = new Date(reserva.fechaReserva).toLocaleDateString();

  const horaInicioClase = new Date(clase.horarioInicio);
  const ahora = new Date();
  
  const UNA_HORA_EN_MS = 60 * 60 * 1000; 
  
  const puedeCancelar = (horaInicioClase.getTime() - ahora.getTime()) > UNA_HORA_EN_MS;
  
  const handleCancel = () => {
      onCancelReserva(reserva, clase);
  }

  return (
    <div className="clase-card reserva-card">
      <div className="clase-info">
        <h3 className="reserva-title">{clase.nombre}</h3>
        <p className="clase-descripcion">
          <MdOutlineCheckCircleOutline size={20} className="reserva-icon" />{" "}
          Reserva Confirmada
        </p>
        <div className="clase-meta">
          <span className="clase-tipo">{clase.tipo}</span>
          <span className="clase-cupo">
            Días: {clase.dias.join(", ")}
          </span>
        </div>
        <div className="clase-horario">
          <strong>
            {inicio} - {fin}
          </strong>
        </div>
        <p className="reserva-date">Reservado el: {fechaReserva}</p>
        
        <button
            className={`btn-cancelar ${!puedeCancelar ? "disabled" : ""}`}
            onClick={handleCancel}
            disabled={!puedeCancelar}
        >
          <MdCancel /> {puedeCancelar ? "Cancelar Reserva" : "No se puede cancelar (Límite: 1h)"}
        </button>
      </div>
    </div>
  );
};



const ClasesCliente = ({ sucursalId }) => {
  const { showLoading, hideLoading, isLoading } = useLoading();
  const navigate = useNavigate();

  const { user } = useAuth();
  const usuarioId = user?.id;

  const { clases, loading: loadingClases, updateClase } = useClases(sucursalId); 
  const {
    reservas,
    loading: loadingReservas,
    addReserva,
    deleteReserva,
  } = useReservas({ alumnoId: usuarioId });

  // Estado local
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

  const handleNavigate = useCallback((path) => {
    showLoading();
    setTimeout(() => {
      navigate(path);
      hideLoading();
    }, 500);
  }, [navigate, showLoading, hideLoading]);

  const clasesReservadasIds = useMemo(() => {
    return new Set(reservas.map((r) => r.claseId));
  }, [reservas]);

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
    return reservas
      .map((reserva) => {
        const clase = clases.find((c) => c.id === reserva.claseId);
        if (clase) {
            return { reserva, clase };
        }
        return null;
      })
      .filter((item) => item);

  }, [reservas, clases]); 
  
  const handleInscribirse = useCallback(
    async (clase) => {
      if (!usuarioId) {
          toast.error("Debes iniciar sesión para inscribirte en una clase.");
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
          fechaReserva: new Date().toISOString(),
          estado: "confirmada",
          createdAt: new Date().toISOString(),
        };
        await addReserva(nuevaReserva);

        const nuevoCupo = cuposActuales + 1;
        await updateClase(clase.id, {
          cuposActuales: nuevoCupo,
        });

        toast.success(`🎉 ¡Reserva exitosa! Te anotaste en "${clase.nombre}".`);
      } catch (error) {
        toast.error("Ocurrió un error al intentar inscribirte.");
        console.error("Error al inscribir:", error);
      } finally {
        hideLoading();
      }
    },
    [usuarioId, clasesReservadasIds, addReserva, updateClase, showLoading, hideLoading]
  );
  
  const handleCancelReserva = useCallback(
    async (reserva, clase) => {
      showLoading();
      try {
        await deleteReserva(reserva.id);

        const cuposActuales = clase.cuposActuales || 1;
        const nuevoCupo = Math.max(0, cuposActuales - 1);
        
        await updateClase(clase.id, {
          cuposActuales: nuevoCupo,
        });

        toast.success(`❌ Reserva de "${clase.nombre}" cancelada correctamente.`);
      } catch (error) {
        toast.error("Ocurrió un error al cancelar la reserva.");
        console.error("Error al cancelar reserva:", error);
      } finally {
        hideLoading();
      }
    },
    [deleteReserva, updateClase, showLoading, hideLoading]
  );

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

          <div className="clases-grid">
            {!sucursalId ? (
                <p>Por favor, selecciona una sucursal para ver las clases disponibles.</p>
            ) : clasesFiltradas.length === 0 && !loadingClases ? (
              <p>No hay clases disponibles que coincidan con los filtros en tu sucursal.</p>
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

                      <button
                        className="btn-inscribirse"
                        onClick={() => handleInscribirse(clase)}
                        disabled={cupoLleno || estaReservada || !usuarioId}
                      >
                        {cupoLleno
                          ? "Cupo completo"
                          : estaReservada
                          ? "Ya inscripto"
                          : !usuarioId
                          ? "Inicia sesión"
                          : "Anotarme"}
                      </button>
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
            <p>Aún no tienes clases reservadas en esta sucursal. ¡Anótate en alguna!</p>
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
    </div>
  );
};

export default ClasesCliente;