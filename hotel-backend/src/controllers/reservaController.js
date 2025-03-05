const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

// 📧 Configurar Nodemailer con SMTP de Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "developerdavid51@gmail.com", // 🔹 Reemplázalo con tu correo de Gmail
        pass: "eefa zeew zhwt wkpn",  // 🔹 Si usas 2FA, usa una "Contraseña de Aplicación"
    },
});






exports.crearReserva = async (req, res) => {
    try {
        const { cliente, telefono, email, habitacionId, fechaInicio, fechaFin } = req.body;

        // 🔎 Verificar si la habitación está disponible en esas fechas
        const reservaExistente = await prisma.reserva.findFirst({
            where: {
                habitacionId: habitacionId,
                OR: [
                    { fechaInicio: { lte: new Date(fechaFin) }, fechaFin: { gte: new Date(fechaInicio) } },
                ],
            },
        });

        if (reservaExistente) {
            return res.status(400).json({ message: "La habitación ya está reservada en esas fechas." });
        }

        // ✅ Crear la reserva en la base de datos
        const nuevaReserva = await prisma.reserva.create({
            data: {
                cliente,
                telefono,
                email,
                habitacionId,
                fechaInicio: new Date(fechaInicio),
                fechaFin: new Date(fechaFin),
            },
        });

        // 🔵 Generar QR con los detalles de la reserva
        const qrData = `Reserva confirmada:
        Cliente: ${cliente}
        Teléfono: ${telefono}
        Email: ${email}
        Habitación: ${habitacionId}
        Fechas: ${fechaInicio} - ${fechaFin}`;

        const qrCodeDataUrl = await QRCode.toDataURL(qrData);

        // 📧 Configurar y enviar el correo
        const mailOptions = {
            from: "developerdavid51@gmail.com",
            to: email,
            subject: "Confirmación de Reserva - Hotel Barcelona",
            html: `
                <h2>¡Reserva Confirmada!</h2>
                <p>Estimado/a <b>${cliente}</b>, tu reserva ha sido confirmada.</p>
                <p><b>Habitación:</b> ${habitacionId}</p>
                <p><b>Fechas:</b> ${fechaInicio} - ${fechaFin}</p>
                <p>Adjunto encontrarás tu código QR con los detalles de tu reserva.</p>
                <img src="${qrCodeDataUrl}" alt="Código QR" width="200"/>
            `,
        };

        await transporter.sendMail(mailOptions); // 📧 Enviar correo

        res.status(201).json({
            message: "Reserva creada con éxito y correo enviado.",
            reserva: nuevaReserva,
        });

    } catch (error) {
        console.error("❌ Error en la reserva:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};



/**
 * 📌 Obtener las fechas ocupadas de una habitación específica
 */
exports.getFechasOcupadas = async (req, res) => {
    try {
        const { habitacionId } = req.query;

        if (!habitacionId) {
            return res.status(400).json({ message: "Se requiere un ID de habitación." });
        }

        // Obtener todas las reservas de la habitación específica
        const reservas = await prisma.reserva.findMany({
            where: { habitacionId: parseInt(habitacionId) },
            select: {
                fechaInicio: true,
                fechaFin: true,
            },
        });

        // Convertir las fechas a formato adecuado para el frontend
        const fechasOcupadas = reservas.map(reserva => ({
            fechaInicio: reserva.fechaInicio.toISOString().split("T")[0],
            fechaFin: reserva.fechaFin.toISOString().split("T")[0]
        }));

        res.json(fechasOcupadas);
    } catch (error) {
        console.error("❌ Error al obtener fechas ocupadas:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};