import React, { useEffect, useState } from "react";
import "../../../styles/pages/adminSucursal/usuariosSucursalSection.css";
import { getUsuariosSucursal, updateUserSucursal } from "../../../services/api";

const UsuariosSucursalSection = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const data = await getUsuariosSucursal();
      setUsuarios(data);
    };
    fetchUsuarios();
  }, []);

  const handleRolChange = async (id, nuevoRol) => {
    await updateUserSucursal(id, { rol: nuevoRol });
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, rol: nuevoRol } : u))
    );
  };

  return (
    <section className="usuarios-sucursal-section">
      <h2 className="usuarios-sucursal-title">Usuarios de Sucursal</h2>

      <div className="usuarios-sucursal-list">
        {usuarios.map((user) => (
          <div className="usuario-sucursal-item" key={user.id}>
            <div className="usuario-sucursal-info">
              <span className="usuario-sucursal-nombre">
                <strong>{user.nombre}</strong>
              </span>
              <span className="usuario-sucursal-rol">{user.rol}</span>
            </div>
            <div className="usuario-sucursal-actions">
              <select
                className="usuario-sucursal-select"
                value={user.rol}
                onChange={(e) => handleRolChange(user.id, e.target.value)}
              >
                <option value="superadmin">Superadmin</option>
                <option value="adminSucursal">Admin Sucursal</option>
                <option value="recepcionista">Recepcionista</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UsuariosSucursalSection;
