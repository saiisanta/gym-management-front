// src/pages/Home/MapSection.jsx
import React from "react";

const MapSection = () => {
  return (
    <section id="map-section" className="map-section py-5">
      <div className="container text-center">
        <h2>Encuentra gimnasios cercanos</h2>
        <div className="map-placeholder mt-4">
          {/* Aquí luego irá el mapa interactivo (Leaflet, Google Maps, etc.) */}
          <div className="map-box">[Mapa Interactivo]</div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
