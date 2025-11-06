import React, { useState, useContext } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setRole } = useContext(AuthContext);

  

  //const role = Array.isArray(res.data.role) ? res.data.role[0] : res.data.role;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(username, password);
      const role = Array.isArray(res.data.role) ? res.data.role[0] : res.data.role;
      setRole(role.replace('ROLE_',''));
      if (role.includes('ADMIN')) navigate('/admin'); else navigate('/user');
    } catch (err) {
      alert('Credenciales inválidas');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" mb={2}>Iniciar sesión</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Usuario" value={username} onChange={e => setUsername(e.target.value)} required />
        <TextField label="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button variant="contained" type="submit">Entrar</Button>
      </Box>
    </Paper>
  );
}
