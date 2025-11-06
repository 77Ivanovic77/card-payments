import React, { createContext, useState, useEffect } from 'react';
//import axios from 'axios';
import { me } from '../api/auth';
const API = process.env.REACT_APP_API_URL || 'https://localhost:8443';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    me().then(res => {
      setRole(res.data.role);
      setUsername(res.data.username);
    }).catch(() => {
      setRole(null);
      setUsername(null);
    }).finally(() => setLoading(false));
  }, []);
  
 /*
  useEffect(() => {
    (async () => {
      try {
        const res = await me();
        setRole(res.data.role);
        setUsername(res.data.username);
        console.log("esto trae res:");
        console.log(res);
      } catch {
        setRole(null);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  */
  /*
  const logoutUser = async () => {
    try {
      await apiLogout(); // ← Llama al backend para que borre cookie
    } catch (e) {}
    
    // ← LIMPIA EL ESTADO LOCAL
    setRole(null);
    setUsername(null);

    navigate('/login');
  };
*/
  return (
    <AuthContext.Provider value={{ role, setRole, username, setUsername, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
