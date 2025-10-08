import React, { useEffect, useState } from "react";
import "./appLoadingScreen.css";
import { useLocation } from "react-router-dom";

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const isPreview = location.pathname === "/loading-preview";

  useEffect(() => {
    if (isPreview) return; //preview

    const handlePageLoad = () => {
      setTimeout(() => setIsLoading(false), 1000); // ms
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
      return () => window.removeEventListener("load", handlePageLoad);
    }
  }, [isPreview]);

  if (!isLoading) return null;

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="spinner"></div>
        <p className="loading-text">Cargando HighFit</p>
      </div>
    </div>
  );
};

export default LoadingScreen;