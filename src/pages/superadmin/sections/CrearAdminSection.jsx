// CrearAdminSection.jsx
import React, { useEffect, useState } from "react";
import {
  getSucursales,
  getAdminSucursales,
  createAdminSucursal,
  updateUser,
  deleteUser,
} from "../../../services/api";
import "../../../styles/pages/superadmin/crearAdminSection.css";
import { toast } from "react-toastify";

const CrearAdminSection = () => {
  const [sucursales, setSucursales] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passwordInputs, setPasswordInputs] = useState({});
  const [editingAdminId, setEditingAdminId] = useState(null); // <-- Para modo edición

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    sucursalId: "",
    password: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const suc = await getSucursales();
      setSucursales(suc);

      const adminsData = await getAdminSucursales();

      const adminsWithSucursal = adminsData.map((a) => {
        const sucursal = suc.find((s) => s.id === a.sucursalId);
        const nombreSucursal = sucursal
          ? sucursal.nombre.replace(/-/g, " ").replace(/\s+/g, " ").trim()
          : "Sin sucursal";
        return {
          id: a.id,
          nombre: a.nombre || "",
          lastname: a.lastname || "",
          email: a.email || "",
          sucursalId: a.sucursalId || "",
          sucursal: nombreSucursal,
        };
      });

      setAdmins(adminsWithSucursal);
      setPasswordInputs({});
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar datos");
    }
  };

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
    if (!form.nombre || !form.apellido || !form.sucursalId) {
      return toast.error("Completa todos los campos");
    }

    setLoading(true);

    try {
      if (editingAdminId) {
        // Modo edición
        const adminActual = admins.find((a) => a.id === editingAdminId);
        await updateUser(editingAdminId, {
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
        // Modo creación
        const email = generarEmail(form.nombre, form.apellido);
        const password = form.password || generarPassword();
        await createAdminSucursal({
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
      cargarDatos();
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar admin");
    } finally {
      setLoading(false);
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
            type="submit"
            className="crear-admin-button"
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
              type="button"
              className="btn-eliminar m-2"
              onClick={handleCancelarEdicion}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="crear-admin-list">
        <h3>Admins de Sucursal existentes</h3>
        {admins.length === 0 ? (
          <p>No hay admins creados aún.</p>
        ) : (
          <ul>
            {admins.map((a) => (
              <li key={a.id} className="admin-item">
                <span>
                  {a.nombre} {a.lastname} - {a.email} - {a.sucursal}
                </span>

                <div className="admin-actions">
                  <button onClick={() => handleEditar(a)}>Editar</button>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleEliminar(a.id)}
                  >
                    Eliminar
                  </button>
                </div>

                {passwordInputs[a.id] && (
                  <input
                    className="crear-admin-input password-update"
                    type="text"
                    placeholder="Nueva contraseña"
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleActualizarPassword(a.id, e.target.value);
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
