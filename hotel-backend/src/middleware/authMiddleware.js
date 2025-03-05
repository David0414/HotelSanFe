const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

console.log("🔑 JWT_SECRET en authMiddleware.js:", JWT_SECRET); // 👈 Depuración

exports.verificarToken = (req, res, next) => {
    if (!JWT_SECRET) {
        console.error("❌ ERROR: JWT_SECRET no está definido.");
        return res.status(500).json({ message: "Error interno del servidor." });
    }

    const authHeader = req.headers["authorization"];
    console.log("HEADER AUTHORIZATION:", authHeader);

    if (!authHeader) {
        return res.status(403).json({ message: "Acceso denegado. No se proporcionó un token." });
    }

    const token = authHeader.split(" ")[1];
    console.log("TOKEN EXTRAÍDO:", token);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("TOKEN DECODIFICADO:", decoded);

        req.admin = decoded;
        next();
    } catch (error) {
        console.error("❌ Error en la verificación del token:", error);
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
};
