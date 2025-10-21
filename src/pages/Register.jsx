import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import "../styles/login.css";
import logo from "../assets/images/logos/logo.svg";
import { MdHome } from "react-icons/md";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    nombre: "",
    lastname: "",
    telNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    dni: "",
    genero: "",
    fechaNacimiento: "",
    direccion: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones simples
    if (!form.nombre.trim()) return toast.error("El nombre es obligatorio");
    if (!form.lastname.trim()) return toast.error("El apellido es obligatorio");
    if (!form.email.trim()) return toast.error("El email es obligatorio");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return toast.error("Email inválido");

    if (!form.password || form.password.length < 6)
      return toast.error("La contraseña debe tener al menos 6 caracteres");
    if (form.password !== form.confirmPassword)
      return toast.error("Las contraseñas no coinciden");

    try {
      const userToSave = {
        nombre: form.nombre,
        lastname: form.lastname,
        telNumber: form.telNumber || null,
        email: form.email,
        password: form.password,
        dni: form.dni || null,
        genero: form.genero || null,
        fechaNacimiento: form.fechaNacimiento || null,
        direccion: form.direccion || null,
        roleId: 4, // cliente
        plan: null,
        sucursalId: null,
        image: "", // vacía al registro
      };

      await register(userToSave);
      toast.success("Registro exitoso");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error("Error al registrarse");
      console.error(err);
    }
  };

  return (
    <Container fluid className="login-page d-flex justify-content-center align-items-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={5}>
          <Card className="p-4 shadow rounded-3 text-dark">
            <div className="text-center mb-4">
              <Image src={logo} alt="Logo" style={{ maxHeight: "120px" }} />
            </div>

            <Form onSubmit={handleSubmit}>
              {/* Nombre y Apellido */}
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className={errors.nombre ? "is-invalid" : ""}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Apellido"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    className={errors.lastname ? "is-invalid" : ""}
                  />
                </Col>
              </Row>

              {/* Teléfono y DNI */}
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="tel"
                    placeholder="Teléfono"
                    name="telNumber"
                    value={form.telNumber}
                    onChange={handleChange}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="DNI"
                    name="dni"
                    value={form.dni}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              {/* Género y Fecha de nacimiento */}
              <Row className="mb-3">
                <Col>
                  <Form.Select name="genero" value={form.genero} onChange={handleChange}>
                    <option value="">Género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Control
                    type="date"
                    name="fechaNacimiento"
                    value={form.fechaNacimiento}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              {/* Dirección */}
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Dirección"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? "is-invalid" : ""}
                />
              </Form.Group>

              {/* Contraseña y Confirmación */}
              <Row className="mb-3">
                <Col>
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className={errors.password ? "is-invalid" : ""}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="password"
                    placeholder="Confirmar contraseña"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <div className="d-grid mb-3">
                <Button type="submit" className="custom-button w-100">
                  Registrarse
                </Button>
              </div>

              <div className="text-center">
                <Link to="/login" className="custom-warning text-decoration-none">
                  ¿Ya tienes cuenta? Inicia sesión
                </Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
