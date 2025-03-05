const multer = require("multer");
const path = require("path");

// Configurar almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/"); // 📂 Guarda en `public/uploads`
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // 📄 Renombra el archivo
    },
});

// Middleware de subida
const upload = multer({ storage });

module.exports = upload;
