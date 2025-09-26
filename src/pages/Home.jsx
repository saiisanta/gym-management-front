import React, { useContext } from "react";
import { Container, Navbar, Nav, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/images/logos/logo_1x.png";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; //spinner

  //scroll a secciones internas
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <Navbar expand="lg" className="home-navbar px-5 py-3">
        <Navbar.Brand as={Link} to="/" className="home-navbar-brand fw-bold">
          HighFit
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="home-navbar-nav" />
        <Navbar.Collapse id="home-navbar-nav" className="justify-content-end">
          <Nav className="home-nav ml-auto">
            {!user && (
              <>
                <Button
                  className="navbar-button-login me-2"
                  onClick={() => navigate("/login")}
                >
                  Iniciar Sesion
                </Button>
                <Button
                  className="navbar-button-register"
                  onClick={() => navigate("/register")}
                >
                  Registrarse
                </Button>
              </>
            )}
            {user && (
              <Button
                className="navbar-button-profile"
                onClick={() => navigate("/profile")}
              >
                <FaUserCircle size={24} />
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Hero */}
      <Container className="home-hero d-flex flex-column justify-content-center align-items-center text-center text-white">
        <div className="home-logo mb-3">
          <Image src={logo} alt="Logo HighFit" className="home-logo-image" />
        </div>
        <p className="home-hero-text lead mt-3">
          Encuentra tu gimnasio ideal, reserva tus clases y lleva un control fácil de tus entrenamientos.
        </p>
        <div className="home-hero-buttons mt-4">
          <Button
            size="lg"
            className="hero-button-register me-3"
            onClick={() => scrollToSection("map-section")}
          >
            Explorar gimnasios
          </Button>
          <Button
            size="lg"
            className="hero-button-login"
            onClick={() => scrollToSection("plans-section")}
          >
            Ver planes disponibles
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Home;
