import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "../assets/restauranteStyle.css";

const Restaurante = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array de imágenes para el carrusel de fondo
  const backgroundImages = [
    "/restaurant-bg1.png",
    "/restaurant-bg2.jpg",
    "/restaurant-bg3.jpg",
    "/restaurant-bg4.jpg"
  ];

  // Efecto para cambiar automáticamente las imágenes en loop continuo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Cambiar cada 5 segundos
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="restaurante-container"
      style={{ 
        backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        transition: "background-image 1.5s ease-in-out" 
      }}
    >
      <div className="content-wrapper">
        {/* Sección Hero */}
        <div className="restaurante-hero">
          <div className="overlay">
            <h1>Disfruta de la mejor gastronomía</h1>
            <p>Descubre nuestros platillos preparados con los mejores ingredientes</p>
            <Button className="custom-btn">Ver Menú</Button>
          </div>
        </div>

        {/* Sección de Especialidades */}
        <Container className="my-5">
          <div className="section-background">
            <h2 className="text-center mb-4">Especialidades del Chef</h2>
            <Row>
              <Col md={4}>
                <Card className="service-card mb-4">
                  <div className="img-container">
                    <Card.Img
                      variant="top"
                      src="/salmon.jpg"
                      className="restaurante-img"
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>Filete de Salmón</Card.Title>
                    <Card.Text>Con una exquisita salsa de eneldo y guarnición de verduras.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="service-card mb-4">
                  <div className="img-container">
                    <Card.Img
                      variant="top"
                      src="/risotto.jpg"
                      className="restaurante-img"
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>Risotto de Mariscos</Card.Title>
                    <Card.Text>Arroz cremoso con camarones, calamares y toque de parmesano.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="service-card mb-4">
                  <div className="img-container">
                    <Card.Img
                      variant="top"
                      src="/parrilla.jpg"
                      className="restaurante-img"
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>Carne a la Parrilla</Card.Title>
                    <Card.Text>Corte premium con guarnición de papas y chimichurri casero.</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>

        {/* Sección de Contacto */}
        <div className="restaurante-contacto text-center">
          <h2>Reserva tu mesa</h2>
          <p>Disfruta de una experiencia gastronómica única en nuestro restaurante.</p>
          <Button className="custom-btn">Reservar Ahora</Button>
        </div>
      </div>
    </div>
  );
};

export default Restaurante;