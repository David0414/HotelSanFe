const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig"); // Asegúrate de importar bien la configuración de Cloudinary

// 📌 Configuración del almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "hotel-habitaciones", // 📌 Carpeta donde se guardarán las imágenes
        allowedFormats: ["jpg", "png", "jpeg"],
        public_id: (req, file) => `habitacion_${Date.now()}_${file.originalname}`, // Nombre único
    },
});

// 📌 Middleware para manejar la subida de imágenes
const upload = multer({ storage });

module.exports = upload;
