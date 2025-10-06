// src/components/Footer/Footer.jsx
import React from "react";
import "./AppFooter.css";

const Footer = () => {
  return (
    <footer className="footer text-center py-4">
      <p className="mb-0">
        © {new Date().getFullYear()} HighFit — Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
