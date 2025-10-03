import React, { useState, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/images/logos/logo_1x.png";
import "../styles/login.css";
import { MdHome } from 'react-icons/md';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return toast.error("¡El email está vacío!");
    if (!password.trim()) return toast.error("¡La contraseña está vacía!");

    try {
      await login(email, password);
      navigate("/profile");
    } catch (err) {
      toast.error("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-page">
      <Container fluid className="login-section d-flex justify-content-center align-items-center">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={6} lg={4}>
            <Card className="login-card p-4 shadow rounded-3 text-white">
              <Button
                className="login-button-back custom-button position-absolute top-0 start-0 m-3"
                style={{ zIndex: 10 }}
                onClick={() => navigate("/")}
              >
                <MdHome size={24} />
              </Button>
              <Card.Body>
                <div className="text-center mb-3">
                  <Image src={logo} alt="Logo" style={{ maxHeight: "150px" }} />
                </div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      ref={emailRef}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      ref={passwordRef}
                    />
                  </Form.Group>
                  <Button type="submit" className="custom-button w-100 mb-3">
                    Iniciar sesión
                  </Button>
                  <div className="d-flex justify-content-between">
                    <Link to="/forgot-password" className="custom-warning text-decoration-none">
                      Olvidé mi contraseña
                    </Link>
                    <Link to="/register" className="custom-warning text-decoration-none">
                      Registrarse
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
