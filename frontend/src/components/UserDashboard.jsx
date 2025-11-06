//import React from 'react';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


export default function UserDashboard() {
  const { username } = useContext(AuthContext);
  const nav = useNavigate();
  return (
    <div>
      <div style={{ padding: 20 }}>
        <h2>Panel de Usuario</h2>
        <p>Hola <strong>{username}</strong>! 👋</p>
      </div>
      <Typography variant="h4" gutterBottom>User Dashboard</Typography>
      <Button variant="contained" onClick={() => nav('/pay')}>Realizar Pago</Button>
    </div>
  );
}
