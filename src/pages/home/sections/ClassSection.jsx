import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useClases } from "../../../hooks/useApi/useClases";
import AppLocalSpinner from "../../../components/LocalSpinner/AppLocalSpinner";
import "../../../styles/pages/home/classSection.css";

const ClassSection = () => {
    const [fetchKey, setFetchKey] = useState(0);
    const { clases: todasClases, loading } = useClases(fetchKey);
    const clases = todasClases.filter((c) => c.mostrarEnHome);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(null);
    const [direction, setDirection] = useState("right");
    const [bgColorClass, setBgColorClass] = useState("bg-right");
    const [areAllImagesPreloaded, setAreAllImagesPreloaded] = useState(false);

    const handleRetry = () => {
        setAreAllImagesPreloaded(false);
        setFetchKey(prev => prev + 1);
    };

    useEffect(() => {
        if (!loading && clases.length > 0 && !areAllImagesPreloaded) {
            
            const imagePromises = clases.map((clase) => {
                return new Promise((resolve) => {
                    const imageUrl = clase.imagen;
                    if (!imageUrl) {
                        return resolve();
                    }
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = imageUrl;
                });
            });

            Promise.all(imagePromises)
                .then(() => {
                    setAreAllImagesPreloaded(true);
                })
                .catch(() => {
                    setAreAllImagesPreloaded(true);
                });
        } else if (!loading && clases.length === 0) {
             setAreAllImagesPreloaded(true);
        }
    }, [loading, clases, areAllImagesPreloaded]);

    const prevClass = () => {
        if (!clases.length) return;
        setDirection("left");
        setPrevIndex(currentIndex);
        setCurrentIndex((prev) => (prev === 0 ? clases.length - 1 : prev - 1));
    };

    const nextClass = () => {
        if (!clases.length) return;
        setDirection("right");
        setPrevIndex(currentIndex);
        setCurrentIndex((prev) => (prev === clases.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        setBgColorClass(direction === "right" ? "bg-right" : "bg-left");
    }, [direction, currentIndex]);

    const isErrorOrEmpty = !loading && clases.length === 0;

    if (loading || !areAllImagesPreloaded || isErrorOrEmpty) {
        return (
            <section id="class-section" className={`class-section loading bg-right`}>
                <div className="spinner-overlay">
                    {isErrorOrEmpty ? (
                         <div className="error-retry-container text-center">
                            <p className="mb-3 text-danger" style={{ fontSize: '1.2rem' }}>Error al cargar. ¿Reintentar?</p>
                            <Button variant="outline-danger" onClick={handleRetry} style={{ minWidth: '150px' }}>
                                Reintentar
                            </Button>
                        </div>
                    ) : (
                        <AppLocalSpinner 
                            message={loading ? "Cargando datos de clases..." : "Precargando imágenes del carrusel..."} 
                        />
                    )}
                </div>
            </section>
        );
    }
    
    const currentClass = clases[currentIndex];
    const previousClass = prevIndex !== null ? clases[prevIndex] : null;

    return (
        <section id="class-section" className={`class-section ${bgColorClass} loaded`}>
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
