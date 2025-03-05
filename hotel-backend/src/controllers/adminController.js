const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET; // 🔑 Usamos la clave del .env

/**
 * 📌 Registrar un nuevo administrador (Úsalo solo una vez para crear el primer admin)
 */
exports.registrarAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el administrador ya existe
        const adminExistente = await prisma.admin.findUnique({ where: { email } });
        if (adminExistente) {
            return res.status(400).json({ message: "El administrador ya existe." });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el administrador en la base de datos
        const nuevoAdmin = await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: "Administrador creado con éxito", admin: nuevoAdmin });
    } catch (error) {
        console.error("❌ Error al registrar administrador:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

/**
 * 📌 Iniciar sesión como administrador
 */
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar al administrador
        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ message: "Credenciales incorrectas." });
        }

        // Comparar contraseñas
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Credenciales incorrectas." });
        }

        // Generar token JWT
        const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: "2h" });
        console.log("TOKEN GENERADO:", token);

        res.json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        console.error("❌ Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

/**
 * 📌 Obtener todas las reservas (Solo admin)
 */
exports.getReservas = async (req, res) => {
    try {
        const reservas = await prisma.reserva.findMany({
            include: {
                habitacion: {
                    select: {
                        id: true,
                        tipo: true
                    }
                }
            }
        });
        
        res.json(reservas);
    } catch (error) {
        console.error("❌ Error al obtener reservas:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

/**
 * 📌 Eliminar una reserva por ID (Solo admin)
 */
exports.eliminarReserva = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.reserva.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Reserva eliminada correctamente." });
    } catch (error) {
        console.error("❌ Error al eliminar reserva:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};
