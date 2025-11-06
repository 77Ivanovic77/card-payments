import React, { useEffect, useState, useContext } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { listPayments, deletePayment } from '../api/payments';
import LogoutButton from './LogoutButton';
import { AuthContext } from '../context/AuthContext';


export default function AdminDashboard() {
  const { username, role } = useContext(AuthContext);
  const [txs, setTxs] = useState([]);

  const load = () => {
    listPayments().then(res => setTxs(res.data));
  };
  useEffect(() => {
    load();
  }, []);

  /*
  useEffect(() => {
    listPayments().then(res => setTxs(res.data)).catch(() => {});
  }, []);
  */

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar esta transacción?")) return;
    await deletePayment(id);
    load(); 
  };

  return (
    <div>
      <div style={{ padding: 20 }}>
        <h2>Panel Administrativo</h2>
        {/* 
        <p>Bienvenido, <strong>{username}</strong> 🧑‍💼</p>
        <p>Tu rol es: <strong>{role}</strong></p>
        */}
      </div> 
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Last4</TableCell>
              <TableCell>Borrar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {txs.map(tx => (
              <TableRow key={tx.id}>
                <TableCell>{tx.user}</TableCell>
                <TableCell>{tx.amount}</TableCell>
                <TableCell>{tx.currency}</TableCell>
                <TableCell>{tx.status}</TableCell>
                <TableCell>{tx.createdAt}</TableCell>
                <TableCell>{tx.last4}</TableCell>
                <TableCell><Button variant="contained" color="error" onClick={() => handleDelete(tx.id)}>  Borrar </Button> </TableCell> 
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LogoutButton></LogoutButton>
    </div>
  );
}
