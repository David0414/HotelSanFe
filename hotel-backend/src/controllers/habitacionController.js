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

        const habitacion = await prisma.habitacion.update({
            where: { id: parseInt(id) },
            data: {
                tipo,
                precio: precio ? parseFloat(precio) : undefined,
            },
            include: { imagenes: true },
        });

        res.json({ message: "Habitación actualizada con éxito", habitacion });
    } catch (error) {
        console.error("❌ Error al actualizar la habitación:", error);
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


