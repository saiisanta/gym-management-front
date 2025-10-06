// src/pages/Home/Home.jsx
import React from "react";
import AppNavbar from "../../components/Navbar/AppNavbar";
import HeroSection from "./sections/HeroSection";
import PlansSection from "./sections/PlansSection";
import MapSection from "./sections/MapSection";
import AboutSection from "./sections/AboutSection";
import Footer from "../../components/Footer/AppFooter";
import "../../styles/pages/home/Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <AppNavbar />
      <HeroSection />
      <PlansSection />
      <MapSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Home;
