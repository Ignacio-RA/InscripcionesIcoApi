import "../models/relaciones.js";
import Profesor from "../models/profesor.js";

// Función para el inicio del módulo de profesores
const inicioProfesor = (req, res) => {
    res.json({
        msg: "Bienvenidos al módulo de Profesores de la API de Inscripciones de ICO",
        descripcion: "CRUD de profesores en la API de Inscripciones de ICO"
    })
}

// Función para crear un nuevo profesor (Create)
const registroProfesor = async (req, res) => {
    try {
        const { nombre, ap_paterno, ap_materno, correo } = req.body

        // Validaciones de campos obligatorios básicos
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ msg: "El nombre del profesor es obligatorio." });
        }
        if (!ap_paterno || ap_paterno.trim() === "") {
            return res.status(400).json({ msg: "El apellido paterno es obligatorio." });
        }

        // Validación de formato de correo electrónico
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correo || !correoRegex.test(correo)) {
            return res.status(400).json({
                msg: "El correo electrónico proporcionado no tiene un formato válido."
            });
        }

        // Conversión de campos de texto a MAYÚSCULAS
        // Se usa ?. (optional chaining) y trim() para limpiar espacios vacíos
        const nombreMayus = nombre?.trim().toUpperCase();
        const apPaternoMayus = ap_paterno?.trim().toUpperCase();
        // ap_materno puede ser null según tu modelo, si viene se procesa, si no, se queda null
        const apMaternoMayus = ap_materno ? ap_materno.trim().toUpperCase() : null;

        // Creación del registro en la base de datos
        const nuevoProfesor = await Profesor.create({
            nombre: nombreMayus,
            ap_paterno: apPaternoMayus,
            ap_materno: apMaternoMayus,
            correo: correo.trim().toLowerCase() // El correo usualmente se guarda en minúsculas
        })

        // Se responde con un mensaje de éxito y estatus 201 (CREATED)
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

        // para evitar duplicar all profesor 
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

export {
    inicioProfesor,
    registroProfesor
}