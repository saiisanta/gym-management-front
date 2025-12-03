import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { MapProvider } from "./context/MapContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Páginas
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/dashboard/Dashboard";

import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/profile/Profile";
import SuperAdmin from "./pages/superadmin/SuperAdmin";
import AdminSucursal from "./pages/adminSucursal/AdminSucursal";
import ClasesCliente from "./pages/cliente/clases/ClasesCliente";

// Componentes
import AppLoadingScreen from "./components/LoadingScreen/AppLoadingScreen";
import ScrollToTop from "./components/ScrollToTop/AppScrollToTop";
import AppNavbar from "./components/Navbar/AppNavbar";

function App() {
  return (
    <AuthProvider>
      <MapProvider>
        <LoadingProvider>
          <Router>
            <ScrollToTop />
            <ToastContainer
              position="top-right"
              autoClose={2000}
              newestOnTop
              theme="colored"
              style={{ zIndex: 99999999 }}
            />
            <AppLoadingScreen />
            <ConditionalNavbar />
            <div style={{ paddingTop: "0px" }}>
              <AppRoutes />
            </div>
          </Router>
        </LoadingProvider>
      </MapProvider>
    </AuthProvider>
  );
}

const ConditionalNavbar = () => {
  const location = useLocation();
  if (location.pathname === "/") {
    return <AppNavbar />;
  }
  return null;
};

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  const ProtectedRoute = ({ element, roles }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
    return element;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute
            roles={[
              "user",
              "adminSucursal",
              "superadmin",
              "recepcionista",
              "cliente",
            ]}
            element={<Profile />}
          />
        }
      />
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute roles={["superadmin"]} element={<SuperAdmin />} />
        }
      />
      <Route
        path="/admin-sucursal"
        element={
          <ProtectedRoute
            roles={["adminSucursal", "superadmin"]}
            element={<AdminSucursal />}
          />
        }
      />
      <Route
        path="/clases"
        element={
          <ProtectedRoute
            element={
              <ClasesCliente sucursalId={user ? user.sucursalId : null} />
            }
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
