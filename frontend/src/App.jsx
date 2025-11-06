import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import PaymentForm from './components/PaymentForm';
import AdminTabs from "./components/AdminTabs";
import ProtectedRoute from "./routes/ProtectedRoute";


export default function App() {
  const { role } = useContext(AuthContext);
  return (
    <BrowserRouter>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={
            <ProtectedRoute roles={["ROLE_ADMIN"]}>
              <AdminTabs />
            </ProtectedRoute>
            //<ProtectedRoute> 
            //  role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />
            //</ProtectedRoute>
            } />

          <Route path="/user" element={
            <ProtectedRoute roles={["ROLE_ADMIN"]}>
              <PaymentForm />
            </ProtectedRoute>  
            //role === 'USER' || role === 'ADMIN' ? <PaymentForm /> : <Navigate to="/login" />
            } />
            
          <Route path="/pay" element={<PaymentForm />} />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
