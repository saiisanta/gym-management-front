import React, { useContext } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MdHome } from 'react-icons/md';
import { AuthContext } from '../context/AuthContext';
import rolesData from '../mock/db.json'; // importar roles para mapear

import '../styles/profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    navigate('/login');
    return null;
  }

  const roleName = rolesData.roles.find(r => r.id === user.role)?.nombre || 'Desconocido';

  return (
    <Container fluid className="profile-page p-0">
      <Button
        className="profile-button-back"
        onClick={() => navigate("/")}
      >
        <MdHome size={24} />
      </Button>

      <Card className="profile-card">
        <Card.Body>
          <Card.Title className="profile-card-title">
            Perfil de Usuario
          </Card.Title>

          <table className="profile-table">
            <tbody>
              <tr>
                <td><strong>Nombre</strong></td>
                <td>{user.nombre}</td>
              </tr>
              <tr>
                <td><strong>Apellido</strong></td>
                <td>{user.lastname}</td>
              </tr>
              <tr>
                <td><strong>Email</strong></td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td><strong>Tel</strong></td>
                <td>{user.telNumber || '-'}</td>
              </tr>
              <tr>
                <td><strong>Rol</strong></td>
                <td>{roleName}</td>
              </tr>
              <tr>
                <td><strong>Plan</strong></td>
                <td>{user.plan || '-'}</td>
              </tr>
            </tbody>
          </table>

          <div className="d-flex justify-content-center mt-4">
            <Button
              className="profile-logout-button"
              onClick={() => { logout(); navigate('/login'); }}
            >
              Cerrar sesión
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
