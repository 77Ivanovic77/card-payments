import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import AdminDashboard from "./AdminDashboard";
import UserManagement from "./UserManagement"; 
import AdminAddUser from "./AdminAddUser"

export default function AdminTabs() {
  const [tab, setTab] = useState(0);

  const handleChange = (_, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Tabs value={tab} onChange={handleChange} centered>
        <Tab label="Transacciones" />
        <Tab label="Usuarios" />
        <Tab label="Agregar Usuario" />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {tab === 0 && <AdminDashboard />}
        {tab === 1 && <UserManagement />}
        {tab === 2 && <AdminAddUser />}
      </Box>
    </Box>
  );
}