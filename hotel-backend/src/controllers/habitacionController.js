const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../config/cloudinaryConfig"); // ✅ Configuración de Cloudinary

/**
 * 📌 Obtener todas las habitaciones disponibles
 */
exports.getHabitaciones = async (req, res) => {
    try {
        const habitaciones = await prisma.habitacion.findMany({
            include: { imagenes: true }, // ✅ Incluye imágenes
        });
        res.json(habitaciones);
    } catch (error) {
        console.error("❌ Error al obtener habitaciones:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

/**
 * 📌 Obtener una habitación específica por su ID
 */
exports.getHabitacionById = async (req, res) => {
    const { id } = req.params;

    try {
        const habitacion = await prisma.habitacion.findUnique({
            where: { id: parseInt(id) },
            include: { imagenes: true }, // ✅ Incluye imágenes relacionadas
        });

        if (!habitacion) {
            return res.status(404).json({ message: "Habitación no encontrada." });
        }

        res.json(habitacion);
    } catch (error) {
        console.error("❌ Error al obtener la habitación:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

/**
 * 📌 Crear una nueva habitación con imágenes en Cloudinary
 */
exports.crearHabitacion = async (req, res) => {
    try {

        console.log("REQ BODY:", req.body);
        console.log("REQ FILES:", req.files); // 🔍 Verifica que los archivos están llegando correctamente

        const { tipo, precio } = req.body;

        if (!tipo || !precio) {
            return res.status(400).json({ message: "Tipo y precio son obligatorios." });
        }

        if (isNaN(parseFloat(precio))) {
            return res.status(400).json({ message: "El precio debe ser un número válido." });
        }

        // ✅ Subir imágenes a Cloudinary si hay archivos
        let imagenesSubidas = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                imagenesSubidas.push({ url: file.path });
            }
        }
        

        // ✅ Crear la habitación con imágenes en la BD
        const nuevaHabitacion = await prisma.habitacion.create({
            data: {
                tipo,
                precio: parseFloat(precio),
                imagenes: { create: imagenesSubidas }, // ✅ Relaciona imágenes con la habitación
            },
            include: { imagenes: true },
        });

        res.status(201).json({ message: "Habitación creada con éxito", habitacion: nuevaHabitacion });
    } catch (error) {
        console.error("❌ Error al crear la habitación:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

/**
 * 📌 Actualizar una habitación por ID
 */
exports.actualizarHabitacion = async (req, res) => {
    const { id } = req.params;
    const { tipo, precio } = req.body;

    try {
        if (precio && isNaN(parseFloat(precio))) {
            return res.status(400).json({ message: "El precio debe ser un número válido." });
        }

        // ✅ Verificar si la habitación existe
        const habitacionExistente = await prisma.habitacion.findUnique({
            where: { id: parseInt(id) },
            include: { imagenes: true },
        });

        if (!habitacionExistente) {
            return res.status(404).json({ message: "Habitación no encontrada." });
        }

        // ✅ Manejo de imágenes: Si se suben nuevas imágenes, subirlas a Cloudinary
        let imagenesSubidas = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const imagenSubida = await cloudinary.uploader.upload(file.path);
                imagenesSubidas.push({ url: imagenSubida.secure_url });
            }

            // ✅ Eliminar imágenes antiguas de la BD (pero no de Cloudinary, si deseas eliminarlas de Cloudinary, deberías guardar los public_ids en la BD)
            await prisma.imagen.deleteMany({
                where: { habitacionId: parseInt(id) },
            });
        }

        // ✅ Actualizar la habitación
        const habitacionActualizada = await prisma.habitacion.update({
            where: { id: parseInt(id) },
            data: {
                tipo,
                precio: precio ? parseFloat(precio) : undefined,
                imagenes: imagenesSubidas.length > 0 ? { create: imagenesSubidas } : undefined,
            },
            include: { imagenes: true },
        });

        res.json({ message: "Habitación actualizada con éxito", habitacion: habitacionActualizada });
    } catch (error) {
        console.error("❌ Error al actualizar la habitación:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};




/**
 * 📌 Eliminar una imagen de una habitación
 */
exports.eliminarImagenHabitacion = async (req, res) => {
    const { id, imagenId } = req.params;

    try {
        const imagen = await prisma.imagen.findUnique({
            where: { id: parseInt(imagenId) },
        });

        if (!imagen) {
            return res.status(404).json({ message: "Imagen no encontrada." });
        }

        // ✅ Eliminar imagen de Cloudinary
        const publicId = imagen.url.split('/').pop().split('.')[0]; 
        await cloudinary.uploader.destroy(`hotel-habitaciones/${publicId}`);

        // ✅ Eliminar imagen de la BD
        await prisma.imagen.delete({
            where: { id: parseInt(imagenId) },
        });

        res.json({ message: "Imagen eliminada con éxito." });
    } catch (error) {
        console.error("❌ Error al eliminar la imagen:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};



/**
 * 📌 Eliminar una habitación
 */
exports.eliminarHabitacion = async (req, res) => {
    const { id } = req.params;

    try {
        const habitacionId = parseInt(id);

        // ✅ Eliminar imágenes relacionadas antes de borrar la habitación
        await prisma.imagen.deleteMany({
            where: { habitacionId: habitacionId },
        });

        // ✅ Ahora eliminar la habitación
        await prisma.habitacion.delete({
            where: { id: habitacionId },
        });

        res.json({ message: "Habitación eliminada correctamente." });
    } catch (error) {
        console.error("❌ Error al eliminar la habitación:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};


