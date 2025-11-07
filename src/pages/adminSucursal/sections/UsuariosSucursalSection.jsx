import React, { useState } from "react";
import "../../../styles/pages/adminSucursal/usuariosSucursalSection.css";
import { usePlanes, useUsuariosSucursal } from "../../../hooks/useApi";
import {mapPlanIdToName} from "../../../utils/PlanMapper"

const UsuariosSucursalSection = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const sucursalId = storedUser?.sucursalId;

  const { usuarios = [], loading: loadingUsuarios, toggleEstadoUsuario } =
    useUsuariosSucursal(sucursalId);

  const { planes = [], loading: loadingPlanes } = usePlanes();

  const [expandedUserId, setExpandedUserId] = useState(null);

  const [filterNombre, setFilterNombre] = useState("");
  const [filterApellido, setFilterApellido] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [filterTel, setFilterTel] = useState("");
  const [filterDni, setFilterDni] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

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

  const filteredUsers = usuarios.filter((u) => {
    const nombre = (u.nombre || "").toLowerCase();
    const apellido = (u.apellido || "").toLowerCase();
    const email = (u.email || "").toLowerCase();

    const planRaw = u.plan;
    const planName =
      typeof planRaw === "number"
        ? mapPlanIdToName(planRaw)
        : planRaw || "";

    const planLower = planName.toLowerCase();

    const telefonoStr = String(u.telefono || "").toLowerCase();

    const dniStr = u.dni?.toString() || "";

    return (
      nombre.includes(filterNombre.toLowerCase()) &&
      apellido.includes(filterApellido.toLowerCase()) &&
      email.includes(filterEmail.toLowerCase()) &&
      planLower.includes(filterPlan.toLowerCase()) &&
      telefonoStr.includes(filterTel.toLowerCase()) &&
      dniStr.includes(filterDni) &&
      (filterEstado === "" || u.estado === filterEstado)
    );
  });

  const renderUserDetails = (user) => (
    <div className="usuario-sucursal-detalles">
      <p>DNI: {user.dni}</p>
      <p>Teléfono: {user.telefono}</p>
      <p>Dirección: {user.direccion}</p>
      <p>Género: {user.genero}</p>
      <p>Fecha Nac.: {user.fechaNacimiento}</p>
      <p>Plan: {typeof user.plan === "number" ? mapPlanIdToName(user.plan) : user.plan || "Sin plan"}</p>
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
            {planes.map((p) => {
              const optionValue =
                typeof p === "object" ? p.nombre || String(p.id) : String(p);
              const optionKey =
                (typeof p === "object" && (p.id || p.nombre)) || String(p);
              const optionLabel =
                typeof p === "object" ? p.nombre || String(p.id) : String(p);
              return (
                <option key={optionKey} value={optionLabel}>
                  {optionLabel}
                </option>
              );
            })}
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
                  {user.nombre} {user.apellido}
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
    </section>
  );
};

export default UsuariosSucursalSection;
