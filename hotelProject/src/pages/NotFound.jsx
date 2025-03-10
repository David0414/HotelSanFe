import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container className="text-center my-5">
            <FaExclamationTriangle size={80} className="text-danger mb-4" />
            <h1 className="text-danger">404</h1>
            <h3 className="mb-3">Página no encontrada</h3>
            <p className="text-muted">
                Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
            <Button variant="primary" onClick={() => navigate("/")}>
                Volver al inicio
            </Button>
        </Container>
    );
};

export default NotFound;
