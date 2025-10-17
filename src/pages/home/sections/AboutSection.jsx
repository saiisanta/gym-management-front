import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaDumbbell, FaUserFriends, FaClock, FaMobileAlt } from "react-icons/fa";
import gymImage from "../../../assets/backgrounds/bg.jpg"; // usa tu propia imagen
import "../../../styles/pages/home/aboutSection.css";

const AboutSection = () => {
  return (
    <section id="about-section" className="about-section py-5">
      <Container fluid className="about-container">
        <Row className="align-items-center">
          {/* Columna izquierda - Imagen */}
          <Col xs={12} md={6} className="about-image-col">
            <div className="about-image-wrapper">
              <img src={gymImage} alt="Gimnasio" className="about-image" />
              <div className="image-overlay"></div>
            </div>
          </Col>

          {/* Columna derecha - Texto + Íconos */}
          <Col xs={12} md={6} className="about-text-col">
            <h2 className="fw-bold mb-4">Sobre Nosotros</h2>
            <p className="lead mb-5">
              En <strong>HighFit</strong> nos enfocamos en conectar a las personas con los mejores gimnasios de su zona.  
              Nuestra misión es hacer que tu entrenamiento sea accesible, organizado y motivador.
            </p>

            <div className="about-features">
              <div className="feature-item">
                <FaDumbbell className="feature-icon" />
                <div>
                  <h5>Entrena a tu manera</h5>
                  <p>Accede a diferentes tipos de gimnasios según tus objetivos.</p>
                </div>
              </div>

              <div className="feature-item">
                <FaUserFriends className="feature-icon" />
                <div>
                  <h5>Comunidad activa</h5>
                  <p>Conecta con otros deportistas y comparte tus progresos.</p>
                </div>
              </div>

              <div className="feature-item">
                <FaClock className="feature-icon" />
                <div>
                  <h5>Flexibilidad total</h5>
                  <p>Elige tus horarios y entrena cuando te quede cómodo.</p>
                </div>
              </div>

              <div className="feature-item">
                <FaMobileAlt className="feature-icon" />
                <div>
                  <h5>Gestión desde tu celular</h5>
                  <p>Reserva clases, paga planes y controla tu evolución desde la app.</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutSection;
