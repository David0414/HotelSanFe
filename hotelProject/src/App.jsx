import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Restaurante from "./pages/Restaurante";

import Reserva from "./pages/Reserva";
import HabitacionDetalle from "./pages/HabitacionDetalle";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";

import CrearHabitacion from "./pages/admin/crearHabitacion";
import ActualizarHabitacion from "./pages/admin/ActualizarHabitacion";

import NotFound from "./pages/NotFound"; 



function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/restaurante" element={<Restaurante />} />


        {/*Ruta reserva con ID*/}
        <Route path="/reserva/:habitacionId" element={<Reserva />} />
        {/*Ruta reserva con ID*/}
        <Route path="/reserva" element={<Reserva />} />


        <Route path="/habitacion/:id" element={<HabitacionDetalle />} />

        {/* Rutas de administración */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/*Crear Habitacion Ruta*/}
        <Route path="/admin/habitaciones/crear-habitacion" element={<CrearHabitacion />} />
        <Route path="/admin/habitaciones/actualizar-habitacion/:id" element={<ActualizarHabitacion />} />

        {/* ✅ Página 404 - Captura cualquier ruta no definida */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
