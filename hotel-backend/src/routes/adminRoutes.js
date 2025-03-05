const express = require("express");
const { registrarAdmin, loginAdmin, getReservas, eliminarReserva } = require("../controllers/adminController");
const { verificarToken } = require("../middleware/authMiddleware"); // Middleware de autenticación

const router = express.Router();

// 📌 Registrar administrador (Solo se usa una vez para crear el primer admin)
router.post("/registrar", registrarAdmin);

// 📌 Iniciar sesión (Devuelve un token)
router.post("/login", loginAdmin);

// 📌 Obtener todas las reservas (Requiere autenticación)
router.get("/reservas", verificarToken, getReservas);

// 📌 Eliminar una reserva (Requiere autenticación)
router.delete("/reservas/:id", verificarToken, eliminarReserva);

module.exports = router;
