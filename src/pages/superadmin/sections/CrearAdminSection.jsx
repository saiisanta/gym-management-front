// CrearAdminSection.jsx
import React, { useEffect, useState } from "react";
import { getSucursales, createUser, getAllUsers, updateUser, deleteUser } from "../../../services/api";
import "../../../styles/pages/superadmin/crearAdminSection.css";
import { toast } from "react-toastify";

const CrearAdminSection = () => {
  const [sucursales, setSucursales] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passwordInputs, setPasswordInputs] = useState({});

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    sucursalId: "",
    password: ""
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const suc = await getSucursales();
    setSucursales(suc);
    const users = await getAllUsers();
    setAdmins(users.filter((u) => u.roleId === 2));
    setPasswordInputs({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar
    if (name === "nombre" && /@|\.com/.test(value)) {
      toast.warning("El nombre no puede contener '@' ni '.com'");
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generarEmail = (nombre, apellido, sucursal) => {
    const clean = (str) => str.trim().toLowerCase().replace(/\s+/g, ".");
    return `${clean(nombre)}.${clean(apellido)}@${clean(sucursal)}.highfit.com`;
  };

  const generarPassword = () => Math.random().toString(36).slice(-8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.sucursalId) {
      return toast.error("Completa todos los campos");
    }

    setLoading(true);
    const sucursal = sucursales.find((s) => s.id === parseInt(form.sucursalId));
    const email = generarEmail(form.nombre, form.apellido, sucursal.nombre);
    const password = form.password || generarPassword();

    try {
      await createUser({
        nombre: form.nombre,
        lastname: form.apellido,
        email,
        password,
        roleId: 2,
        sucursalId: parseInt(form.sucursalId),
      });
      alert(`Admin creado:\nEmail: ${email}\nContraseña: ${password}`);
      setForm({ nombre: "", apellido: "", sucursalId: "", password: "" });
      cargarDatos();
    } catch (err) {
      console.error(err);
      toast.error("Error al crear admin");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordInput = (adminId) => {
    setPasswordInputs((prev) => ({ ...prev, [adminId]: !prev[adminId] }));
  };

  const handleActualizarPassword = async (adminId, nuevaPassword) => {
    if (!nuevaPassword || nuevaPassword.length < 6) {
      return toast.warning("Contraseña inválida");
    }
    try {
      await updateUser(adminId, { password: nuevaPassword });
      toast.success("Contraseña actualizada");
      setPasswordInputs((prev) => ({ ...prev, [adminId]: false }));
    } catch (err) {
      toast.error("Error al actualizar contraseña");
    }
  };

  const handleModificar = async (adminId) => {
    const newNombre = prompt("Nuevo nombre:");
    const newApellido = prompt("Nuevo apellido:");
    if (!newNombre || /@|\.com/.test(newNombre)) {
      return toast.warning("Nombre inválido");
    }
    try {
      await updateUser(adminId, { nombre: newNombre, lastname: newApellido });
      toast.success("Datos actualizados");
      cargarDatos();
    } catch (err) {
      toast.error("Error al actualizar");
    }
  };

  const handleEliminar = async (adminId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este admin?")) return;
    try {
      await deleteUser(adminId);
      toast.success("Admin eliminado");
      cargarDatos();
    } catch (err) {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="crear-admin-section">
      <h2 className="crear-admin-section-title">Crear Admin de Sucursal</h2>

      <form className="crear-admin-section-form" onSubmit={handleSubmit}>
        <input
          className="crear-admin-input"
          type="text"
          placeholder="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        <input
          className="crear-admin-input"
          type="text"
          placeholder="Apellido"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
        />
        <input
          className="crear-admin-input"
          type="text"
          placeholder="Contraseña (opcional)"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        <select
          className="crear-admin-select"
          name="sucursalId"
          value={form.sucursalId}
          onChange={handleChange}
        >
          <option value="">Seleccionar sucursal</option>
          {sucursales.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="crear-admin-button"
          disabled={loading}
        >
          {loading ? "Creando..." : "Crear Admin"}
        </button>
      </form>

      <div className="crear-admin-list">
        <h3>Admins de Sucursal existentes</h3>
        {admins.length === 0 ? (
          <p>No hay admins creados aún.</p>
        ) : (
          <ul>
            {admins.map((a) => (
              <li key={a.id} className="admin-item">
                <span>{a.nombre} {a.lastname} - {a.email}</span>

                <div className="admin-actions">
                  <button onClick={() => handleModificar(a.id)}>Editar</button>
                  <button onClick={() => togglePasswordInput(a.id)}>Cambiar contraseña</button>
                  <button className="btn-eliminar" onClick={() => handleEliminar(a.id)}>Eliminar</button>
                </div>

                {passwordInputs[a.id] && (
                  <input
                    className="crear-admin-input password-update"
                    type="text"
                    placeholder="Nueva contraseña"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleActualizarPassword(a.id, e.target.value);
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CrearAdminSection;
