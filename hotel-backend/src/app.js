require("dotenv").config();


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 👈 Para recibir datos `x-www-form-urlencoded`
app.use(bodyParser.json());


console.log("🔑 JWT_SECRET CARGADO:", process.env.JWT_SECRET);

// Importar rutas
const habitacionRoutes = require("./routes/habitaciones");
const reservaRoutes = require("./routes/reservas");
const adminRoutes = require("./routes/adminRoutes");


app.use("/api/habitaciones", habitacionRoutes);
app.use("/api/reservas", reservaRoutes);
//app.use(m)
app.use("/api/admin", adminRoutes);

module.exports = app;
