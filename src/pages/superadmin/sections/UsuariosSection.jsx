// src/components/pages/superadmin/UsuariosSection.jsx
import React, { useState } from "react";
import { useUsuarios } from "../../../hooks/useApi/useUsuarios";
import { usePlanes } from "../../../hooks/useApi/usePlanes";
import { mapRoleIdToRole, mapBackendRoleToRoleId } from "../../../utils/RoleMapper";
import { mapPlanIdToName } from "../../../utils/PlanMapper";
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

  const toggleExpanded = (id) =>
    setExpandedUserId(expandedUserId === id ? null : id);

  // === EDITAR USUARIO ===
  const handleEditClick = (user) => {
    setEditingUserId(user.id);

    const planFromUser =
      user.plan ??
      user.planName ??
      (user.planId ? mapPlanIdToName(Number(user.planId)) : "") ??
      "";

    const apellidoFromUser = user.lastname ?? user.apellido ?? "";

    setEditedUser({
      id: user.id,
      nombre: user.nombre ?? user.Nombre ?? "",
      apellido: apellidoFromUser,
      email: user.email ?? user.Email ?? "",
      telNumber: user.telNumber ?? user.TelNumber ?? "",
      // mantenemos roleId numérico para el select
      roleId:
        user.roleId ??
        (user.role ? mapBackendRoleToRoleId(user.role) : undefined) ??
        undefined,
      // plan textual para el select
      plan: planFromUser,
      _originalPlan: planFromUser,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const handleSaveEdit = async () => {
    try {
      const payload = {};

      // Campos básicos (Palabras en PascalCase para backend)
      if ("nombre" in editedUser) payload.Nombre = editedUser.nombre;
      if ("apellido" in editedUser) {
        // enviar Apellido y por compatibilidad lastname también
        payload.Apellido = editedUser.apellido;
        payload.lastname = editedUser.apellido;
      }
      if ("email" in editedUser) payload.Email = editedUser.email;
      if ("telNumber" in editedUser) payload.Telefono = editedUser.telNumber;

      // ROLE: enviar RoleId (numérico). Backend suele preferir RoleId.
      if ("roleId" in editedUser && editedUser.roleId !== undefined) {
        payload.RoleId = Number(editedUser.roleId);
      }

      // PLAN: solo enviar si cambió con respecto a _originalPlan
      if ("plan" in editedUser) {
        const newPlan = editedUser.plan ?? "";
        const originalPlan = editedUser._originalPlan ?? "";

        if (newPlan !== originalPlan) {
          if (newPlan === "") {
            // borrar plan
            payload.Plan = "";
            payload.PlanId = null;
          } else {
            const found = planes.find((p) => p.nombre === newPlan);
            if (found) {
              payload.Plan = newPlan;
              payload.PlanId = found.id;
            } else {
              // plan textual desconocido: enviamos Plan (texto) sin id
              payload.Plan = newPlan;
            }
          }
        }
      }

      if (Object.keys(payload).length === 0) {
        handleCancelEdit();
        return;
      }

      await updateUsuario(editedUser.id, payload);

      alert("Usuario actualizado correctamente");
      handleCancelEdit();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar usuario");
    }
  };

  // === CAMBIAR CONTRASEÑA ===
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

  // === FILTRADO ===
  const filteredUsers = usuarios.filter((u) => {
    const nombre = u.nombre || u.Nombre || "";
    const apellido = u.apellido ?? u.Apellido ?? u.lastname ?? u.Lastname ?? "";
    const email = u.email ?? u.Email ?? "";
    const roleId = u.roleId ?? (u.role ? mapBackendRoleToRoleId(u.role) : 4);
    const plan = u.plan ?? u.planName ?? (u.planId ? mapPlanIdToName(Number(u.planId)) : "");
    const tel = u.telNumber ?? u.TelNumber ?? "";
    const dni = u.dni ?? u.Dni ?? "";

    return (
      nombre.toLowerCase().includes(filterNombre.toLowerCase()) &&
      apellido.toLowerCase().includes(filterApellido.toLowerCase()) &&
      email.toLowerCase().includes(filterEmail.toLowerCase()) &&
      (filterRol === "" || roleId === parseInt(filterRol)) &&
      (filterPlan === "" || plan === filterPlan) &&
      tel.toLowerCase().includes(filterTel.toLowerCase()) &&
      dni.toLowerCase().includes(filterDni.toLowerCase())
    );
  });

  const staffUsers = filteredUsers.filter((u) => (u.roleId ?? mapBackendRoleToRoleId(u.role)) <= 2);
  const normalUsers = filteredUsers.filter((u) => (u.roleId ?? mapBackendRoleToRoleId(u.role)) > 2);

  const renderUserDetails = (user) => {
    const planText = user.plan ?? user.planName ?? (user.planId ? mapPlanIdToName(Number(user.planId)) : "Sin plan");
    const apellido = user.apellido ?? user.ApeLlido ?? user.lastname ?? "";
    return (
      <div className="usuario-detalles">
        <p><strong>DNI:</strong> {user.dni || user.Dni || "-"}</p>
        <p><strong>Género:</strong> {user.genero || user.Genero || "-"}</p>
        <p><strong>Fecha de nacimiento:</strong> {user.fechaNacimiento || user.FechaNacimiento || "-"}</p>
        <p><strong>Dirección:</strong> {user.direccion || user.Direccion || "-"}</p>
        <p>
          <strong>Estado:</strong>{" "}
          <span className={user.estado === "activo" || user.Estado === "activo" ? "activo" : "inactivo"}>
            {user.estado || user.Estado || "-"}
          </span>
        </p>
        <p><strong>Plan:</strong> {planText || "Sin plan"}</p>
      </div>
    );
  };

  const renderUserRow = (user, isStaff = false) => {
    const isEditing = editingUserId === user.id;
    const currentData = isEditing
      ? editedUser
      : {
          ...user,
          apellido: user.apellido ?? user.ApeLlido ?? user.lastname ?? "",
          plan: user.plan ?? user.planName ?? (user.planId ? mapPlanIdToName(Number(user.planId)) : ""),
          roleId: user.roleId ?? (user.role ? mapBackendRoleToRoleId(user.role) : 4),
        };

    return (
      <div className="usuario-card-item" key={user.id}>
        <img
          src={user.image || user.Image || "https://placehold.co/120x120?text=User"}
          alt="perfil"
          className="usuario-avatar"
        />

        <input
          className="usuario-input"
          value={currentData.nombre || currentData.Nombre || ""}
          disabled={isStaff || !isEditing}
          onChange={(e) => setEditedUser({ ...editedUser, nombre: e.target.value })}
        />

        <input
          className="usuario-input"
          value={currentData.apellido || ""}
          disabled={isStaff || !isEditing}
          onChange={(e) => setEditedUser({ ...editedUser, apellido: e.target.value })}
        />

        <input
          className="usuario-input"
          value={currentData.email || currentData.Email || ""}
          disabled={isStaff || !isEditing}
          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
        />

        <input
          className="usuario-input"
          value={currentData.telNumber || currentData.TelNumber || ""}
          disabled={isStaff || !isEditing}
          onChange={(e) => setEditedUser({ ...editedUser, telNumber: e.target.value })}
        />

        <select
          className="usuario-input"
          value={currentData.roleId ?? mapBackendRoleToRoleId(currentData.role)}
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

        <button className="ver-mas-btn" onClick={() => toggleExpanded(user.id)}>
          {expandedUserId === user.id ? "Ver menos" : "Ver más"}
        </button>

        {expandedUserId === user.id && renderUserDetails(user)}

        {!isStaff && (
          <div className="usuario-card-actions">
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
              <button onClick={() => setEditingPasswordId(user.id)}>Cambiar Contraseña</button>
            )}

            <button className="btn-eliminar" onClick={() => handleDelete(user.id)}>Eliminar</button>
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
