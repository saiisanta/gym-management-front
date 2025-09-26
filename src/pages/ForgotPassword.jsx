import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "../styles/login.css";
import { FaArrowRight } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Debes ingresar un email");
      emailRef.current.focus();
      return;
    }
    toast.info(`Se envió un enlace de recuperación a ${email}`);
    setTimeout(() => navigate("/login"), 1500);
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
                className="login-button-back custom-button position-absolute top-0 end-0 m-3"
                style={{ zIndex: 10 }}
                onClick={() => navigate("/login")}
              >
                <FaArrowRight size={20} />
              </Button>
              <Card.Body>
                <h3 className="text-center mb-4 text-black">
                  Recuperar contraseña
                </h3>
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
                  <div className="d-grid">
                    <Button type="submit" className="custom-button w-100">
                      Enviar enlace
                    </Button>
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

export default ForgotPassword;
