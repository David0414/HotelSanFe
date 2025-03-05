import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Carousel, Spinner, Badge, ListGroup } from "react-bootstrap";
import { FaBed, FaUsers, FaWifi, FaTv, FaSnowflake, FaShower, FaCoffee, FaStar, FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const HabitacionDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [habitacion, setHabitacion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);

    // Maneja el cambio de slides del carrusel
    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll al principio al cargar la página
        
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/api/habitaciones/${id}`)
            .then((response) => {
                setHabitacion(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener la habitación:", error);
                setLoading(false);
            });
    }, [id]);

    // Características de muestra (reemplazar con datos reales cuando estén disponibles)
    const getCaracteristicas = () => {
        const caracteristicasBase = [
            { icon: <FaBed />, text: "Cama King Size" },
            { icon: <FaUsers />, text: `Capacidad: ${habitacion.capacidad || '2'} personas` },
            { icon: <FaWifi />, text: "WiFi de alta velocidad" },
            { icon: <FaTv />, text: "Smart TV 50'" },
            { icon: <FaSnowflake />, text: "Aire acondicionado" },
            { icon: <FaShower />, text: "Baño privado con ducha" },
            { icon: <FaCoffee />, text: "Cafetera" }
        ];
        
        // Si la habitación tiene características específicas, usarlas
        return habitacion.caracteristicas || caracteristicasBase;
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <Spinner animation="border" variant="danger" size="lg" />
                    <p className="mt-3">Cargando detalles de la habitación...</p>
                </div>
            </div>
        );
    }

    if (!habitacion) {
        return (
            <Container className="text-center my-5 py-5">
                <FaBed size={60} className="text-secondary mb-3" />
                <h2 className="text-danger">Habitación no encontrada</h2>
                <p className="lead mb-4">Lo sentimos, no pudimos encontrar la habitación solicitada.</p>
                <Button variant="outline-danger" onClick={() => navigate("/")}>
                    <FaArrowLeft className="me-2" /> Volver a inicio
                </Button>
            </Container>
        );
    }

    return (
        <>
            {/* Botón Volver */}
            <Container className="mt-4">
                <Button 
                    variant="link" 
                    className="text-decoration-none text-secondary mb-3 ps-0" 
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft className="me-2" /> Volver
                </Button>
            </Container>
            
            <Container className="my-3 my-md-5">
                <Row>
                    {/* Carrusel de Imágenes */}
                    <Col lg={8} className="mb-4 mb-lg-0">
                        <Card className="border-0 shadow-sm overflow-hidden">
                            <Carousel 
                                activeIndex={index} 
                                onSelect={handleSelect}
                                interval={4000}
                                className="habitacion-carousel"
                            >
                                {habitacion.imagenes && habitacion.imagenes.length > 0 ? (
                                    habitacion.imagenes.map((img, idx) => (
                                        <Carousel.Item key={idx}>
                                            <div style={{ height: "400px", overflow: "hidden" }}>
                                                <img 
                                                    className="d-block w-100 h-100" 
                                                    src={img.url} 
                                                    alt={`${habitacion.tipo} - Imagen ${idx + 1}`}
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>
                                            
                                        </Carousel.Item>
                                    ))
                                ) : (
                                    <Carousel.Item>
                                        <div style={{ height: "400px", overflow: "hidden" }}>
                                            <img 
                                                className="d-block w-100 h-100" 
                                                src="/habitacion-default.jpg" 
                                                alt="Imagen no disponible"
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                    </Carousel.Item>
                                )}
                            </Carousel>
                        </Card>
                        
                        {/* Descripción y Detalles */}
                        <Card className="border-0 shadow-sm mt-4 p-4">
                            <h3 className="mb-3">Descripción</h3>
                            <p>
                                {habitacion.descripcion || 
                                `Disfrute de nuestra lujosa habitación ${habitacion.tipo} diseñada para ofrecerle la máxima comodidad durante su estancia. 
                                Cada detalle ha sido cuidadosamente pensado para garantizar una experiencia inolvidable, desde la ropa de cama de primera calidad 
                                hasta los productos de baño premium. Nuestras habitaciones cuentan con una insonorización perfecta que le asegura un descanso reparador.`}
                            </p>
                            
                            <h4 className="mt-4 mb-3">Servicios incluidos</h4>
                            <Row>
                                {getCaracteristicas().map((caract, idx) => (
                                    <Col md={6} key={idx} className="mb-2">
                                        <div className="d-flex align-items-center">
                                            <span className="text-danger me-2">{caract.icon}</span>
                                            <span>{caract.text}</span>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </Col>

                    {/* Información de Reserva */}
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm p-4 sticky-top" style={{ top: "20px" }}>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h2 className="text-danger mb-1">{habitacion.tipo}</h2>
                                    <div className="text-warning mb-2 d-flex align-items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < (habitacion.estrellas || 5) ? 'text-warning' : 'text-muted'} />
                                        ))}
                                    </div>
                                </div>
                                <Badge bg="danger" className="p-2">
                                    {habitacion.estado || 'Disponible'}
                                </Badge>
                            </div>
                            
                            <div className="border-top border-bottom py-3 my-3">
                                <h3 className="text-danger mb-0">${habitacion.precio} <small className="text-muted">por noche</small></h3>
                                {habitacion.precioAnterior && (
                                    <p className="text-decoration-line-through text-muted mb-0">
                                        ${habitacion.precioAnterior}
                                    </p>
                                )}
                            </div>
                            
                            <ListGroup variant="flush" className="mb-4">
                                <ListGroup.Item className="d-flex justify-content-between px-0">
                                    <span>Impuestos y tasas</span>
                                    <span>Incluidos</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between px-0">
                                    <span>Desayuno</span>
                                    <span>{habitacion.incluyeDesayuno ? 'Incluido' : 'No incluido'}</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between px-0">
                                    <span>Cancelación</span>
                                    <span>Gratuita</span>
                                </ListGroup.Item>
                            </ListGroup>
                            
                            <Button 
                                variant="danger" 
                                size="lg" 
                                className="custom-btn w-100 mb-3"
                                onClick={() => navigate(`/reserva/${habitacion.id}`)}
                            >
                                Reservar Ahora
                            </Button>
                            
                            <p className="text-center text-muted small mb-0">
                                Sin cargos de reserva. Confirmación inmediata.
                            </p>
                        </Card>
                    </Col>
                </Row>
                
               
            </Container>
        </>
    );
};

export default HabitacionDetalle;