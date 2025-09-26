import React, { useState, useRef, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/images/logos/logo_1x.png";
import "../styles/login.css";
import { users } from "../data/users";
import { MdHome } from 'react-icons/md';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return toast.error("¡El email está vacío!");
    if (!password.trim()) return toast.error("¡La contraseña está vacía!");

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) return toast.error("Usuario o contraseña incorrectos");

    login(user); // <-- context y localstorage
    navigate("/profile");
  };

  return (
    <div className="login-page">
      <Container
        fluid
        className="login-section d-flex justify-content-center align-items-center"
      >
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
                      className="custom-border"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      ref={passwordRef}
                      className="custom-border"
                    />
                  </Form.Group>
                  <Button type="submit" className="custom-button w-100 mb-3">
                    Iniciar sesión
                  </Button>
                  <div className="d-flex justify-content-between">
                    <Link
                      to="/forgot-password"
                      className="custom-warning text-decoration-none"
                    >
                      Olvidé mi contraseña
                    </Link>
                    <Link
                      to="/register"
                      className="custom-warning text-decoration-none"
                    >
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
