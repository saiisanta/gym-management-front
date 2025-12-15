import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAdmin } from "../../../hooks/useApi/useAdmin";
import "../../../styles/pages/superadmin/crearAdminSection.css";

const CrearAdminSection = () => {
  const { admins, sucursales, loading, createAdmin, updateAdmin, deleteAdmin } =
    useAdmin();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    sucursalId: "",
    password: "",
  });
  const [editingAdminId, setEditingAdminId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "nombre" || name === "apellido") && /[@.]/.test(value)) {
      toast.warning("No se permiten '@' ni '.' en el nombre o apellido");
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const generarEmail = (nombre, apellido) => {
    const clean = (str) =>
      str
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ".")
        .replace(/^\.+|\.+$/g, "");
    return `${clean(nombre)}.${clean(apellido)}@highfit.com`;
  };

  const generarPassword = () => Math.random().toString(36).slice(-8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.sucursalId)
      return toast.error("Completa todos los campos");

    try {
      if (editingAdminId) {
        const adminActual = admins.find((a) => a.id === editingAdminId);
        await updateAdmin(editingAdminId, {
          nombre: form.nombre,
          lastname: form.apellido,
          sucursalId: parseInt(form.sucursalId),
          email: adminActual.email || generarEmail(form.nombre, form.apellido),
          roleId: 2,
          ...(form.password ? { password: form.password } : {}),
        });
        toast.success("Admin modificado correctamente");
        setEditingAdminId(null);
      } else {
        const email = generarEmail(form.nombre, form.apellido);
        const password = form.password || generarPassword();
        await createAdmin({
          nombre: form.nombre,
          lastname: form.apellido,
          email,
          password,
          roleId: 2,
          sucursalId: parseInt(form.sucursalId),
        });
        toast.success(`Admin creado: ${email}`);
      }
      setForm({ nombre: "", apellido: "", sucursalId: "", password: "" });
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar admin");
    }
  };

  const handleEditar = (admin) => {
    setForm({
      nombre: admin.nombre,
      apellido: admin.lastname,
      sucursalId: admin.sucursalId,
      password: "",
    });
    setEditingAdminId(admin.id);
  };

  const handleCancelarEdicion = () => {
    setForm({ nombre: "", apellido: "", sucursalId: "", password: "" });
    setEditingAdminId(null);
  };

  const handleEliminar = async (adminId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este admin?")) return;
    try {
      await deleteAdmin(adminId);
      toast.success("Admin eliminado");
    } catch (err) {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="crear-admin-section">
      <h2 className="crear-admin-section-title">
        {editingAdminId
          ? "Modificar Admin de Sucursal"
          : "Crear Admin de Sucursal"}
      </h2>

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

        <div className="form-buttons">
          <button
            className="crear-admin-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? editingAdminId
                ? "Modificando..."
                : "Creando..."
              : editingAdminId
              ? "Modificar Admin"
              : "Crear Admin"}
          </button>
          {editingAdminId && (
            <button
              className="crear-admin-button"
              type="button"
              onClick={handleCancelarEdicion}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      <h3 className="crear-admin-subtitulo">Admins de Sucursal existentes</h3>
      <div className="crear-admin-list-wrapper">
        {admins.length === 0 ? (
          <p>No hay admins creados aún.</p>
        ) : (
          <ul className="crear-admin-list">
            {admins.map((a) => (
              <li className="admin-item" key={a.id}>
                <input
                  className="admin-list-input"
                  value={`${a.nombre} ${a.lastname}`}
                  disabled
                />
                <input className="admin-list-input" value={a.email} disabled />
                <input
                  className="admin-list-input"
                  value={a.sucursal}
                  disabled
                />

                <div className="admin-actions">
                  <button onClick={() => handleEditar(a)}>Editar</button>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleEliminar(a.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CrearAdminSection;
