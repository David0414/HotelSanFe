import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { DateRange } from "react-date-range";
import { addDays, isWithinInterval, format, eachDayOfInterval } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Reserva = () => {
    const { habitacionId } = useParams();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [mensaje, setMensaje] = useState(null);
    const [habitaciones, setHabitaciones] = useState([]); 
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(habitacionId || "");
    const [fechasOcupadas, setFechasOcupadas] = useState([]);
    const [rangoFechas, setRangoFechas] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: "selection",
        },
    ]);

    // Obtener todas las habitaciones si el usuario no llega con una seleccionada
    useEffect(() => {
        if (!habitacionId) {
            axios.get(`${import.meta.env.VITE_API_URL}/api/habitaciones`)
                .then(response => setHabitaciones(response.data))
                .catch(error => console.error("❌ Error al obtener habitaciones:", error));
        }
    }, [habitacionId]);

    // Obtener fechas ocupadas cuando cambia la habitación seleccionada
    useEffect(() => {
        if (habitacionSeleccionada) {
            axios.get(`${import.meta.env.VITE_API_URL}/api/reservas/fechas-ocupadas?habitacionId=${habitacionSeleccionada}`)
                .then(response => {
                    const fechas = response.data.map(({ fechaInicio, fechaFin }) => ({
                        startDate: new Date(fechaInicio),
                        endDate: new Date(fechaFin),
                    }));
                    setFechasOcupadas(fechas);
                })
                .catch(error => console.error("❌ Error al obtener fechas ocupadas:", error));
        }
    }, [habitacionSeleccionada]);

    // Función para verificar si una fecha está dentro de algún rango ocupado
    const isDateDisabled = (date) => {
        return fechasOcupadas.some(({ startDate, endDate }) =>
            isWithinInterval(date, { start: startDate, end: endDate })
        );
    };

    // Función para verificar si una fecha está en la selección actual
    const isDateSelected = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const startStr = format(rangoFechas[0].startDate, 'yyyy-MM-dd');
        const endStr = format(rangoFechas[0].endDate, 'yyyy-MM-dd');
        
        return isWithinInterval(date, { 
            start: rangoFechas[0].startDate, 
            end: rangoFechas[0].endDate 
        });
    };

    // Función para determinar la posición de la fecha en un rango ocupado
    const getDateOccupiedPosition = (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        
        for (const range of fechasOcupadas) {
            if (isWithinInterval(date, { start: range.startDate, end: range.endDate })) {
                // Verificar si es el primer día del rango
                const isStart = format(date, 'yyyy-MM-dd') === format(range.startDate, 'yyyy-MM-dd');
                
                // Verificar si es el último día del rango
                const isEnd = format(date, 'yyyy-MM-dd') === format(range.endDate, 'yyyy-MM-dd');
                
                // Verificar si la fecha anterior está en el mismo rango
                const prevDate = new Date(date);
                prevDate.setDate(prevDate.getDate() - 1);
                const prevInSameRange = fechasOcupadas.some(({ startDate, endDate }) =>
                    isWithinInterval(prevDate, { start: startDate, end: endDate })
                );
                
                // Verificar si la fecha siguiente está en el mismo rango
                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);
                const nextInSameRange = fechasOcupadas.some(({ startDate, endDate }) =>
                    isWithinInterval(nextDate, { start: startDate, end: endDate })
                );
                
                if (isStart && isEnd) {
                    return 'single';
                } else if (isStart) {
                    return 'start';
                } else if (isEnd) {
                    return 'end';
                } else {
                    return 'middle';
                }
            }
        }
        
        return null;
    };

    // Función para determinar la posición de la fecha en el rango seleccionado
    const getDateSelectedPosition = (date) => {
        if (!isDateSelected(date)) return null;
        
        const isStart = format(date, 'yyyy-MM-dd') === format(rangoFechas[0].startDate, 'yyyy-MM-dd');
        const isEnd = format(date, 'yyyy-MM-dd') === format(rangoFechas[0].endDate, 'yyyy-MM-dd');
        
        if (isStart && isEnd) return 'single';
        if (isStart) return 'start';
        if (isEnd) return 'end';
        return 'middle';
    };

    // Función para renderizar cada día del calendario con los estilos adecuados
    const dayContentRenderer = (date) => {
        // Primero verificamos si está en un rango ocupado
        const occupiedPosition = getDateOccupiedPosition(date);
        const selectedPosition = getDateSelectedPosition(date);
        
        // Si la fecha está ocupada
        if (occupiedPosition) {
            let style = {
                backgroundColor: "#ff4d4d",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%"
            };
            
            // Ajustamos los bordes según la posición
            if (occupiedPosition === 'single') {
                style.borderRadius = "50%";
            } else if (occupiedPosition === 'start') {
                style.borderRadius = "50% 0 0 50%";
            } else if (occupiedPosition === 'end') {
                style.borderRadius = "0 50% 50% 0";
            }
            
            return (
                <div className="occupied-date" style={style}>
                    {date.getDate()}
                </div>
            );
        }
        
        // Si la fecha está seleccionada
        if (selectedPosition) {
            let style = {
                backgroundColor: "#1a85ff", // Azul más vibrante
                color: "white", // Texto en blanco para mejor contraste
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%"
            };
            
            // Ajustamos los bordes según la posición en la selección
            if (selectedPosition === 'single') {
                style.borderRadius = "50%";
            } else if (selectedPosition === 'start') {
                style.borderRadius = "50% 0 0 50%";
            } else if (selectedPosition === 'end') {
                style.borderRadius = "0 50% 50% 0";
            }
            
            return (
                <div className="selected-date" style={style}>
                    {date.getDate()}
                </div>
            );
        }
        
        // Estilo por defecto para fechas no ocupadas ni seleccionadas
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%"
            }}>
                {date.getDate()}
            </div>
        );
    };

    // Aquí aplicamos estilos personalizados al componente DateRange
    const customDateRangeStyles = {
        ".rdrCalendarWrapper": {
            color: "#333",
            fontSize: "14px",
        },
        ".rdrDateDisplayItem": {
            borderRadius: "4px",
            backgroundColor: "#f5f5f5",
        },
        ".rdrDayNumber": {
            fontWeight: "normal",
            color: "#333",
        },
        ".rdrDayDisabled": {
            color: "#ccc",
        },
        // Estilo para el fondo de los días entre fechas seleccionadas
        ".rdrDayStartPreview, .rdrDayInPreview, .rdrDayEndPreview": {
            backgroundColor: "rgba(26, 133, 255, 0.2)", // Azul claro semi-transparente
        },
        // Estilo para los días seleccionados
        ".rdrDayStartOfMonth .rdrDayNumber span, .rdrDayEndOfMonth .rdrDayNumber span": {
            backgroundColor: "transparent",
        },
        // Estilos adicionales para mejorar la apariencia
        ".rdrMonthAndYearWrapper": {
            padding: "10px 0",
        },
        ".rdrMonth": {
            padding: "0 10px 10px",
        }
    };

    // Enviar la reserva al backend
    const handleReserva = async (e) => {
        e.preventDefault();
        if (!habitacionSeleccionada) {
            setMensaje({ type: "danger", text: "Por favor selecciona una habitación antes de reservar." });
            return;
        }

        const fechaInicio = rangoFechas[0].startDate;
        const fechaFin = rangoFechas[0].endDate;

        // Verificar si alguna fecha en el rango seleccionado está ocupada
        const diasSeleccionados = eachDayOfInterval({
            start: fechaInicio,
            end: fechaFin
        });
        
        const hayFechaOcupada = diasSeleccionados.some(dia => isDateDisabled(dia));
        
        if (hayFechaOcupada) {
            setMensaje({ type: "danger", text: "Las fechas seleccionadas ya están ocupadas. Elige otras." });
            return;
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/reservas`, {
                cliente,
                telefono,
                email,
                habitacionId: parseInt(habitacionSeleccionada),
                fechaInicio: fechaInicio.toISOString().split("T")[0],
                fechaFin: fechaFin.toISOString().split("T")[0],
            });

            setMensaje({ type: "success", text: "Reserva realizada con éxito" });
        } catch (error) {
            setMensaje({ type: "danger", text: "Error al realizar la reserva" });
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center text-danger">Reserva tu Habitación</h2>
            {mensaje && <Alert variant={mensaje.type}>{mensaje.text}</Alert>}

            {/* Leyenda de colores */}
            <div className="d-flex justify-content-center mb-3">
                <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                    <div style={{ width: "20px", height: "20px", backgroundColor: "#ff4d4d", borderRadius: "4px", marginRight: "5px" }}></div>
                    <span>Fechas Ocupadas</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                    <div style={{ width: "20px", height: "20px", backgroundColor: "#1a85ff", borderRadius: "4px", marginRight: "5px" }}></div>
                    <span>Fechas Seleccionadas</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: "20px", height: "20px", backgroundColor: "transparent", border: "1px solid #ccc", borderRadius: "4px", marginRight: "5px" }}></div>
                    <span>Fechas Disponibles</span>
                </div>
            </div>

            {/* Mensaje de Check-Out */}
            <Alert variant="warning" className="text-center">
                La fecha de check-out es a las 12:00 PM.
            </Alert>

            <Form onSubmit={handleReserva}>
                {/* Selección de Habitación solo si no está preseleccionada */}
                {!habitacionId && (
                    <Form.Group className="mb-3">
                        <Form.Label>Selecciona una Habitación</Form.Label>
                        <Form.Select
                            value={habitacionSeleccionada}
                            onChange={(e) => setHabitacionSeleccionada(e.target.value)}
                            required
                        >
                            <option value="">-- Selecciona una habitación --</option>
                            {habitaciones.map(habitacion => (
                                <option key={habitacion.id} value={habitacion.id}>
                                    {habitacion.tipo} - ${habitacion.precio}/noche
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                )}

                <Form.Group className="mb-3">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>

                {/* CALENDARIO MEJORADO */}
                <Form.Group className="mb-3">
                    <Form.Label>Selecciona tu Rango de Fechas</Form.Label>
                    <div className="calendar-container" style={{ maxWidth: "100%", overflowX: "auto" }}>
                        <DateRange
                            ranges={rangoFechas}
                            onChange={(ranges) => setRangoFechas([ranges.selection])}
                            minDate={new Date()}
                            disabledDates={fechasOcupadas.flatMap(({ startDate, endDate }) =>
                                Array.from({ length: (endDate - startDate) / (1000 * 60 * 60 * 24) + 1 }, (_, i) =>
                                    new Date(startDate.getTime() + i * (1000 * 60 * 60 * 24))
                                )
                            )}
                            dayContentRenderer={dayContentRenderer}
                            rangeColors={["#1a85ff"]} // Color para los rangos seleccionados
                            color="#1a85ff" // Color principal
                        />
                    </div>
                </Form.Group>

                {/* CÁLCULO DE NOCHES */}
                <Alert variant="info">
                    Noches seleccionadas: {Math.ceil((rangoFechas[0].endDate - rangoFechas[0].startDate) / (1000 * 60 * 60 * 24))}
                </Alert>

                <Button variant="danger" type="submit">Confirmar Reserva</Button>
            </Form>
        </Container>
    );
};

export default Reserva;