// src/components/pages/superadmin/UsuariosSection.jsx
import React, { useState } from "react";
import { useUsuarios } from "../../../hooks/useApi/useUsuarios";
import { usePlanes } from "../../../hooks/useApi/usePlanes";
import { mapRoleIdToRole } from "../../../utils/RoleMapper";
import "../../../styles/pages/superadmin/usuariosSection.css";

const allRoleIds = [1, 2, 3, 4];

const UsuariosSection = () => {
  const { usuarios, updateUsuario, deleteUsuario, loading } = useUsuarios();
  const { planes } = usePlanes();

  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [editingPasswordId, setEditingPasswordId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);

  // Filtros
  const [filterNombre, setFilterNombre] = useState("");
  const [filterApellido, setFilterApellido] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterRol, setFilterRol] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [filterTel, setFilterTel] = useState("");
  const [filterDni, setFilterDni] = useState("");

  // Toggle expansión
  const toggleExpanded = (id) =>
    setExpandedUserId(expandedUserId === id ? null : id);

  // Edición de usuario
  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const handleSaveEdit = async () => {
    try {
      await updateUsuario(editedUser.id, editedUser);
      alert("Usuario actualizado correctamente");
      handleCancelEdit();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar usuario");
    }
  };

  // Cambio de contraseña
  const handlePasswordChange = async (id) => {
    if (!newPassword.trim()) return alert("Ingrese nueva contraseña");
    try {
      await updateUsuario(id, { password: newPassword });
      alert("Contraseña actualizada correctamente");
      setEditingPasswordId(null);
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar contraseña");
    }
  };

  // Eliminación de usuario
  const handleDelete = async (id) => {
    if (!window.confirm("¿Desea eliminar este usuario?")) return;
    try {
      await deleteUsuario(id);
      alert("Usuario eliminado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  };

  // Filtrado seguro
  const filteredUsers = usuarios.filter((u) => {
    const {
      nombre = "",
      lastname = "",
      email = "",
      roleId,
      plan = "",
      telNumber = "",
      dni = "",
    } = u;

    return (
      nombre.toLowerCase().includes(filterNombre.toLowerCase()) &&
      lastname.toLowerCase().includes(filterApellido.toLowerCase()) &&
      email.toLowerCase().includes(filterEmail.toLowerCase()) &&
      (filterRol === "" || roleId === parseInt(filterRol)) &&
      (filterPlan === "" || plan === filterPlan) &&
      telNumber.toLowerCase().includes(filterTel.toLowerCase()) &&
      dni.toLowerCase().includes(filterDni.toLowerCase())
    );
  });

  const staffUsers = filteredUsers.filter((u) => u.roleId <= 2);
  const normalUsers = filteredUsers.filter((u) => u.roleId > 2);

  // Render helpers
  const renderUserDetails = (user) => (
    <div className="usuario-detalles">
      <p><strong>DNI:</strong> {user.dni || "-"}</p>
      <p><strong>Género:</strong> {user.genero || "-"}</p>
      <p><strong>Fecha de nacimiento:</strong> {user.fechaNacimiento || "-"}</p>
      <p><strong>Dirección:</strong> {user.direccion || "-"}</p>
      <p>
        <strong>Estado:</strong>{" "}
        <span className={user.estado === "activo" ? "activo" : "inactivo"}>
          {user.estado || "-"}
        </span>
      </p>
    </div>
  );

  const renderUserRow = (user, isStaff = false) => {
    const isEditing = editingUserId === user.id;
    const currentData = isEditing ? editedUser : user;

    return (
      <div className="admin-item" key={user.id}>
        <img
          src={user.image || "https://placehold.co/120x120?text=User"}
          alt="perfil"
          className="usuario-avatar"
        />

        <input
          className="usuario-input"
          value={currentData.nombre || ""}
          disabled={isStaff || !isEditing}
          onChange={(e) => setEditedUser({ ...editedUser, nombre: e.target.value })}
        />
        <input
          className="usuario-input"
          value={currentData.lastname || ""}
          disabled={isStaff || !isEditing}
          onChange={(e) => setEditedUser({ ...editedUser, lastname: e.target.value })}
        />
        <input
          className="usuario-input"
          value={currentData.email || ""}
          disabled={isStaff || !isEditing}
          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
        />
        <input
          className="usuario-input"
          value={currentData.telNumber || ""}
          disabled={isStaff || !isEditing}
          onChange={(e) => setEditedUser({ ...editedUser, telNumber: e.target.value })}
        />

        <select
          className="usuario-input"
          value={currentData.roleId || ""}
          disabled={isStaff || !isEditing}
          onChange={(e) =>
            setEditedUser({ ...editedUser, roleId: parseInt(e.target.value) })
          }
        >
          {allRoleIds.map((id) => (
            <option key={id} value={id}>
              {mapRoleIdToRole(id)}
            </option>
          ))}
        </select>

        <select
          className="usuario-input"
          value={currentData.plan || ""}
          disabled={isStaff || !isEditing}
          onChange={(e) => setEditedUser({ ...editedUser, plan: e.target.value })}
        >
          <option value="">Sin plan</option>
          {planes.map((p) => (
            <option key={p.id} value={p.nombre}>
              {p.nombre}
            </option>
          ))}
        </select>

        <button 
          className="ver-mas-btn"
          onClick={() => toggleExpanded(user.id)}
        >
          {expandedUserId === user.id ? "Ver menos" : "Ver más"}
        </button>

        {expandedUserId === user.id && renderUserDetails(user)}

        {!isStaff && (
          <div className="admin-actions">
            {isEditing ? (
              <>
                <button onClick={handleSaveEdit}>Guardar</button>
                <button onClick={handleCancelEdit}>Cancelar</button>
              </>
            ) : (
              <button onClick={() => handleEditClick(user)}>Editar</button>
            )}

            {editingPasswordId === user.id ? (
              <>
                <input
                  className="password-update"
                  type="text"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={() => handlePasswordChange(user.id)}>Guardar</button>
                <button onClick={() => setEditingPasswordId(null)}>Cancelar</button>
              </>
            ) : (
              <button onClick={() => setEditingPasswordId(user.id)}>
                Cambiar Contraseña
              </button>
            )}

            <button className="btn-eliminar" onClick={() => handleDelete(user.id)}>
              Eliminar
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="usuarios-section">
      <div className="usuarios-header">
        <h2 className="usuarios-section-title">Gestión de Usuarios</h2>
        <div className="usuarios-filtros">
          <input
            className="usuario-filter-input"
            placeholder="Nombre"
            value={filterNombre}
            onChange={(e) => setFilterNombre(e.target.value)}
          />
          <input
            className="usuario-filter-input"
            placeholder="Apellido"
            value={filterApellido}
            onChange={(e) => setFilterApellido(e.target.value)}
          />
          <input
            className="usuario-filter-input"
            placeholder="Email"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
          />
          <select 
            className="usuario-filter-input"
            value={filterRol} 
            onChange={(e) => setFilterRol(e.target.value)}
          >
            <option value="">Todos los roles</option>
            {allRoleIds.map((id) => (
              <option key={id} value={id}>
                {mapRoleIdToRole(id)}
              </option>
            ))}
          </select>
          <select 
            className="usuario-filter-input"
            value={filterPlan} 
            onChange={(e) => setFilterPlan(e.target.value)}
          >
            <option value="">Todos los planes</option>
            {planes.map((p) => (
              <option key={p.id} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>
          <input
            className="usuario-filter-input"
            placeholder="Teléfono"
            value={filterTel}
            onChange={(e) => setFilterTel(e.target.value)}
          />
          <input
            className="usuario-filter-input"
            placeholder="DNI"
            value={filterDni}
            onChange={(e) => setFilterDni(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="usuarios-sections-wrapper">
          {staffUsers.length > 0 && (
            <>
              <h3 className="usuarios-subtitulo">STAFF</h3>
              <div className="usuarios-section-card">
                {staffUsers.map((user) => renderUserRow(user, true))}
              </div>
            </>
          )}
          {normalUsers.length > 0 && (
            <>
              <h3 className="usuarios-subtitulo">Usuarios</h3>
              <div className="usuarios-section-card">
                {normalUsers.map((user) => renderUserRow(user))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UsuariosSection;