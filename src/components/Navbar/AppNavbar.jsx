import React, { useContext, useEffect, useState } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import "./AppNavbar.css";

const AppNavbar = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return null;

  return (
    <Navbar
      expand="lg"
      className={`home-navbar px-5 py-3 ${hidden ? "home-navbar-hidden" : ""}`}
    >
      <Navbar.Brand as={Link} to="/" className="home-navbar-brand fw-bold">
        HighFit
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="home-navbar-nav" />
      <Navbar.Collapse id="home-navbar-nav" className="justify-content-end">
        <Nav className="home-nav ml-auto">
          {!user ? (
            <>
              <Button
                className="navbar-button-login me-2"
                onClick={() => navigate("/login")}
              >
                Iniciar Sesión
              </Button>
              <Button
                className="navbar-button-register"
                onClick={() => navigate("/register")}
              >
                Registrarse
              </Button>
            </>
          ) : (
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
  );
};

export default AppNavbar;
