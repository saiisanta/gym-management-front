import React, { useContext } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // o mostrar spinner mientras carga

  return (
    <div className="home-page">
      {/* Navbar */}
      <Navbar expand="lg" className="px-5 py-3 bg-dark" variant="dark">
        <Navbar.Brand as={Link} to="/" className="text-warning fw-bold">
          GymManager
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="ml-auto">
            {!user && (
              <>
                <Button
                  variant="outline-warning"
                  className="me-2"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="warning"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </>
            )}
            {user && (
              <Button
                variant="outline-warning"
                onClick={() => navigate("/profile")}
              >
                <FaUserCircle size={24} />
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Hero */}
      <Container className="hero d-flex flex-column justify-content-center align-items-center text-center text-white">
        <h1 className="display-4 fw-bold">Bienvenido a GymManager</h1>
        <p className="lead mt-3">
          Administra tus clientes, reservas y planes de manera fácil y rápida.
        </p>
        {!user && (
          <div className="mt-4">
            <Button
              variant="warning"
              size="lg"
              className="me-3"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </Button>
            <Button
              variant="outline-warning"
              size="lg"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;
