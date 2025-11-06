import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem, Typography, Paper } from '@mui/material';
import { register } from '../api/auth';
//import axios from 'axios';



export default function AdminAddUser({ onUserAdded }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // valor por defecto


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = { username, password, role };
        await register(payload);
        alert('Usuario creado correctamente');
        setUsername('');
        setPassword('');
        setRole('USER');
      //if (onUserAdded) onUserAdded(res.data); // notificar al padre para refrescar listado
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message){
          alert(err.response.data.message);
          console.error(err);
        }else
          alert('Error al crear usuario');
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 400 }}>
      <Typography variant="h6" mb={2}>Agregar Nuevo Usuario</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField 
          label="Nombre de usuario" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          required 
        />
        <TextField 
          label="Contraseña" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <TextField
          select
          label="Rol"
          value={role}
          onChange={e => setRole(e.target.value)}
          required
        >
          <MenuItem value="USER">USER</MenuItem>
          <MenuItem value="ADMIN">ADMIN</MenuItem>
        </TextField>
        <Button type="submit" variant="contained">Agregar</Button>
      </Box>
    </Paper>
  );
}