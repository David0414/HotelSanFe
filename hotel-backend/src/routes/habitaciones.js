const express = require("express");
const { verificarToken } = require("../middleware/authMiddleware"); // 🔐 Importar middleware de autenticación
const { getHabitaciones, getHabitacionById, crearHabitacion, actualizarHabitacion, eliminarHabitacion} = require("../controllers/habitacionController");
const upload = require("../middleware/upload");

const router = express.Router();



// ✅ Rutas públicas (cualquiera puede ver las habitaciones)
router.get("/", getHabitaciones);
router.get("/:id", getHabitacionById);

// 🔒 Rutas protegidas (solo administradores autenticados pueden acceder)
router.post("/", verificarToken, upload.array("imagenes", 5), crearHabitacion);
router.put("/:id", verificarToken, upload.array("imagenes", 5), actualizarHabitacion);
router.delete("/:id", verificarToken, eliminarHabitacion);

module.exports = router;
