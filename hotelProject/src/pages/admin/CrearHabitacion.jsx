import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Button, } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";

import '../../assets/CrearHabitacion.css'; // Import the new CSS file

const CrearHabitacion = () => {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenes, setImagenes] = useState([]);

  const token = localStorage.getItem("token");

  // ✅ PROTEGER LA RUTA: Si no hay token, redirigir a /admin/login
  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  // Manejar la selección de imágenes
  const handleFileChange = (e) => {
    setImagenes(e.target.files);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipo || !precio) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("tipo", tipo);
    formData.append("precio", precio);

    // Agregar imágenes al FormData
    for (let i = 0; i < imagenes.length; i++) {
      formData.append("imagenes", imagenes[i]);
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/habitaciones`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Habitación creada con éxito!");
      setTipo("");
      setPrecio("");
      setImagenes([]);
    } catch (error) {
      console.error("Error al crear la habitación:", error);
      alert("Hubo un error al crear la habitación.");
    }
  };

  return (
    <div className="crear-habitacion-container">

      {/* 🔹 Botón Volver en la esquina superior izquierda */}
      <div className="volver-container">
        <Button
          variant="link"
          className="volver-boton"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" /> Volver
        </Button>
      </div>

      <div className="crear-habitacion-card">
        <h2 className="crear-habitacion-title">Crear Nueva Habitación</h2>
        <form onSubmit={handleSubmit} className="crear-habitacion-form">
          {/* Tipo de habitación */}
          <div className="crear-habitacion-input-group">
            <label className="crear-habitacion-label">Tipo de Habitación</label>
            <input
              type="text"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="crear-habitacion-input"
              placeholder="Ejemplo: Doble, Suite..."
            />
          </div>

          {/* Precio */}
          <div className="crear-habitacion-input-group">
            <label className="crear-habitacion-label">Precio</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="crear-habitacion-input"
              placeholder="Ejemplo: 1200"
            />
          </div>

          {/* Subir imágenes */}
          <div className="crear-habitacion-input-group">
            <label className="crear-habitacion-label">Subir Imágenes</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="crear-habitacion-input crear-habitacion-file-input"
            />
          </div>

          {/* Botón de enviar */}
          <button
            type="submit"
            className="crear-habitacion-submit-btn"
          >
            Crear Habitación
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearHabitacion;