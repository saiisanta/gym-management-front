import React, { useContext, useEffect, useState } from "react";
import { Navbar, Nav, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import "./AppNavbar.css";

const AppNavbar = () => {
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHidden(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (path) => {
    showLoading();
    navigate(path);
    hideLoading();
  };

  if (loading) {
    return (
      <Navbar expand="lg" className="home-navbar px-5 py-3">
        <Navbar.Brand as={Link} to="/">HighFit</Navbar.Brand>
        <Nav className="ms-auto">
          <Spinner animation="border" size="sm" />
        </Nav>
      </Navbar>
    );
  }

  const role = user?.role || "";

  return (
    <Navbar expand="lg" className={`home-navbar px-5 py-3 ${hidden ? "home-navbar-hidden" : ""}`}>
      <Navbar.Brand as={Link} to="/" className="home-navbar-brand fw-bold">
        HighFit
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="home-navbar-nav" />
      <Navbar.Collapse id="home-navbar-nav" className="justify-content-end">
        <Nav className="home-nav ms-auto">
          {!user ? (
            <>
              <Button className="navbar-button-login me-2" onClick={() => handleNavigate("/login")}>Iniciar Sesión</Button>
              <Button className="navbar-button-register" onClick={() => handleNavigate("/register")}>Registrarse</Button>
            </>
          ) : (
            <>
              <Button className="navbar-button-register me-2" onClick={() => handleNavigate("/clases")}>Clases</Button>
              {role === "superadmin" && <Button className="navbar-button-login me-2" onClick={() => handleNavigate("/superadmin")}>Panel SuperAdmin</Button>}
              {role === "adminSucursal" && <Button className="navbar-button-login me-2" onClick={() => handleNavigate("/admin-sucursal")}>Panel Sucursal</Button>}
              <Button className="navbar-button-profile" onClick={() => handleNavigate("/profile")}><FaUserCircle size={24} /></Button>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AppNavbar;
