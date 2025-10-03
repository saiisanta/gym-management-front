import React, { useState, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/images/logos/logo_1x.png";
import "../styles/login.css";
import { MdHome } from 'react-icons/md';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    telNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const lastnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("El nombre es obligatorio");
    if (!form.lastname.trim()) return toast.error("El apellido es obligatorio");
    if (!form.email.trim()) return toast.error("El email es obligatorio");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return toast.error("Email inválido");

    if (!form.password || form.password.length < 6)
      return toast.error("La contraseña debe tener al menos 6 caracteres");

    if (form.password !== form.confirmPassword)
      return toast.error("Las contraseñas no coinciden");

    const userToSave = {
      nombre: form.name,
      lastname: form.lastname,
      telNumber: form.telNumber || null,
      email: form.email,
      password: form.password,
      roleId: 4,
      plan: null,
    };

    try {
      await register(userToSave);
      toast.success("Registro exitoso");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error("Error al registrarse");
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
                <div className="text-center mb-4">
                  <Image src={logo} alt="Logo" style={{ maxHeight: "150px" }} />
                </div>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="Nombre"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        ref={nameRef}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="text"
                        placeholder="Apellido"
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                        ref={lastnameRef}
                      />
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="tel"
                      placeholder="Teléfono"
                      name="telNumber"
                      value={form.telNumber}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      ref={emailRef}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      ref={passwordRef}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Confirmar contraseña"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <div className="d-grid mb-3">
                    <Button type="submit" className="custom-button w-100">
                      Registrarse
                    </Button>
                  </div>
                  <div className="d-flex justify-content-center">
                    <Link to="/login" className="custom-warning text-decoration-none">
                      Ya tengo cuenta
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

export default Register;
