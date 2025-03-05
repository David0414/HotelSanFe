require("dotenv").config(); // 👈 Fuerza la carga de variables de entorno



const app = require("./src/app");

const PORT = process.env.PORT || 5000;

console.log("🔑 JWT_SECRET en server.js:", process.env.JWT_SECRET); // 👈 Depuración


app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
