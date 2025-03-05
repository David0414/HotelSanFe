import React from "react";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Importamos SweetAlert2

const EliminarHabitacion = ({ habitacionId, onEliminar }) => {
  const token = localStorage.getItem("token");

  const handleEliminar = async () => {
    // ✅ Alerta de confirmación personalizada
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la habitación permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!resultado.isConfirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/habitaciones/${habitacionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Alerta de éxito personalizada
      Swal.fire({
        title: "¡Eliminado!",
        text: "La habitación ha sido eliminada con éxito.",
        icon: "success",
        timer: 2000, // Desaparece en 2 segundos
        showConfirmButton: false
      });

      onEliminar(habitacionId); // Notifica al padre para actualizar la lista
    } catch (error) {
      console.error("Error al eliminar la habitación:", error);
      
      // ✅ Alerta de error personalizada
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al eliminar la habitación.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    }
  };

  return (
    <button
      onClick={handleEliminar}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
    >
      Eliminar
    </button>
  );
};

export default EliminarHabitacion;
