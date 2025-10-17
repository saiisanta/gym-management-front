import React, { useEffect, useState } from "react";
import { getAllUsers, updateUser, deleteUser } from "../../../services/api";
import { mapRoleIdToRole } from "../../../utils/RoleMapper";
import "../../../styles/pages/superadmin/usuariosSection.css";

const roleEnum = [3, 4];
const planEnum = ["Básico", "Premium", "VIP"];

const UsuariosSection = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editingPassword, setEditingPassword] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  // Filtros
  const [filterNombre, setFilterNombre] = useState("");
  const [filterApellido, setFilterApellido] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterRol, setFilterRol] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [filterTel, setFilterTel] = useState("");

  useEffect(() => {
    getAllUsers().then(setUsuarios);
  }, []);

  const handleEdit = async (id, field, value) => {
    const updated = usuarios.map((u) =>
      u.id === id ? { ...u, [field]: value } : u
    );
    setUsuarios(updated);
    await updateUser(id, { [field]: value });
  };

  const handlePasswordChange = (id) => {
    if (!newPassword) return alert("Ingrese nueva contraseña");
    updateUser(id, { password: newPassword });
    alert("Contraseña cambiada!");
    setEditingPassword(null);
    setNewPassword("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Desea eliminar este usuario?")) {
      await deleteUser(id);
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  // Filtrado
  const filteredUsers = usuarios.filter((u) => {
    return (
      u.nombre.toLowerCase().includes(filterNombre.toLowerCase()) &&
      u.lastname.toLowerCase().includes(filterApellido.toLowerCase()) &&
      u.email.toLowerCase().includes(filterEmail.toLowerCase()) &&
      (filterRol === "" || mapRoleIdToRole(u.roleId) === filterRol) &&
      (filterPlan === "" || u.plan === filterPlan) &&
      u.telNumber.toLowerCase().includes(filterTel.toLowerCase())
    );
  });

  const staffUsers = filteredUsers.filter(
    (u) => u.roleId === 1 || u.roleId === 2
  );
  const normalUsers = filteredUsers.filter((u) => u.roleId !== 1);

  return (
    <div className="usuarios-section">
      <div className="usuarios-header">
        <h2 className="usuarios-section-title">Usuarios</h2>
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
            {roleEnum.map((r) => (
              <option key={r} value={mapRoleIdToRole(r)}>
                {mapRoleIdToRole(r)}
              </option>
            ))}
          </select>
          <select
            className="usuario-filter-input"
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
          >
            <option value="">Todos los planes</option>
            {planEnum.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            className="usuario-filter-input"
            placeholder="Teléfono"
            value={filterTel}
            onChange={(e) => setFilterTel(e.target.value)}
          />
        </div>
      </div>

      {staffUsers.length > 0 && (
  <div className="usuarios-section-card">
    <h3>STAFF</h3>
    {staffUsers.map((user) => (
      <div className="admin-item" key={user.id}>
        <img
          src={user.image || "https://placehold.co/120x120?text=User"}
          alt="perfil"
          className="usuario-avatar"
        />

        {/* Inputs bloqueados */}
        <input
          className="usuario-input bloqueado"
          value={user.nombre}
          disabled
        />
        <input
          className="usuario-input bloqueado"
          value={user.lastname}
          disabled
        />
        <input
          className="usuario-input bloqueado"
          value={user.email}
          disabled
        />
        <input
          className="usuario-input bloqueado"
          value={mapRoleIdToRole(user.roleId)}
          disabled
        />
      </div>
    ))}
  </div>
)}

      {/* Usuarios normales */}
      {normalUsers.length > 0 && (
        <div className="usuarios-section-card">
          <h3>Usuarios</h3>
          {normalUsers.map((user) => (
            <div className="admin-item" key={user.id}>
              <img
                src={user.image || "https://placehold.co/120x120?text=User"}
                alt="perfil"
                className="usuario-avatar"
              />
              <input
                className="usuario-input"
                value={user.nombre}
                onChange={(e) => handleEdit(user.id, "nombre", e.target.value)}
              />
              <input
                className="usuario-input"
                value={user.lastname}
                onChange={(e) =>
                  handleEdit(user.id, "lastname", e.target.value)
                }
              />
              <input
                className="usuario-input"
                value={user.email}
                onChange={(e) => handleEdit(user.id, "email", e.target.value)}
              />
              <select
                className="usuario-input"
                value={user.roleId}
                onChange={(e) =>
                  handleEdit(user.id, "roleId", parseInt(e.target.value))
                }
              >
                {roleEnum.map((r) => (
                  <option key={r} value={r}>
                    {mapRoleIdToRole(r)}
                  </option>
                ))}
              </select>
              <input
                className="usuario-input"
                value={user.telNumber || ""}
                onChange={(e) =>
                  handleEdit(user.id, "telNumber", e.target.value)
                }
              />
              <select
                className="usuario-input"
                value={user.plan || planEnum[0]}
                onChange={(e) => handleEdit(user.id, "plan", e.target.value)}
              >
                {planEnum.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <div className="admin-actions">
                {editingPassword === user.id ? (
                  <>
                    <input
                      className="password-update"
                      type="text"
                      placeholder="Nueva contraseña"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button onClick={() => handlePasswordChange(user.id)}>
                      Guardar
                    </button>
                    <button onClick={() => setEditingPassword(null)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditingPassword(user.id)}>
                    Cambiar Contraseña
                  </button>
                )}
                <button
                  className="btn-eliminar"
                  onClick={() => handleDelete(user.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsuariosSection;
