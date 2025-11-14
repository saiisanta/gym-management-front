import React, { useState, useEffect, useMemo } from "react";
import "../../../styles/pages/adminSucursal/usuariosSucursalSection.css";

import { usePlanes, useUsuariosSucursal, useReservas, useClases } from "../../../hooks/useApi";
import { mapPlanIdToName } from "../../../utils/PlanMapper";

const UsuariosSucursalSection = ({ sucursalId: propSucursalId }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const sucursalId = propSucursalId ?? storedUser?.sucursalId ?? null;

  const { usuarios = [], loading: loadingUsuarios, toggleEstadoUsuario } =
    useUsuariosSucursal(sucursalId);

  const { planes = [], loading: loadingPlanes } = usePlanes();
  const { clases = [], loading: loadingClases } = useClases(sucursalId);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlumnoId, setSelectedAlumnoId] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [expandedReservaId, setExpandedReservaId] = useState(null);

  // Filtros
  const [filterNombre, setFilterNombre] = useState("");
  const [filterApellido, setFilterApellido] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [filterTel, setFilterTel] = useState("");
  const [filterDni, setFilterDni] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  useEffect(() => {
    if (!sucursalId) setExpandedUserId(null);
  }, [sucursalId]);

  const toggleExpanded = (id) => {
    setExpandedUserId(expandedUserId === id ? null : id);
  };

  const handleToggleEstado = async (id, estado) => {
    const confirmMsg =
      estado === "activo"
        ? "¿Desea dar de baja a este usuario?"
        : "¿Desea dar de alta a este usuario?";
    if (window.confirm(confirmMsg)) {
      try {
        await toggleEstadoUsuario(id, estado);
      } catch (error) {
        console.error("Error actualizando estado del usuario:", error);
      }
    }
  };

  const handleOpenReservasModal = (alumnoId) => {
    setSelectedAlumnoId(alumnoId);
    setModalOpen(true);
  };

  const handleCloseReservasModal = () => {
    setModalOpen(false);
    setSelectedAlumnoId(null);
    setExpandedReservaId(null);
  };

  const { reservas = [], loading: loadingReservas, editReserva, removeReserva } =
    useReservas({ alumnoId: selectedAlumnoId });

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Deseás eliminar esta reserva?")) return;
    try {
      await removeReserva(id);
    } catch (err) {
      console.error("Error eliminando reserva:", err);
      alert("No se pudo eliminar la reserva.");
    }
  };

  const handleCambiarEstado = async (reserva) => {
    const nuevoEstado =
      reserva.estado === "confirmada" ? "cancelada" : "confirmada";
    const msg = `Confirmás cambiar el estado a '${nuevoEstado}'?`;
    if (!window.confirm(msg)) return;
    try {
      await editReserva(reserva.id, { ...reserva, estado: nuevoEstado });
    } catch (err) {
      console.error("Error actualizando reserva:", err);
      alert("No se pudo actualizar la reserva.");
    }
  };

  if (!sucursalId) {
    return (
      <section className="usuarios-sucursal-section">
        <div style={{ padding: 20 }}>
          <h2 className="usuarios-sucursal-title">Usuarios de la Sucursal</h2>
          <p>Por favor seleccioná una sucursal para ver sus usuarios.</p>
        </div>
      </section>
    );
  }

  const filteredUsers = usuarios.filter((u) => {
    const nombre = (u.nombre || "").toLowerCase();
    const apellido = (u.apellido || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const planName =
      typeof u.plan === "number" ? mapPlanIdToName(u.plan) : u.plan || "";
    const telefonoStr = String(u.telefono || u.telNumber || "").toLowerCase();
    const dniStr = u.dni?.toString() || "";

    return (
      nombre.includes(filterNombre.toLowerCase()) &&
      apellido.includes(filterApellido.toLowerCase()) &&
      email.includes(filterEmail.toLowerCase()) &&
      planName.toLowerCase().includes(filterPlan.toLowerCase()) &&
      telefonoStr.includes(filterTel.toLowerCase()) &&
      dniStr.includes(filterDni) &&
      (filterEstado === "" || u.estado === filterEstado)
    );
  });

  // 🔹 Mapeamos reservas con nombre de clase
  const reservasConClases = useMemo(() => {
    return reservas.map((r) => {
      const clase = clases.find((c) => c.id === r.claseId);
      return {
        ...r,
        claseNombre: clase ? clase.nombre : "Clase desconocida",
      };
    });
  }, [reservas, clases]);

  const renderUserDetails = (user) => (
    <div className="usuario-sucursal-detalles">
      <p>DNI: {user.dni}</p>
      <p>Teléfono: {user.telefono || user.telNumber}</p>
      <p>Dirección: {user.direccion}</p>
      <p>Género: {user.genero}</p>
      <p>Fecha Nac.: {user.fechaNacimiento}</p>
      <p>
        Plan:{" "}
        {typeof user.plan === "number"
          ? mapPlanIdToName(user.plan)
          : user.plan || "Sin plan"}
      </p>
    </div>
  );

  if (loadingUsuarios) return <p>Cargando usuarios...</p>;

  return (
    <section className="usuarios-sucursal-section">
      <div className="usuarios-sucursal-header">
        <h2 className="usuarios-sucursal-title">Usuarios de mi Sucursal</h2>

        <div className="usuarios-sucursal-filtros">
          <input
            className="usuarios-sucursal-input"
            placeholder="Nombre"
            value={filterNombre}
            onChange={(e) => setFilterNombre(e.target.value)}
          />
          <input
            className="usuarios-sucursal-input"
            placeholder="Apellido"
            value={filterApellido}
            onChange={(e) => setFilterApellido(e.target.value)}
          />
          <input
            className="usuarios-sucursal-input"
            placeholder="Email"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
          />
          <select
            className="usuarios-sucursal-input"
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            disabled={loadingPlanes}
          >
            <option value="">Todos los planes</option>
            {planes.map((p) => (
              <option key={p.id} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>
          <input
            className="usuarios-sucursal-input"
            placeholder="Teléfono"
            value={filterTel}
            onChange={(e) => setFilterTel(e.target.value)}
          />
          <input
            className="usuarios-sucursal-input"
            placeholder="DNI"
            value={filterDni}
            onChange={(e) => setFilterDni(e.target.value)}
          />
          <select
            className="usuarios-sucursal-input"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      <div className="usuarios-sucursal-sections-wrapper">
        <h3 className="usuarios-sucursal-subtitulo">Clientes</h3>

        <div className="usuarios-sucursal-card">
          {filteredUsers.map((user) => (
            <div className="usuario-sucursal-item" key={user.id}>
              <img
                src={user.image || "https://placehold.co/100x100?text=User"}
                alt={user.nombre}
                className="usuario-sucursal-avatar"
              />
              <div className="usuario-sucursal-info">
                <span className="usuario-sucursal-nombre">
                  {user.nombre} {user.apellido || user.lastname}
                </span>
                <span className="usuario-sucursal-email">{user.email}</span>
                <span
                  className={`usuario-sucursal-estado ${
                    user.estado === "activo" ? "activo" : "inactivo"
                  }`}
                >
                  {user.estado}
                </span>
              </div>
              <div className="usuario-sucursal-actions">
                <button
                  className="ver-detalles-btn"
                  onClick={() => toggleExpanded(user.id)}
                >
                  {expandedUserId === user.id ? "Ver menos" : "Ver detalles"}
                </button>
                <button
                  className="ver-reservas-btn"
                  onClick={() => handleOpenReservasModal(user.id)}
                >
                  Reservas
                </button>
                <button
                  className={
                    user.estado === "activo" ? "dar-baja-btn" : "dar-alta-btn"
                  }
                  onClick={() => handleToggleEstado(user.id, user.estado)}
                >
                  {user.estado === "activo" ? "Dar de baja" : "Dar de alta"}
                </button>
              </div>
              {expandedUserId === user.id && renderUserDetails(user)}
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div
          className="reservas-modal-backdrop"
          onClick={handleCloseReservasModal}
        >
          <div className="reservas-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reservas-modal-header">
              <h3>
                Reservas de{" "}
                {usuarios.find((u) => u.id === selectedAlumnoId)?.nombre ||
                  "Usuario"}
              </h3>
              <button className="cerrar-modal-btn" onClick={handleCloseReservasModal}>
                ×
              </button>
            </div>

            {loadingReservas || loadingClases ? (
              <p>Cargando reservas...</p>
            ) : reservasConClases.length === 0 ? (
              <p>No hay reservas para este usuario.</p>
            ) : (
              reservasConClases.map((res) => (
                <div className="reserva-item" key={res.id}>
                  <div className="reserva-info">
                    <span className={`reserva-estado ${res.estado}`}>
                      {res.estado} - {res.claseNombre}
                    </span>
                    <span className="reserva-fecha">{res.fecha}</span>
                  </div>

                  <div className="reserva-actions">
                    <button
                      className="ver-detalles-btn"
                      onClick={() =>
                        setExpandedReservaId(
                          expandedReservaId === res.id ? null : res.id
                        )
                      }
                    >
                      {expandedReservaId === res.id
                        ? "Ocultar detalles"
                        : "Ver detalles"}
                    </button>
                    <button
                      className="cambiar-estado-btn"
                      onClick={() => handleCambiarEstado(res)}
                    >
                      Cambiar estado
                    </button>
                    <button
                      className="eliminar-btn"
                      onClick={() => handleEliminar(res.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                  {expandedReservaId === res.id && (
                    <div className="reserva-detalles">
                      <p>
                        <strong>Clase:</strong> {res.claseNombre}
                      </p>
                      <p>
                        <strong>Fecha:</strong> {res.fechaReserva}
                      </p>
                      <p>
                        <strong>Creado:</strong> {res.createdAt}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default UsuariosSucursalSection;
