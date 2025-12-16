import React from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import "../../../styles/pages/home/plansSection.css"; 
import { usePlanes } from "../../../hooks/useApi";
import { useNavigate } from "react-router-dom";

import AppLocalSpinner from "../../../components/LocalSpinner/AppLocalSpinner";

const PlansSection = () => {
 const { planes, loading, error, fetchPlanes } = usePlanes();
 const navigate = useNavigate();

 return (
  <section id="plans-section">
   <Container
    fluid
    className="hp-section-container d-flex flex-column justify-content-center align-items-center text-center"
   >
    <div className="hp-header mb-5">
     <h2 className="fw-bold">Planes Disponibles</h2>
     <p>Elige el plan que mejor se adapte a tus objetivos.</p>
    </div>

    {loading ? (
     <AppLocalSpinner message="Cargando planes..." />
    ) : error ? (
     <div className="text-center">
      <p className="text-danger" style={{ fontSize: "1.2rem" }}>
       Error al cargar los planes. Inténtelo más tarde.
      </p>
      <Button
       variant="outline-danger"
       onClick={fetchPlanes}
       style={{ minWidth: "150px" }}
      >
       Reintentar
      </Button>
     </div>
    ) : planes.length ? (
     <Row className="justify-content-center align-items-stretch g-4 hp-grid">
      {planes.map((plan) => (
       <Col
        className="hp-card-col"
        key={plan.id}
        xs={10}
        sm={6}
        md={4}
        lg={3}
       >
        <Card className="hp-card text-dark h-100 d-flex flex-column justify-content-between">
         <Card.Body className="d-flex flex-column justify-content-between">
          <div>
           <Card.Title className="hp-card-title fw-bold mb-3 mt-4">{plan.nombre}</Card.Title>
           <Card.Text className="hp-card-text text-muted">{plan.descripcion}</Card.Text>
          </div>
          <div>
           <h4 className="hp-card-price fw-bold mt-4 mb-4">${plan.precio}</h4>
           <Button className="hp-button w-100" onClick={() => navigate("/profile")}>Elegir plan</Button>
          </div>
         </Card.Body>
        </Card>
       </Col>
      ))}
     </Row>
    ) : (
     <p>No hay planes disponibles.</p>
    )}
   </Container>
  </section>
 );
};

export default PlansSection;