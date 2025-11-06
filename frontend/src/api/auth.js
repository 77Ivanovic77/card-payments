import axios from 'axios';

axios.defaults.withCredentials = true;

const API = process.env.REACT_APP_API_URL || 'https://localhost:8443';

export const login = (username, password) => axios.post(`${API}/api/auth/login`, { username, password }, { withCredentials: true });

export const register = (data) => axios.post(`${API}/api/auth/register`, data, { withCredentials: true });

export const logout = () => axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
/*
export const logout = async (setRole, setUsername) => {
  await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
  setRole(null);
  setUsername(null);
};
*/
export const me = () => axios.get(`${API}/api/auth/me`, { withCredentials: true });
