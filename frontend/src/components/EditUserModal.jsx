import React from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

export default function EditUserModal({ open, handleClose, user, editName, setEditName, handleSave }) {
  if (!user) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        p: 4,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: 350
      }}>
        <Typography variant="h6">Editar Usuario</Typography>

        <TextField
          label="Nuevo nombre"
          value={editName}
          onChange={e => setEditName(e.target.value)}
          fullWidth
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Guardar</Button>
        </Box>
      </Box>
    </Modal>
    
  );
}