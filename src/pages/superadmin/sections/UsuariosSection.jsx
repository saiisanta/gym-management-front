import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  getPlanes,
} from "../../../services/api";
import { mapRoleIdToRole } from "../../../utils/RoleMapper";
import "../../../styles/pages/superadmin/usuariosSection.css";

const allRoleIds = [1, 2, 3, 4];

const UsuariosSection = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [editingPassword, setEditingPassword] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
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

  useEffect(() => {
    async function fetchData() {
      const usersData = await getAllUsers();
      const planesData = await getPlanes();

      const usuariosConDefaults = usersData.map((u) => ({
        ...u,
        nombre: u.nombre || "",
        lastname: u.lastname || "",
        email: u.email || "",
        telNumber: u.telNumber || "",
        plan: u.plan || "",
        dni: u.dni || "",
        genero: u.genero || "",
        fechaNacimiento: u.fechaNacimiento || "",
        direccion: u.direccion || "",
        estado: u.estado || "activo",
        image: u.image || "https://placehold.co/120x120?text=User",
      }));

      setUsuarios(usuariosConDefaults);
      setPlanes(planesData.map((p) => p.nombre));
    }

    fetchData();
  }, []);

  // Filtrado
  const filteredUsers = usuarios.filter((u) => {
    return (
      u.nombre.toLowerCase().includes(filterNombre.toLowerCase()) &&
      u.lastname.toLowerCase().includes(filterApellido.toLowerCase()) &&
      u.email.toLowerCase().includes(filterEmail.toLowerCase()) &&
      (filterRol === "" || mapRoleIdToRole(u.roleId) === filterRol) &&
      (filterPlan === "" || u.plan === filterPlan) &&
      u.telNumber.toLowerCase().includes(filterTel.toLowerCase()) &&
      u.dni.toLowerCase().includes(filterDni.toLowerCase())
    );
  });

  const staffUsers = filteredUsers.filter(
    (u) => u.roleId === 1 || u.roleId === 2
  );
  const normalUsers = filteredUsers.filter((u) => u.roleId > 2);

  // Handlers
  const toggleExpanded = (id) => {
    setExpandedUserId(expandedUserId === id ? null : id);
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedUser({});
  };

  const handleSaveEdit = async () => {
    const updatedUsers = usuarios.map((u) =>
      u.id === editedUser.id ? { ...u, ...editedUser } : u
    );
    setUsuarios(updatedUsers);
    await updateUser(editedUser.id, { ...editedUser });
    setEditingUserId(null);
    setEditedUser({});
  };

  const handlePasswordChange = async (id) => {
    if (!newPassword) return alert("Ingrese nueva contraseña");
    await updateUser(id, { password: newPassword });
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

  // Render
  const renderUserDetails = (user) => (
    <div className="usuario-detalles">
      <p>DNI: {user.dni}</p>
      <p>Género: {user.genero}</p>
      <p>Fecha de nacimiento: {user.fechaNacimiento}</p>
      <p>Dirección: {user.direccion}</p>
      <p>
        Estado:{" "}
        <span className={user.estado === "activo" ? "activo" : "inactivo"}>
          {user.estado}
        </span>
      </p>
    </div>
  );

  const renderUserRow = (user, isStaff = false) => {
    const isEditing = editingUserId === user.id;
    const currentData = isEditing ? editedUser : user;

    return (
      <div className="admin-item" key={user.id}>
        <img src={user.image} alt="perfil" className="usuario-avatar" />

        <input
          className="usuario-input"
          value={currentData.nombre}
          disabled={isStaff || !isEditing}
          onChange={(e) =>
            setEditedUser({ ...editedUser, nombre: e.target.value })
          }
        />
        <input
          className="usuario-input"
          value={currentData.lastname}
          disabled={isStaff || !isEditing}
          onChange={(e) =>
            setEditedUser({ ...editedUser, lastname: e.target.value })
          }
        />
        <input
          className="usuario-input"
          value={currentData.email}
          disabled={isStaff || !isEditing}
          onChange={(e) =>
            setEditedUser({ ...editedUser, email: e.target.value })
          }
        />
        <input
          className="usuario-input"
          value={currentData.telNumber}
          disabled={isStaff || !isEditing}
          onChange={(e) =>
            setEditedUser({ ...editedUser, telNumber: e.target.value })
          }
        />
        <select
          className="usuario-input"
          value={currentData.roleId}
          disabled={isStaff || !isEditing} // Staff no puede cambiar su rol
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
          value={currentData.plan}
          disabled={isStaff || !isEditing}
          onChange={(e) =>
            setEditedUser({ ...editedUser, plan: e.target.value })
          }
        >
          {planes.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <button className="ver-mas-btn" onClick={() => toggleExpanded(user.id)}>
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
              <option key={id} value={mapRoleIdToRole(id)}>
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
          <input
            className="usuario-filter-input"
            placeholder="DNI"
            value={filterDni}
            onChange={(e) => setFilterDni(e.target.value)}
          />
        </div>
      </div>

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
    </div>
  );
};

export default UsuariosSection;
