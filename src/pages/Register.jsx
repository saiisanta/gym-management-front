import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/images/logos/logo_1x.png';
import '../styles/login.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'cliente',
  });

  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error('El nombre es obligatorio');
      setErrors({ ...errors, name: true });
      nameRef.current.focus();
      return;
    }

    if (!form.email.trim()) {
      toast.error('El email es obligatorio');
      setErrors({ ...errors, email: true });
      emailRef.current.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Email inválido');
      setErrors({ ...errors, email: true });
      emailRef.current.focus();
      return;
    }

    if (!form.password || form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      setErrors({ ...errors, password: true });
      passwordRef.current.focus();
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      setErrors({ ...errors, confirmPassword: true });
      passwordRef.current.focus();
      return;
    }

    // Guardamos usuario
    localStorage.setItem('user', JSON.stringify(form));
    toast.success('Registro exitoso');
    setTimeout(() => navigate('/login'), 1000);
  };

  return (
    <div className="login-page">
      <Container fluid className="login-section d-flex justify-content-center align-items-center">
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={6} lg={4}>
            <Card className="login-card p-4 shadow rounded-3 text-white">
              <Card.Body>
                <div className="text-center mb-4">
                  <Image src={logo} alt="Logo" style={{ maxHeight: '150px' }} />
                </div>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Nombre"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      ref={nameRef}
                      className={errors.name ? 'border-danger' : 'custom-border'}
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
                      className={errors.email ? 'border-danger' : 'custom-border'}
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
                      className={errors.password ? 'border-danger' : 'custom-border'}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Confirmar contraseña"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className={errors.confirmPassword ? 'border-danger' : 'custom-border'}
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
