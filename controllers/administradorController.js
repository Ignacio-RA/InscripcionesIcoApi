import Administrador from "../models/administrador.js"; 

// Función para crear un nuevo Administrador (CREATE)
const registroAdministrador = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        // Validaciones para que ninguna celda quede vacía (evita undefined, null y strings vacíos)
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ msg: "El nombre es obligatorio y no debe quedar vacío." });
        }
        if (!correo || correo.trim() === "") {
            return res.status(400).json({ msg: "El correo electrónico es obligatorio y no debe quedar vacío." });
        }
        if (!password || password.trim() === "") {
            return res.status(400).json({ msg: "La contraseña es obligatoria y no debe quedar vacía." });
        }

        // Validación de formato de correo electrónico
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoRegex.test(correo.trim())) {
            return res.status(400).json({
                msg: "El correo electrónico proporcionado no tiene un formato válido."
            });
        }

        // Validación de longitud mínima de contraseña (opcional pero recomendada por seguridad)
        if (password.trim().length < 6) {
            return res.status(400).json({
                msg: "La contraseña debe tener al menos 6 caracteres."
            });
        }

        // Creación del registro en la base de datos 
        const nuevoAdmin = await Administrador.create({
            nombre: nombre.trim().toUpperCase(),
            correo: correo.trim().toLowerCase(), // Convencionalmente los correos van en minúsculas
            password: password.trim()
        });

        // Respondemos con éxito sin devolver el password, por seguridad
        return res.status(201).json({
            msg: "Administrador registrado exitosamente",
            administrador: {
                id: nuevoAdmin.id_admin,
                nombre: nuevoAdmin.nombre,
                correo: nuevoAdmin.correo,
                fecha_registro: nuevoAdmin.fecha_registro
            }
        });

    } catch (error) {
        console.error("Error al registrar administrador:", error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "El correo electrónico ya se encuentra registrado por otro administrador."
            });
        }

        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        });
    }
};

// Función para obtener todos los administradores  (READ)
const obtenerAdministradores = async (req, res) => {
    try {
        // Obtenemos los administradores, usando 'attributes' para excluir explícitamente el campo password
        const administradores = await Administrador.findAll({
            attributes: { exclude: ['password'] }
        });

        return res.status(200).json({
            msg: "Administradores obtenidos exitosamente",
            administradores
        });

    } catch (error) {
        console.error("Error al obtener administradores:", error);
        return res.status(500).json({
            msg: "Hubo un error en el servidor al intentar recuperar los datos."
        });
    }
};

export {
    registroAdministrador,
    obtenerAdministradores
};