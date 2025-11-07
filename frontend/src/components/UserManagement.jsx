import React, { useEffect, useState } from "react";
import { listUsers, deleteUser,updateUser } from "../api/user"; // <-- Crearás estas funciones en la API
import { Button, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditUserModal from "./EditUserModal";
//import {Dialog, DialogTitle, DialogContent, DialogActions, TextField} from "@mui/material";


export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false); // controla el modal

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

    const handleSave = async () => {
  try {
    await updateUser(editingUser.id, editName);
    alert("Usuario actualizado correctamente");

    // Cerrar modal
    setOpen(false);

    // Refrescar tabla
    fetchUsers();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error al editar usuario");
  }
};

const fetchUsers = async () => {
  const res = await listUsers();
  setUsers(res.data);
};

useEffect(() => {
  fetchUsers();
}, []);


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
                <Button variant="contained" onClick={() => {setEditingUser(u); setEditName(u.username); setOpenModal(true); setOpen(true);}}>
                  Editar
                  <EditIcon/>
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="contained" color="error" onClick={() => handleDelete(u.id)}>
                  Eliminar
                  <DeleteIcon/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditUserModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        user={editingUser}
        editName={editName}
        setEditName={setEditName}
        handleSave={handleSave}
      />
    </>
  );
}