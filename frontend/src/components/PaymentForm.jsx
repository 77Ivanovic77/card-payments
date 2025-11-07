import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { createPayment } from '../api/payments';
import LogoutButton from './LogoutButton';

export default function PaymentForm() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [amount, setAmount] = useState('');
  const [cvv, setCvv] = useState('');

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // solo números
    setCardNumber(value.slice(0, 16)); // máximo 16 dígitos
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // eliminar todo lo que no sea dígito

    if (value.length >= 3) {
      value = value.slice(0, 4);
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
       setCardExpiry(value);
  };
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCvv(value.slice(0, 4)); // permite 3 o 4 dígitos (AmEx)
  };

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
      <Typography variant="h6" mb={2}>Formulario de Pago </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField 
            label="Número de tarjeta (16 dígitos)" 
            value={cardNumber} 
            onChange={handleCardNumberChange} 
            inputProps={{ inputMode: 'numeric' }}
            required 
          />

          <TextField 
            label="Titular" 
            value={cardHolder} 
            onChange={e => setCardHolder(e.target.value)} 
            required 
          />

          <TextField 
            label="Expiración (MM/YY)" 
            value={cardExpiry} 
            onChange={handleExpiryChange} 
            required 
          />

          <TextField 
            label="CVV" 
            value={cvv} 
            onChange={handleCvvChange}
            inputProps={{ inputMode: 'numeric' }}
            required 
          />

          <TextField 
            label="Monto" 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
            required 
          />
        <Button variant="contained" type="submit">Pagar</Button>
      </Box>
    </Paper>
    <LogoutButton></LogoutButton>
    </>
  );
}
