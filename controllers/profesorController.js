import "../models/relaciones.js";
import Profesor from "../models/profesor.js";

// Función para el inicio del módulo de profesores
const inicioProfesor = (req, res) => {
    res.json({
        msg: "Bienvenidos al módulo de Profesores de la API de Inscripciones de ICO",
        descripcion: "CRUD de profesores en la API de Inscripciones de ICO"
    })
}

// Función para crear un nuevo profesor (CREATE)
const registroProfesor = async (req, res) => {
    try {
        const { nombre, ap_paterno, ap_materno, correo } = req.body

        // Validaciones de campos obligatorios básicos
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ msg: "El nombre del profesor es obligatorio." });
        }
        if (!ap_paterno || ap_paterno.trim() === "") {
            return res.status(400).json({ msg: "El apellido paternal es obligatorio." });
        }

        // Validación de formato de correo electrónico
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correo || !correoRegex.test(correo)) {
            return res.status(400).json({
                msg: "El correo electrónico proporcionado no tiene un formato válido."
            });
        }

        // Conversión de campos de texto a MAYÚSCULAS
        const nombreMayus = nombre?.trim().toUpperCase();
        const apPaternoMayus = ap_paterno?.trim().toUpperCase();
        const apMaternoMayus = ap_materno ? ap_materno.trim().toUpperCase() : null;

        // Creación del registro en la base de datos
        const nuevoProfesor = await Profesor.create({
            nombre: nombreMayus,
            ap_paterno: apPaternoMayus,
            ap_materno: apMaternoMayus,
            correo: correo.trim().toLowerCase() // Se guarda en minúsculas por estándar
        })

        return res.status(201).json({
            msg: "Profesor registrado exitosamente",
            profesor: {
                id: nuevoProfesor.id_profesor,
                nombre: nuevoProfesor.nombre,
                ap_paterno: nuevoProfesor.ap_paterno,
                correo: nuevoProfesor.correo
            }
        })

    } catch (error) {
        console.error("error al registrar profesor", error)

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "El correo electrónico ya se encuentra registrado por otro profesor."
            })
        }

        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para obtener todos los profesores (READ)
const obtenerProfesores = async (req, res) => {
    try {
        const profesores = await Profesor.findAll({
            attributes: ['id_profesor', 'nombre', 'ap_paterno', 'ap_materno', 'correo']
        })
        return res.status(200).json({
            msg: "Profesores obtenidos exitosamente",
            profesores
        })
    } catch (error) {
        console.error("Error al obtener profesores:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para obtener un profesor por su ID (READ)
const obtenerProfesor = async (req, res) => {
    try {
        const { id } = req.params
        const profesor = await Profesor.findByPk(id, {
            attributes: ['id_profesor', 'nombre', 'ap_paterno', 'ap_materno', 'correo']
        })

        if (!profesor) {
            return res.status(404).json({
                msg: "Profesor no encontrado"
            })
        }

        return res.status(200).json({
            msg: "Profesor obtenido exitosamente",
            profesor
        })
    } catch (error) {
        console.error("Error al obtener el profesor:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para actualizar un profesor por su ID (UPDATE)
const actualizarProfesor = async (req, res) => {
    const { id } = req.params

    try {
        const profesor = await Profesor.findByPk(id)
        if (!profesor) {
            return res.status(404).json({
                msg: "Profesor no encontrado"
            })
        }

        // Si envían nombre, limpiamos espacios y pasamos a MAYÚSCULAS
        if (req.body.nombre) {
            req.body.nombre = req.body.nombre.trim().toUpperCase();
        }

        // Si envían ap_paterno, limpiamos espacios y pasamos a MAYÚSCULAS
        if (req.body.ap_paterno) {
            req.body.ap_paterno = req.body.ap_paterno.trim().toUpperCase();
        }

        // Si envían ap_materno, se limpia y se pasa a MAYÚSCULAS o se deja nulo
        if (req.body.ap_materno !== undefined) {
            req.body.ap_materno = req.body.ap_materno ? req.body.ap_materno.trim().toUpperCase() : null;
        }

        // Si envían correo, validamos el formato por Regex y formateamos a minúsculas
        if (req.body.correo) {
            const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!correoRegex.test(req.body.correo)) {
                return res.status(400).json({ msg: "El correo electrónico proporcionado no tiene un formato válido." });
            }
            req.body.correo = req.body.correo.trim().toLowerCase();
        }

        await profesor.update(req.body)

        return res.status(200).json({
            msg: "Profesor actualizado exitosamente",
            profesor
        })

    } catch (error) {
        console.error("Error al actualizar:", error)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "El correo electrónico ya se encuentra registrado por otro profesor."
            })
        }
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intentelo de nuevo más tarde."
        })
    }
}

// Función para eliminar un profesor por su ID (DELETE)
const eliminarProfesor = async (req, res) => {
    const { id } = req.params

    try {
        const profesor = await Profesor.findByPk(id)
        if (!profesor) {
            return res.status(404).json({
                msg: "Profesor no encontrado"
            })
        }

        await profesor.destroy()
        return res.status(200).json({
            msg: "Profesor eliminado exitosamente"
        })

    } catch (error) {
        console.error("Error al eliminar:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intentelo de nuevo más tarde."
        })
    }
}

export {
    inicioProfesor,
    registroProfesor,
    obtenerProfesores,
    obtenerProfesor,
    actualizarProfesor,
    eliminarProfesor
}