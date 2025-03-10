import React, { useEffect, useState } from "react";
import { Container, Button, Table, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import EliminarHabitacion from "./EliminarHabitacion";
import Swal from "sweetalert2";
import axios from "axios";

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

    // ✅ Función para eliminar una reserva
    const handleEliminarReserva = (reservaId) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/reservas/${reservaId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(() => {
                    Swal.fire("Eliminado", "La reserva ha sido eliminada.", "success");
                    setReservas(reservas.filter(reserva => reserva.id !== reservaId));
                })
                .catch(error => {
                    console.error("Error al eliminar la reserva:", error);
                    Swal.fire("Error", "No se pudo eliminar la reserva.", "error");
                });
            }
        });
    };

    return (
        <div className="admin-dashboard">
            {/* Navbar */}
            <Navbar bg="dark" variant="dark" className="admin-navbar">
                <Container>
                    <Navbar.Brand>🏨 Panel de Administración</Navbar.Brand>
                    <Nav className="ml-auto">
                        <Button variant="outline-light" onClick={handleLogout} className="d-flex align-items-center">
                            Cerrar Sesión
                        </Button>
                    </Nav>
                </Container>
            </Navbar>

            <Container>
                {/* 🔹 Sección de Reservas */}
                <div className="admin-content">
                    <div className="section-header">
                        <h4>📅 Reservas Activas</h4>
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
                                <th>Acciones</th>
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
                                    <td><span className="badge badge-success">Activa</span></td>
                                    <td>
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            className="btn-action btn-delete"
                                            onClick={() => handleEliminarReserva(reserva.id)}
                                        >
                                            🗑 Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {reservas.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center py-3">No hay reservas activas</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                {/* 🔹 Sección de Habitaciones */}
                <div className="admin-content">
                    <div className="section-header">
                        <h4>🛏️ Gestión de Habitaciones</h4>
                        <Button 
                            variant="success" 
                            className="btn-add"
                            onClick={() => navigate("/admin/habitaciones/crear-habitacion")}
                        >
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
                                    <td><span className="badge badge-success">Disponible</span></td>
                                    <td>
                                        <Button 
                                            variant="warning" 
                                            size="sm" 
                                            className="btn-action btn-edit mr-2"
                                            onClick={() => navigate(`/admin/habitaciones/actualizar-habitacion/${habitacion.id}`)}
                                        >
                                            ✏️ Editar
                                        </Button>{" "}
                                        <EliminarHabitacion 
                                            habitacionId={habitacion.id} 
                                            onEliminar={() => setHabitaciones(habitaciones.filter(h => h.id !== habitacion.id))} 
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
