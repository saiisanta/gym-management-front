import React, { useContext } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaCalendarAlt, FaUserCircle, FaHome, FaChalkboardTeacher, 
  FaUsers, FaBuilding, FaSignOutAlt, FaChartLine, FaClipboardList
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext"; 
import { useLoading } from "../../context/LoadingContext";
import { mapRoleIdToRole } from "../../utils/RoleMapper";
import "./../../styles/pages/dashboard/dashboard.css";

const ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN_SUCURSAL: "adminSucursal",
  CLIENTE: "cliente",
  RECEPCIONISTA: "recepcionista",
};

const DashboardCard = ({ title, icon: Icon, path, colorClass, handleNavigation }) => (
  <Col xs={12} sm={6} md={4} lg={3} className="dashboard-col">
    <Card 
      className={`dashboard-card dashboard-card-${colorClass}`} 
      onClick={() => handleNavigation(path)}
    >
      <div className="dashboard-card-icon-container">
        <Icon className="dashboard-card-icon" />
      </div>
      <Card.Body>
        <Card.Title className="dashboard-card-title">{title}</Card.Title>
      </Card.Body>
    </Card>
  </Col>
);

const Dashboard = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    showLoading();
    navigate(path);
    hideLoading();
  };

  const handleLogout = () => {
    showLoading();
    logout();
    navigate("/login");
    hideLoading();
  };

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <Spinner animation="border" className="dashboard-spinner" />
      </div>
    );
  }

  if (!user || !user.roleId) {
    navigate("/login");
    return null; 
  }

  const role = mapRoleIdToRole(user.roleId);
  const nombre = user.nombre || 'Usuario';
  
  let roleTitle = "Cliente";
  if (role === ROLES.ADMIN_SUCURSAL) roleTitle = "Administrador de Sucursal";
  if (role === ROLES.SUPERADMIN) roleTitle = "Super Administrador";
  if (role === ROLES.RECEPCIONISTA) roleTitle = "Recepcionista";

  const greetingText = `Bienvenido, ${nombre}.`;


  return (
    <div className="dashboard-hero">
      <div className="dashboard-header-bar">
        <h1 className="dashboard-app-brand fw-bold">HighFit</h1>
        <div className="dashboard-user-info">
          <Button className="dashboard-button-logout" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Cerrar Sesión
          </Button>
        </div>
      </div>
      
      <Container className="dashboard-container">
        <div className="dashboard-greeting-box">
          <h2 className="dashboard-greeting-title">Dashboard</h2>
          <p className="dashboard-greeting-text">{greetingText}</p>
        </div>

        <Row className="dashboard-cards-wrapper">
          {/* =======================================
              MoDULO UNIVERSAL/CLIENTE
          ======================================= */}
          <DashboardCard
            title="Home"
            icon={FaHome}
            path="/"
            colorClass="home"
            handleNavigation={handleNavigation}
          />
          <DashboardCard
            title="Clases y Reservas"
            icon={FaCalendarAlt}
            path="/clases"
            colorClass="clases"
            handleNavigation={handleNavigation}
          />
          <DashboardCard
            title="Mi Perfil"
            icon={FaUserCircle}
            path="/profile"
            colorClass="perfil"
            handleNavigation={handleNavigation}
          />

          {/* =======================================
              MoDULOS RECEPCION
          ======================================= */}
          {(role === ROLES.RECEPCIONISTA || role === ROLES.ADMIN_SUCURSAL || role === ROLES.SUPERADMIN) && (
            <DashboardCard
              title="Registro de Asistencia"
              icon={FaClipboardList}
              path="/recepcion/asistencia"
              colorClass="recepcion-asistencia"
              className="lol"
              handleNavigation={handleNavigation}
            />
          )}

          {/* =======================================
              MODULOS DE ADMINISTRACION
          ======================================= */}
          {(role === ROLES.ADMIN_SUCURSAL || role === ROLES.SUPERADMIN) && (
            <>
              <DashboardCard
                title="Panel Admin"
                icon={FaChalkboardTeacher}
                path="/admin-sucursal"
                colorClass="admin-profesores"
                handleNavigation={handleNavigation}
              />
            </>
          )}

          {/* =======================================
              MODULOS SUPERADMIN
          ======================================= */}
          {role === ROLES.SUPERADMIN && (
            <>
              <DashboardCard
                title="Panel SuperAdmin"
                icon={FaBuilding}
                path="/superadmin"
                colorClass="superadmin-sucursales"
                handleNavigation={handleNavigation}
              />
            </>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;