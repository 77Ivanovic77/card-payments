import React, { useEffect, useState } from "react";
import { listUsers, deleteUser } from "../api/user"; // <-- Crearás estas funciones en la API
import { Button, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
//import {Dialog, DialogTitle, DialogContent, DialogActions, TextField} from "@mui/material";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  //const [editingUser, setEditingUser] = useState(null);
  //const [editName, setEditName] = useState("");
  //const [open, setOpen] = useState(false);

  const load = async () => {
    const res = await listUsers();
    setUsers(res.data);
    };

    useEffect(() => {
        load();
    }, []);

 
    const handleDelete = async (userId) => {
    try {
        await deleteUser(userId);
        alert("Usuario Eliminado");
        load();
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message); // Mostrar mensaje del backend
        } else {
        alert('Error al eliminar usuario');
        }
    }
    };


  return (
    <>
      <h2>Gestión de Usuarios</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Roles</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.roles.join(", ")}</TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={() => handleDelete(u.id)}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


    </>
  );
}