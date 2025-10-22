import React, { useEffect, useState } from "react";
import "../../../styles/pages/adminSucursal/usuariosSucursalSection.css";
import { getUsuariosSucursal, updateUserSucursal } from "../../../services/api";
import { usePlanes } from "../../../hooks/useApi"; //

const UsuariosSucursalSection = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const { planes, loading: loadingPlanes } = usePlanes();

  const [filterNombre, setFilterNombre] = useState("");
  const [filterApellido, setFilterApellido] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [filterTel, setFilterTel] = useState("");
  const [filterDni, setFilterDni] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const sucursalId = storedUser?.sucursalId;

  // === Obtener usuarios ===
  useEffect(() => {
    const fetchUsuarios = async () => {
      if (!sucursalId) return;
      try {
        const data = await getUsuariosSucursal(sucursalId);
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
    fetchUsuarios();
  }, [sucursalId]);

  const toggleExpanded = (id) => {
    setExpandedUserId(expandedUserId === id ? null : id);
  };

  // === Dar de baja / alta ===
  const handleToggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";
    const confirmMsg =
      estadoActual === "activo"
        ? "¿Desea dar de baja a este usuario?"
        : "¿Desea dar de alta a este usuario?";

    if (window.confirm(confirmMsg)) {
      try {
        await updateUserSucursal(id, { estado: nuevoEstado });
        setUsuarios((prev) =>
          prev.map((u) => (u.id === id ? { ...u, estado: nuevoEstado } : u))
        );
      } catch (error) {
        console.error("Error actualizando estado del usuario:", error);
      }
    }
  };

  // === Filtros ===
  const filteredUsers = usuarios.filter(
    (u) =>
      u.nombre?.toLowerCase().includes(filterNombre.toLowerCase()) &&
      u.lastname?.toLowerCase().includes(filterApellido.toLowerCase()) &&
      u.email?.toLowerCase().includes(filterEmail.toLowerCase()) &&
      u.plan?.toLowerCase().includes(filterPlan.toLowerCase()) &&
      u.telNumber?.toLowerCase().includes(filterTel.toLowerCase()) &&
      u.dni?.toString().includes(filterDni) &&
      (filterEstado === "" || u.estado === filterEstado)
  );

  const renderUserDetails = (user) => (
    <div className="usuario-sucursal-detalles">
      <p>DNI: {user.dni}</p>
      <p>Teléfono: {user.telNumber}</p>
      <p>Dirección: {user.direccion}</p>
      <p>Género: {user.genero}</p>
      <p>Fecha Nac.: {user.fechaNacimiento}</p>
      <p>Plan: {user.plan || "Sin plan"}</p>
    </div>
  );

  return (
    <section className="usuarios-sucursal-section">
      <div className="usuarios-sucursal-header">
        <h2 className="usuarios-sucursal-title">Usuarios de mi Sucursal</h2>

        {/* === FILTROS === */}
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
            disabled={loadingPlanes} // mientras carga los planes
          >
            <option value="">Todos los planes</option>
            {planes.map((p) => (
              <option key={p.id || p.nombre} value={p.nombre || p}>
                {p.nombre || p}
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
        <h3 className="usuarios-sucursal-subtitulo">CLIENTES</h3>

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
                  {user.nombre} {user.lastname}
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
