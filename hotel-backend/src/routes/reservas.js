const express = require("express");
const { crearReserva, getFechasOcupadas } = require("../controllers/reservaController");
const router = express.Router();

router.post("/", crearReserva);
router.get("/fechas-ocupadas", getFechasOcupadas); // ✅ Nueva ruta para obtener fechas ocupadas


module.exports = router;
