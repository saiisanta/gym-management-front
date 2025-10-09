import React, { useEffect, useState } from "react";
import "./appLoadingScreen.css";
import { useLoading } from "../../context/LoadingContext";

const AppLoadingScreen = () => {
  const { isLoading } = useLoading();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      // Suave fade-out
      const timeout = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className={`loading-screen ${isLoading ? "fade-in" : "fade-out"}`}>
      <div className="loading-content">
        <div className="spinner"></div>
        <p className="loading-text">Cargando HighFit</p>
      </div>
    </div>
  );
};

export default AppLoadingScreen;
