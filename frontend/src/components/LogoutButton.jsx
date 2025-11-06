import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';
import { AuthContext } from '../context/AuthContext';

export default function LogoutButton() {
  const { setUsername, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setRole(null); // limpiar estado de usuario
      setUsername(null);
      navigate('/login'); // redirigir a login
    } catch (err) {
      console.error('Error al cerrar sesión', err);
    }
  };

  return (
    <Button variant="contained" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
}