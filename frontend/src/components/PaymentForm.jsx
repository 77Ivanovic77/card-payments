import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { createPayment } from '../api/payments';
import LogoutButton from './LogoutButton';

export default function PaymentForm() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createPayment({ cardNumber, cardHolder, cardExpiry, amount: parseFloat(amount) });
      alert('Transacción: ' + res.data.status + ' — last4: ' + res.data.last4);
    } catch (err) {
      alert('Error al procesar pago');
    }
  };

  return (
    <>
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>Formulario de Pago (Simulado)</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Número de tarjeta" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required />
        <TextField label="Titular" value={cardHolder} onChange={e => setCardHolder(e.target.value)} required />
        <TextField label="Expiry MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} required />
        <TextField label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
        <Button variant="contained" type="submit">Pagar</Button>
      </Box>
    </Paper>
    <LogoutButton></LogoutButton>
    </>
  );
}
