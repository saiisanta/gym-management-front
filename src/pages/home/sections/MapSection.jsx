import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../../../styles/pages/home/mapSection.css";
import { useSucursales } from "../../../hooks/useApi";
import { useMapData } from "../../../context/MapContext";

import AppLocalSpinner from "../../../components/LocalSpinner/AppLocalSpinner";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapFlyTo = ({ position }) => {
  const map = useMap();
  if (position) map.flyTo(position, 16);
  return null;
};

const MapSection = () => {
  const { sucursales, loading, error, fetchSucursales } = useSucursales();
  const { coordsData, setCoordsData } = useMapData();
  const [selectedGym, setSelectedGym] = useState(null);
  const [isListLoading, setIsListLoading] = useState(loading);

  const defaultPosition = [-32.9471, -60.6505];
  useEffect(() => {
    setIsListLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (error) return;

    if (!sucursales || sucursales.length === 0) return;

    const newGyms = sucursales.filter(
      (gym) => !coordsData?.some((c) => c.id === gym.id)
    );
    if (newGyms.length === 0) {
      setIsListLoading(false);
      return;
    }

    const fetchNewCoords = async () => {
      setIsListLoading(true);
      const results = await Promise.all(
        newGyms.map(async (gym) => {
          try {
            const res = await fetch(
              `http://localhost:4000/api/geocode?q=${encodeURIComponent(
                gym.direccion
              )}`
            );
            if (!res.ok) return { ...gym, coords: null };
            const data = await res.json();
            if (data.length > 0)
              return {
                ...gym,
                coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
              };
            return { ...gym, coords: null };
          } catch (err) {
            console.error("Error geocoding:", err);
            return { ...gym, coords: null };
          }
        })
      );

      setCoordsData((prev) => {
        const merged = [...prev];
        results.forEach((r) => {
          if (!merged.some((g) => g.id === r.id)) merged.push(r);
        });
        return merged;
      });
      setIsListLoading(false);
    };

    fetchNewCoords();
  }, [sucursales, coordsData, setCoordsData, error]);

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
          <Col
            xs={12}
            md={4}
            className="map-left d-flex flex-column align-items-center"
          >
            <div
              className="gyms-list w-100"
              style={
                !isListLoading && coordsData?.length
                  ? { flexDirection: "column", alignItems: "flex-start" }
                  : {}
              }
            >
              {isListLoading ? (
                <AppLocalSpinner message="Buscando sucursales..." />
              ) : error ? (
                <div className="p-3 text-center">
                  <p className="text-danger" style={{ fontSize: '1.2rem' }}>
                    Error de conexión. Inténtelo más tarde.
                  </p>
                  <Button variant="outline-danger" onClick={fetchSucursales} style={{ minWidth: '150px' }}>
                    Reintentar
                  </Button>
                </div>
              ) : coordsData?.length ? (
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
              ) : (
                <p>No hay gimnasios disponibles.</p>
              )}
            </div>
          </Col>

          <Col xs={12} md={8} className="map-right">
            <div
              className="map-box shadow-lg"
              style={{
                height: "500px",
                width: "100%",
                borderRadius: "20px",
                overflow: "hidden",
              }}
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
                  ?.filter((gym) => gym.coords)
                  .map((gym) => (
                    <Marker key={gym.id} position={gym.coords}>
                      <Popup>
                        {gym.nombre} <br /> {gym.direccion}
                      </Popup>
                    </Marker>
                  ))}
                {selectedGym?.coords && (
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
