import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'https://localhost:8443';

export const createPayment = (payload) => axios.post(`${API}/api/payments`, payload, { withCredentials: true });

export const listPayments = () => axios.get(`${API}/api/payments`, { withCredentials: true });

export const deletePayment = (id) => axios.delete(`${API}/api/payments/${id}`, { withCredentials: true });
