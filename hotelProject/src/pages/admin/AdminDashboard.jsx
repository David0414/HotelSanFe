import React, { useEffect, useState } from "react";
import { Container, Button, Table, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EliminarHabitacion from "./EliminarHabitacion"; // ✅ Importar el componente

import axios from "axios";
// Asegúrate de importar Font Awesome o el set de iconos que prefieras
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSignOutAlt, faHotel, faCalendarCheck, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [habitaciones, setHabitaciones] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/admin/login"); // Redirigir si no está autenticado
        }

        axios.get(`${import.meta.env.VITE_API_URL}/api/admin/reservas`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setReservas(response.data))
            .catch(error => console.error("Error obteniendo reservas:", error));

        axios.get(`${import.meta.env.VITE_API_URL}/api/habitaciones`)
            .then(response => setHabitaciones(response.data))
            .catch(error => console.error("Error obteniendo habitaciones:", error));
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/admin/login");
    };

    // ✅ Función para eliminar una habitación localmente después de la eliminación en la API
    const handleEliminarHabitacion = (habitacionId) => {
        setHabitaciones(habitaciones.filter(habitacion => habitacion.id !== habitacionId));
    };

    return (
        <div className="admin-dashboard">
            {/* Navbar mejorado */}
            <Navbar bg="dark" variant="dark" className="admin-navbar">
                <Container>
                    <Navbar.Brand>
                        {/* Si importas FontAwesome, descomenta esto: */}
                        {/* <FontAwesomeIcon icon={faHotel} /> */}
                        {/* Si no, puedes usar un emoji como alternativa temporal: */}
                        🏨 Panel de Administración
                    </Navbar.Brand>
                    <Nav className="ml-auto">
                        <Button variant="outline-light" onClick={handleLogout} className="d-flex align-items-center">
                            {/* <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> */}
                            Cerrar Sesión
                        </Button>
                    </Nav>
                </Container>
            </Navbar>

            <Container>
                {/* 🔹 Sección de Reservas */}
                <div className="admin-content">
                    <div className="section-header">
                        <h4>
                            {/* <FontAwesomeIcon icon={faCalendarCheck} /> */}
                            📅 Reservas Activas
                        </h4>
                    </div>
                    <Table className="admin-table" hover responsive>
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Cliente</th>
                                <th>Teléfono</th>
                                <th>Habitación</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Fin</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map(reserva => (
                                <tr key={reserva.id}>
                                    <td><strong>{reserva.id}</strong></td>
                                    <td>{reserva.cliente}</td>
                                    <td>{reserva.telefono}</td>
                                    <td>{reserva.habitacion?.tipo || "Sin asignar"}</td>
                                    <td>{reserva.fechaInicio.split("T")[0]}</td>
                                    <td>{reserva.fechaFin.split("T")[0]}</td>
                                    <td>
                                        <span className="badge badge-success">Activa</span>
                                    </td>
                                </tr>
                            ))}
                            {reservas.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-3">No hay reservas activas</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                {/* 🔹 Sección de Habitaciones */}
                <div className="admin-content">
                    <div className="section-header">
                        <h4>
                            {/* <FontAwesomeIcon icon={faHotel} /> */}
                            🛏️ Gestión de Habitaciones
                        </h4>
                        <Button 
                            variant="success" 
                            className="btn-add"
                            onClick={() => navigate("/admin/habitaciones/crear-habitacion")}
                        >
                            {/* <FontAwesomeIcon icon={faPlus} /> */}
                            + Agregar Habitación
                        </Button>
                    </div>
                    <Table className="admin-table" hover responsive>
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Tipo</th>
                                <th>Precio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {habitaciones.map(habitacion => (
                                <tr key={habitacion.id}>
                                    <td><strong>{habitacion.id}</strong></td>
                                    <td>{habitacion.tipo}</td>
                                    <td><span className="font-weight-bold">${habitacion.precio}</span></td>
                                    <td>
                                        <span className="badge badge-success">Disponible</span>
                                    </td>
                                    <td>
                                        <Button 
                                            variant="warning" 
                                            size="sm" 
                                            className="btn-action btn-edit mr-2"
                                            onClick={() => navigate(`/admin/habitaciones/edit/${habitacion.id}`)}
                                        >
                                            {/* <FontAwesomeIcon icon={faEdit} /> */}
                                            Editar
                                        </Button>{" "}
                                        {/* ✅ Botón para eliminar la habitación */}
                                        <EliminarHabitacion 
                                            habitacionId={habitacion.id} 
                                            onEliminar={handleEliminarHabitacion} 
                                        />
                                    </td>
                                </tr>
                            ))}
                            {habitaciones.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-3">No hay habitaciones disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </div>
    );
};

export default AdminDashboard;