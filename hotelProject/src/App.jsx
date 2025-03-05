import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Reserva from "./pages/Reserva";
import HabitacionDetalle from "./pages/HabitacionDetalle";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";

import CrearHabitacion from "./pages/admin/crearHabitacion";


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />

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


      </Routes>
    </Router>
  );
}

export default App;
