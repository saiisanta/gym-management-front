import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useClases } from "../../../hooks/useApi";
import "../../../styles/pages/home/classSection.css";

const ClassSection = () => {
  const { clases: todasClases, loading } = useClases();
  const clases = todasClases.filter((c) => c.mostrarEnHome); // solo destacadas
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [direction, setDirection] = useState("right");
  const [bgColorClass, setBgColorClass] = useState("bg-right");

  const prevClass = () => {
    setDirection("left");
    setPrevIndex(currentIndex);
    setCurrentIndex((prev) => (prev === 0 ? clases.length - 1 : prev - 1));
  };

  const nextClass = () => {
    setDirection("right");
    setPrevIndex(currentIndex);
    setCurrentIndex((prev) => (prev === clases.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (direction === "right") setBgColorClass("bg-right");
    else setBgColorClass("bg-left");
  }, [direction, currentIndex]);

  if (loading) return <p className="loading-text">Cargando clases...</p>;
  if (!clases.length)
    return <p className="loading-text">No hay clases destacadas.</p>;

  const currentClass = clases[currentIndex];
  const previousClass = prevIndex !== null ? clases[prevIndex] : null;

  return (
    <section id="class-section" className={`class-section ${bgColorClass}`}>
      {previousClass && (
        <div
          key={previousClass.id}
          className={`class-bg previous ${direction}`}
          style={{ backgroundImage: `url(${previousClass.imagen})` }}
        ></div>
      )}

      <div
        key={currentClass.id}
        className={`class-bg current ${direction}`}
        style={{ backgroundImage: `url(${currentClass.imagen})` }}
      ></div>

      <div className="class-vignette"></div>

      <Container fluid className="class-content px-5 px-md-0">
        <h3 className="class-title fw-bold">{currentClass.nombre}</h3>
        <p className="class-description">{currentClass.descripcion}</p>

        <div className="carousel-buttons">
          <Button className="carousel-btn left" onClick={prevClass}>
            &lt;
          </Button>
          <Button className="carousel-btn right" onClick={nextClass}>
            &gt;
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default ClassSection;
