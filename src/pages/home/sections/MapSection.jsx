// src/pages/Home/MapSection.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../../styles/pages/home/mapSection.css";
import { useSucursales } from "../../../hooks/useApi";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Componente para centrar el mapa en una coordenada
const MapFlyTo = ({ position }) => {
  const map = useMap();
  if (position) map.flyTo(position, 16); // zoom 16
  return null;
};

const MapSection = () => {
  const { sucursales, loading } = useSucursales();
  const [coordsData, setCoordsData] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);

  // Geocoding con Nominatim
  useEffect(() => {
    const fetchCoords = async () => {
      if (!sucursales || sucursales.length === 0) return;

      const results = await Promise.all(
        sucursales.map(async (gym) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                gym.direccion
              )}&format=json&limit=1`
            );
            const data = await res.json();
            if (data.length > 0) {
              return {
                ...gym,
                coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
              };
            } else {
              return { ...gym, coords: null };
            }
          } catch (err) {
            console.error("Error geocoding:", err);
            return { ...gym, coords: null };
          }
        })
      );
      setCoordsData(results);
    };

    fetchCoords();
  }, [sucursales]);

  const defaultPosition = [-32.9471, -60.6505]; // Rosario como centro inicial

  return (
    <section id="map-section" className="map-section">
      <Container
        fluid
        className="home-map d-flex flex-column justify-content-center align-items-center"
      >
        <div className="map-header text-center">
          <h2 className="fw-bold">Encuentra gimnasios cercanos</h2>
          <p>Explora los gimnasios disponibles en tu zona.</p>
        </div>

        <Row className="map-content gx-4 w-100 align-items-stretch">
          {/* Lista de gimnasios */}
          <Col
            xs={12}
            md={4}
            className="map-left d-flex flex-column align-items-center"
          >
            <div className="gyms-list w-100">
              {loading ? (
                <p>Cargando gimnasios...</p>
              ) : (
                coordsData.map((gym) => (
                  <Card key={gym.id} className="gym-card mb-3 shadow-sm">
                    <Card.Body>
                      <Card.Title>{gym.nombre}</Card.Title>
                      <Card.Text>{gym.direccion}</Card.Text>
                      <Card.Text>{gym.email}</Card.Text>
                      <Card.Text>{gym.telefono}</Card.Text>
                      <Button
                        className="gym-show"
                        size="sm"
                        onClick={() => setSelectedGym(gym)}
                        disabled={!gym.coords}
                      >
                        Ver más
                      </Button>
                    </Card.Body>
                  </Card>
                ))
              )}
              {!loading && sucursales.length === 0 && (
                <p>No hay gimnasios disponibles.</p>
              )}
            </div>
          </Col>

          {/* Mapa */}
          <Col xs={12} md={8} className="map-right">
            <div
              className="map-box shadow-lg"
              style={{ height: "500px", width: "100%" }}
            >
              <MapContainer
                center={defaultPosition}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                />
                {coordsData
                  .filter((gym) => gym.coords)
                  .map((gym) => (
                    <Marker key={gym.id} position={gym.coords}>
                      <Popup>
                        {gym.nombre} <br /> {gym.direccion}
                      </Popup>
                    </Marker>
                  ))}
                {selectedGym && selectedGym.coords && (
                  <MapFlyTo position={selectedGym.coords} />
                )}
              </MapContainer>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default MapSection;
