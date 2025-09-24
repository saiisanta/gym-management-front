import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container className="vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-white">
      <h2>Perfil de usuario</h2>
      <Row className="mb-2">
        <Col><strong>Nombre:</strong> {user.name}</Col>
        <Col><strong>Apellido:</strong> {user.lastname}</Col>
      </Row>
      <Row className="mb-2">
        <Col><strong>Email:</strong> {user.email}</Col>
        <Col><strong>Tel:</strong> {user.telNumber}</Col>
      </Row>
      <Row className="mb-2">
        <Col><strong>Rol:</strong> {user.role}</Col>
        <Col><strong>Plan:</strong> {user.plan}</Col>
      </Row>
      <Button variant="warning" className="mt-3" onClick={() => { localStorage.removeItem('currentUser'); navigate('/login'); }}>
        Cerrar sesión
      </Button>
    </Container>
  );
};

export default Profile;
