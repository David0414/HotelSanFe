import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel, Container, Row, Col, Card, Button, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FaCar, FaUtensils, FaWifi, FaPhone, FaWhatsapp, FaMapMarkerAlt, FaSwimmingPool, FaSpa, FaCocktail } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/styles.css";
import logo from "../assets/logo.png";

const Home = () => {
    const navigate = useNavigate();
    const [habitaciones, setHabitaciones] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar habitaciones desde el backend
    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/api/habitaciones`)
            .then(response => {
                setHabitaciones(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener habitaciones:", error);
                setError("No se pudieron cargar las habitaciones.");
                setLoading(false);
            });
    }, []);

    return (
        <>
            {/* Navbar */}
            <Navbar expand="lg" className="navbar-dark bg-dark">
                <Container>
                    <Navbar.Brand href="#" className="d-flex align-items-center">
                        <img src={logo} alt="Hotel Suspiro" className="logo" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <NavDropdown title="Habitaciones" id="basic-nav-dropdown" className="text-danger">
                                {habitaciones.length > 0 ? (
                                    habitaciones.map(habitacion => (
                                        <NavDropdown.Item
                                            key={habitacion.id}
                                            onClick={() => navigate(`/habitacion/${habitacion.id}`)}
                                        >
                                            {habitacion.tipo} - ${habitacion.precio}/noche
                                        </NavDropdown.Item>
                                    ))
                                ) : (
                                    <NavDropdown.Item disabled>Cargando...</NavDropdown.Item>
                                )}
                            </NavDropdown>
                            <Nav.Link href="#servicios" className="text-danger">Servicios</Nav.Link>
                            <Nav.Link href="#restaurante" className="text-danger">Restaurante</Nav.Link>
                            <Nav.Link href="#contacto" className="text-danger">Contacto</Nav.Link>
                            <Nav.Link href="#ubicacion" className="text-danger">Ubicación</Nav.Link>
                        </Nav>
                        <div className="social-icons d-flex align-items-center ms-3">
                            <a href="tel:+1234567890"><FaPhone size={18} /></a>
                            <a href="https://wa.me/1234567890"><FaWhatsapp size={18} /></a>
                            <a href="#ubicacion"><FaMapMarkerAlt size={18} /></a>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Hero Section */}
            <header className="hero">
                <Carousel fade interval={4000}>
                    <Carousel.Item>
                        <img className="d-block w-100" src="/hotel1.jpg" alt="Primera imagen" />
                        <Carousel.Caption>
                            <h1 className="display-3 text-white">Bienvenido a Hotel Suspiro</h1>
                            <p className="lead text-light">Una experiencia única de confort y elegancia</p>
                            <Button className="custom-btn" variant="danger" size="lg" onClick={() => navigate("/reserva")}>
                                Reservar Ahora
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                        <img className="d-block w-100" src="/hotel2.jpg" alt="Segunda imagen" />
                        <Carousel.Caption>
                            <h1 className="display-4 text-white">Habitaciones de Lujo</h1>
                            <p className="lead">Diseñadas para proporcionarte la máxima comodidad</p>
                            <Button className="custom-btn" variant="danger" onClick={() => navigate("/habitaciones")}>
                                Ver Habitaciones
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item>
                        <img className="d-block w-100" src="/hotel3.jpg" alt="Tercera imagen" />
                        <Carousel.Caption>
                            <h1 className="display-4 text-white">Gastronomía Excepcional</h1>
                            <p className="lead">Descubre nuestra exquisita oferta culinaria</p>
                            <Button className="custom-btn" variant="danger" onClick={() => navigate("/restaurante")}>
                                Ver Carta
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </header>

          

            {/* Sección de Habitaciones */}
            <Container className="my-5" id="habitaciones">
                <h2 className="text-center mb-4 text-danger">Nuestras Habitaciones</h2>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3">Cargando habitaciones...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger text-center">{error}</div>
                ) : (
                    <Row>
                        {habitaciones.map((habitacion) => (
                            <Col lg={4} md={6} key={habitacion.id} className="mb-4">
                                <Card onClick={() => navigate(`/habitacion/${habitacion.id}`)} style={{ cursor: "pointer" }} className="service-card h-100">
                                    <div style={{ overflow: "hidden" }}>
                                        <Card.Img
                                            variant="top"
                                            className="habitacion-img"
                                            src={habitacion.imagenes?.[0]?.url || "/habitacion-default.jpg"}
                                            alt={habitacion.tipo}
                                        />
                                    </div>
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="fw-bold">{habitacion.tipo}</Card.Title>
                                        <Card.Text>{habitacion.descripcionCorta || "Disfruta de esta habitación confortable y elegante."}</Card.Text>
                                        <div className="mt-auto d-flex justify-content-between align-items-center">
                                            <span className="fw-bold text-danger">${habitacion.precio}/noche</span>
                                            <Button
                                                variant="danger"
                                                className="custom-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/reserva/${habitacion.id}`);
                                                }}
                                            >
                                                Reservar
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>

            {/* Sección de Servicios */}
            <div className="py-5 bg-light" id="servicios">
                <Container className="my-5">
                    <h2 className="text-center mb-5 text-danger">Nuestros Servicios</h2>
                    <Row>
                        <Col md={4} className="mb-4">
                            <Card className="service-card h-100">
                                <Card.Body>
                                    <FaCar size={40} className="text-danger mb-3" />
                                    <Card.Title>Estacionamiento 24 horas</Card.Title>
                                    <Card.Text>Seguridad garantizada en nuestras instalaciones con cámaras de vigilancia y personal de seguridad.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="service-card h-100">
                                <Card.Body>
                                    <FaUtensils size={40} className="text-danger mb-3" />
                                    <Card.Title>Room Service</Card.Title>
                                    <Card.Text>Disfruta de nuestra exquisita gastronomía desde la comodidad de tu habitación las 24 horas.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="service-card h-100">
                                <Card.Body>
                                    <FaWifi size={40} className="text-danger mb-3" />
                                    <Card.Title>Wi-Fi Gratuito</Card.Title>
                                    <Card.Text>Conéctate en cualquier momento con nuestra red de alta velocidad en todas las áreas del hotel.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="service-card h-100">
                                <Card.Body>
                                    <FaSwimmingPool size={40} className="text-danger mb-3" />
                                    <Card.Title>Piscina Climatizada</Card.Title>
                                    <Card.Text>Disfruta de nuestra piscina con temperatura controlada durante todo el año.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="service-card h-100">
                                <Card.Body>
                                    <FaSpa size={40} className="text-danger mb-3" />
                                    <Card.Title>Spa & Wellness</Card.Title>
                                    <Card.Text>Relájate con nuestros tratamientos corporales y faciales de la más alta calidad.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="service-card h-100">
                                <Card.Body>
                                    <FaCocktail size={40} className="text-danger mb-3" />
                                    <Card.Title>Bar & Lounge</Card.Title>
                                    <Card.Text>Disfruta de los mejores cócteles y bebidas en un ambiente sofisticado y relajado.</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Sección CTA */}
            <section className="py-5 text-center" style={{ 
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url("/hotel-cta.jpg")', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                color: 'white'
            }}>
                <Container className="py-5">
                    <h2 className="mb-4">Experiencia Inolvidable Garantizada</h2>
                    <p className="lead mb-4 mx-auto" style={{ maxWidth: '700px' }}>
                        Reserva ahora y disfruta de un 15% de descuento en tu primera estancia. 
                        Oferta válida para reservas realizadas este mes.
                    </p>
                    <Button className="custom-btn" size="lg" onClick={() => navigate("/reserva")}>
                        Reservar con Descuento
                    </Button>
                </Container>
            </section>

            {/* Pie de Página */}
            <footer className="bg-dark text-white py-5">
                <Container>
                    <Row>
                        <Col md={4} className="mb-4 mb-md-0">
                            <h5 className="mb-3">Hotel Suspiro</h5>
                            <p className="text-muted">Ofreciendo hospitalidad excepcional y experiencias inolvidables desde 1998.</p>
                            <div className="social-icons mt-3">
                                <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                                <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4 mb-md-0">
                            <h5 className="mb-3">Contacto</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><FaMapMarkerAlt className="me-2 text-danger" /> Av. Principal 123, Ciudad</li>
                                <li className="mb-2"><FaPhone className="me-2 text-danger" /> +1234567890</li>
                                <li><FaWhatsapp className="me-2 text-danger" /> +1234567890</li>
                            </ul>
                        </Col>
                        <Col md={4}>
                            <h5 className="mb-3">Enlaces Rápidos</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><a href="#" className="me-2 text-danger">Reservas</a></li>
                                <li className="mb-2"><a href="#habitaciones" className="me-2 text-danger">Habitaciones</a></li>
                                <li className="mb-2"><a href="#servicios" className="me-2 text-danger">Servicios</a></li>
                                <li><a href="#ubicacion" className="me-2 text-danger">Ubicación</a></li>
                            </ul>
                        </Col>
                    </Row>
                    <hr className="my-4" />
                    <div className="text-center">
                        <p className="mb-0">&copy; 2024 Hotel Suspiro. Todos los derechos reservados.</p>
                    </div>
                </Container>
            </footer>
        </>
    );
};

export default Home;