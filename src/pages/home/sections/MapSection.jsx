// src/pages/Home/MapSection.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../../styles/pages/home/mapSection.css";

const MapSection = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/Sucursales")
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then((data) => setSucursales(data))
      .catch((err) => console.error("Error cargando sucursales:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="map-section" className="map-section ">
      <Container fluid className="home-map d-flex flex-column justify-content-center align-items-center">
        <div className="map-header text-center">
          <h2 className="fw-bold">Encuentra gimnasios cercanos</h2>
          <p>Explora los gimnasios disponibles en tu zona.</p>
        </div>

        <Row className="map-content gx-4 w-100">
          {/* Columna izquierda - lista de gimnasios */}
          <Col xs={12} md={4} className="map-left d-flex flex-column align-items-center">
            <div className="gyms-list w-100">
              {loading ? (
                <p>Cargando gimnasios...</p>
              ) : (
                sucursales.map((gym) => (
                  <Card key={gym.id} className="gym-card mb-3 shadow-sm">
                    <Card.Body>
                      <Card.Title>{gym.nombre}</Card.Title>
                      <Card.Text>{gym.direccion}</Card.Text>
                      <Card.Text>{gym.email}</Card.Text>
                      <Card.Text>{gym.telefono}</Card.Text>
                      <Button size="sm" variant="primary">Ver más</Button>
                    </Card.Body>
                  </Card>
                ))
              )}
              {!loading && sucursales.length === 0 && <p>No hay gimnasios disponibles.</p>}
            </div>
          </Col>

          {/* Columna derecha - mapa */}
          <Col xs={12} md={8} className="map-right">
            <div className="map-box shadow-lg">
              [Mapa Interactivo]
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default MapSection;
