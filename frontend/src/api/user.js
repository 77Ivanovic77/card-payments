import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'https://localhost:8443';

export const listUsers = () => axios.get(`${API}/api/users`, { withCredentials: true });
export const deleteUser = (id) => axios.delete(`${API}/api/users/${id}`, { withCredentials: true });


//export const updateUser = (id, newUsername) =>  axios.put(`${API}/users/${id}`, { username: newUsername }, { withCredentials: true });

export const updateUser = (id, newUsername) =>  axios.put(`${API}/api/users/${id}`, { username: newUsername }, { withCredentials: true });

