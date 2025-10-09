import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from "./context/AuthContext";
import { MapProvider } from "./context/MapContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Páginas
import Home from './pages/home/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/profile/Profile';

// Componentes
import AppLoadingScreen from './components/LoadingScreen/AppLoadingScreen';
import ScrollToTop from './components/ScrollToTop/AppScrollToTop';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <MapProvider>
      <LoadingProvider>
        <Router>
          <ScrollToTop />
          <ToastContainer position="top-right" autoClose={2000} />
          <AppLoadingScreen />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </LoadingProvider>
    </MapProvider>
  );
}

export default App;
