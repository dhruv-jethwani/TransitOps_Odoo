import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import Landing from './pages/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <MantineProvider defaultColorScheme="light">
      <Notifications position="top-right" zIndex={1000} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard" 
            element={
              localStorage.getItem('auth_token') ? <Dashboard /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}