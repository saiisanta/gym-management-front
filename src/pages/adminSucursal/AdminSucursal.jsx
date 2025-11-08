import React, { useState, useContext, useEffect } from "react";
import "../../styles/pages/profile/profile.css";
import {
  FaCalendarAlt,
  FaUsers,
  FaChalkboardTeacher,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";
import { mapRoleIdToRole } from "../../utils/RoleMapper";
import { useSucursales } from "../../hooks/useApi/useSucursales";

import ClasesSection from "./sections/ClasesSection";
import UsuariosSucursalSection from "./sections/UsuariosSucursalSection";
import ProfesoresSection from "./sections/ProfesoresSection";

const AdminSucursal = () => {
  const { showLoading, hideLoading } = useLoading();
  const [activeSection, setActiveSection] = useState("clases");
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    sucursales = [],
    loading: loadingSucursales,
    fetchSucursales,
  } = useSucursales(true);

  const [selectedSucursalId, setSelectedSucursalId] = useState(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);

  useEffect(() => {
    if (loading || loadingSucursales) {
      showLoading();
    } else {
      hideLoading();
    }
    return () => {
      hideLoading();
    };
  }, [loading, loadingSucursales, showLoading, hideLoading]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const userRole =
      typeof user.role === "string"
        ? user.role
        : mapRoleIdToRole(user.roleId || 4);

    const isSuper = userRole === "superadmin";
    setIsSuperadmin(isSuper);

    if (userRole !== "adminSucursal" && userRole !== "superadmin") {
      navigate("/");
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    if (!user) return;

    if (isSuperadmin) {
      if (sucursales && sucursales.length > 0) {
        setSelectedSucursalId((prev) => prev || sucursales[0].id);
      } else {
        setSelectedSucursalId(null);
      }
    } else {
      setSelectedSucursalId(user.sucursalId || null);
    }
  }, [isSuperadmin, sucursales, user]);

  const handleSucursalChange = (e) => {
    setSelectedSucursalId(e.target.value ? Number(e.target.value) : null);
  };

  const handleNavigate = (path) => {
    showLoading();
    navigate(path);
  };

  const renderSection = () => {
    if (isSuperadmin && !selectedSucursalId) {
      return (
        <div style={{ padding: 20 }}>
          <p>
            No hay sucursal seleccionada. Por favor selecciona una sucursal
            arriba.
          </p>
        </div>
      );
    }

    switch (activeSection) {
      case "clases":
        return <ClasesSection sucursalId={selectedSucursalId} />;
      case "usuarios":
        return <UsuariosSucursalSection sucursalId={selectedSucursalId} />;
      case "profesores":
        return <ProfesoresSection sucursalId={selectedSucursalId} />;
      default:
        return <ClasesSection sucursalId={selectedSucursalId} />;
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="profile-page">
      <aside className="profile-sidebar">
        <h2 className="profile-title">Panel Sucursal</h2>

        {isSuperadmin && (
          <div className="sucursal-selector">
            <label className="sucursal-label">Seleccionar Sucursal</label>

            <div className="sucursal-select-wrapper">
              <select
                className="sucursal-select"
                value={selectedSucursalId ?? ""}
                onChange={handleSucursalChange}
              >
                <option value="">-- Selecciona una sucursal --</option>
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre || `Sucursal ${s.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <ul className="profile-menu">
          <li
            className={activeSection === "clases" ? "active" : ""}
            onClick={() => setActiveSection("clases")}
          >
            <FaCalendarAlt /> Clases
          </li>
          <li
            className={activeSection === "usuarios" ? "active" : ""}
            onClick={() => setActiveSection("usuarios")}
          >
            <FaUsers /> Usuarios
          </li>
          <li
            className={activeSection === "profesores" ? "active" : ""}
            onClick={() => setActiveSection("profesores")}
          >
            <FaChalkboardTeacher /> Profesores
          </li>
        </ul>

        <div className="profile-bottom-buttons">
          <button
            className="sidebar-btn back-home"
            onClick={() => handleNavigate("/dashboard")}
          >
            Volver
          </button>
          <button
            className="sidebar-btn logout"
            onClick={() => {
              logout();
              handleNavigate("/login");
            }}
          >
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="profile-content">{renderSection()}</main>
    </div>
  );
};

export default AdminSucursal;
