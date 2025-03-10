import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import '../../assets/ActualizarHabitacion.css'; // Import the new CSS file

const ActualizarHabitacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tipo, setTipo] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [imagenPreview, setImagenPreview] = useState([]);

  const token = localStorage.getItem("token");

  // ✅ Si no hay token, redirigir a /admin/login
  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
    }
  }, [token, navigate]);

  // ✅ Cargar la información de la habitación actual
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/habitaciones/${id}`)
      .then((response) => {
        const habitacion = response.data;
        setTipo(habitacion.tipo);
        setPrecio(habitacion.precio);
        setImagenPreview(habitacion.imagenes.map((img) => img.url));
      })
      .catch((error) => {
        console.error("Error al obtener la habitación:", error);
        Swal.fire("Error", "No se pudo cargar la habitación", "error");
      });
  }, [id]);

  // ✅ Manejar la selección de imágenes
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenes(files);
    
    // Create previews for new files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagenPreview(prev => [...prev, ...newPreviews]);
  };

  // ✅ Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tipo || !precio) {
      Swal.fire("Campos requeridos", "Todos los campos son obligatorios", "warning");
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
      await axios.put(`${import.meta.env.VITE_API_URL}/api/habitaciones/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "¡Éxito!",
        text: "Habitación actualizada correctamente",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/admin/dashboard");
      });
    } catch (error) {
      console.error("Error al actualizar la habitación:", error);
      Swal.fire("Error", "Hubo un problema al actualizar la habitación", "error");
    }
  };

  return (
    <div className="actualizar-habitacion-container">
      <div className="actualizar-habitacion-card">
        <h2 className="actualizar-habitacion-title">Actualizar Habitación</h2>
        <form onSubmit={handleSubmit} className="actualizar-habitacion-form">
          {/* Tipo de habitación */}
          <div className="actualizar-habitacion-input-group">
            <label className="actualizar-habitacion-label">Tipo de Habitación</label>
            <input
              type="text"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="actualizar-habitacion-input"
              placeholder="Ejemplo: Doble, Suite..."
            />
          </div>

          {/* Precio */}
          <div className="actualizar-habitacion-input-group">
            <label className="actualizar-habitacion-label">Precio</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="actualizar-habitacion-input"
              placeholder="Ejemplo: 1200"
            />
          </div>

          {/* Subir nuevas imágenes */}
          <div className="actualizar-habitacion-input-group">
            <label className="actualizar-habitacion-label">Subir Nuevas Imágenes</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="actualizar-habitacion-input actualizar-habitacion-file-input"
            />
          </div>

          {/* Vista previa de imágenes */}
          {imagenPreview.length > 0 && (
            <div className="actualizar-habitacion-preview">
              <p className="actualizar-habitacion-label">Imágenes Actuales:</p>
              <div className="actualizar-habitacion-preview-container">
                {imagenPreview.map((img, index) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt={`Vista previa ${index + 1}`} 
                    className="actualizar-habitacion-img" 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Botón de enviar */}
          <button type="submit" className="actualizar-habitacion-submit-btn">
            ACTUALIZAR HABITACIÓN
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActualizarHabitacion;