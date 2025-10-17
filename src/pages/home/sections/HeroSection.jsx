// src/pages/Home/HeroSection.jsx
import React from "react";
import { Container, Button, Image } from "react-bootstrap";
import logo from "../../../assets/images/logos/logo_1x.png";
import "../../../styles/pages/home/heroSection.css";

const HeroSection = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container
      fluid
      className="home-hero d-flex flex-column justify-content-center align-items-center text-center"
    >
      <div className="home-logo mb-3">
        <Image src={logo} alt="Logo HighFit" className="home-logo-image" />
      </div>
      <p className="home-hero-text lead mt-3">
        Encuentra tu gimnasio ideal,
        <br />
        reserva tus clases y lleva un control fácil
        de tus entrenamientos.
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
  );
};

export default HeroSection;
