import "../models/relaciones.js";
import Horario from "../models/horario.js";

// Función para el inicio del módulo de horarios
const inicioHorario = (req, res) => {
    res.json({
        msg: "Bienvenidos al módulo de Horarios de la API de Inscripciones de ICO",
        descripcion: "CRUD de horarios en la API de Inscripciones de ICO"
    })
}

// Función para crear un nuevo horario (Create)
const registroHorario = async (req, res) => {
    try {
        const { 
            lunes, martes, miercoles, jueves, viernes, sabado, 
            hra_inicio, hra_fin, salon, cupo, modalidad 
        } = req.body

        // Validación y asignación por defecto para los días (Booleanos)
        // Si no se envían en el body, se interpretan como 'false'
        const dias = {
            lunes: lunes === true || lunes === 'true',
            martes: martes === true || martes === 'true',
            miercoles: miercoles === true || miercoles === 'true',
            jueves: jueves === true || jueves === 'true',
            viernes: viernes === true || viernes === 'true',
            sabado: sabado === true || sabado === 'true'
        }

        // Validación de horas (Deben estar presentes)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]?$/; // Formato HH:MM o HH:MM:SS
        if (!hra_inicio || !timeRegex.test(hra_inicio)) {
            return res.status(400).json({
                msg: "La hora de inicio es obligatoria y debe tener un formato válido (HH:MM)."
            });
        }
        if (!hra_fin || !timeRegex.test(hra_fin)) {
            return res.status(400).json({
                msg: "La hora de finalización es obligatoria y debe tener un formato válido (HH:MM)."
            });
        }

        // Validación de salón y cupo
        if (!salon || salon.trim() === "") {
            return res.status(400).json({ msg: "El salón es obligatorio." });
        }
        if (!cupo || isNaN(cupo) || parseInt(cupo) <= 0) {
            return res.status(400).json({ msg: "El cupo es obligatorio y debe ser un número entero positivo." });
        }

        // Validación de modalidad (Basado en el ENUM 'Presencial' o 'En linea')
        // Estandarizamos el texto para que coincida exactamente con las opciones del modelo
        let modalidadFormateada = null;
        if (modalidad) {
            const modClean = modalidad.trim().toLowerCase();
            if (modClean === 'presencial') modalidadFormateada = 'Presencial';
            if (modClean === 'en linea' || modClean === 'en línea') modalidadFormateada = 'En linea';
        }

        const modalidadesValidas = ['Presencial', 'En linea'];
        if (!modalidadFormateada || !modalidadesValidas.includes(modalidadFormateada)) {
            return res.status(400).json({
                msg: "La modalidad no es válida. Debe ser 'Presencial' o 'En linea'."
            });
        }

        // Creación del registro en la base de datos
        const nuevoHorario = await Horario.create({
            ...dias, // Esparcimos los booleanos de los días ya normalizados
            hra_inicio,
            hra_fin,
            salon: salon.trim().toUpperCase(), // Mantenemos la consistencia de mayúsculas en texto
            cupo: parseInt(cupo),
            modalidad: modalidadFormateada
        })

        // Respuesta exitosa 201 (CREATED)
        return res.status(201).json({
            msg: "Horario registrado exitosamente",
            horario: {
                id: nuevoHorario.id_horario,
                salon: nuevoHorario.salon,
                modalidad: nuevoHorario.modalidad,
                hra_inicio: nuevoHorario.hra_inicio,
                hra_fin: nuevoHorario.hra_fin
            }
        })

    } catch (error) {
        console.error("error al registrar horario", error)

        //Para evitar duplicacion del horario
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "Este horario ya se encuentra registrado."
            })
        }

        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

export {
    inicioHorario,
    registroHorario
}