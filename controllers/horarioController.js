import "../models/relaciones.js";
import Horario from "../models/horario.js";

// Función para el inicio del módulo de horarios
const inicioHorario = (req, res) => {
    res.json({
        msg: "Bienvenidos al módulo de Horarios de la API de Inscripciones de ICO",
        descripcion: "CRUD de horarios en la API de Inscripciones de ICO"
    })
}

// Función para crear un nuevo horario (CREATE)
const registroHorario = async (req, res) => {
    try {
        const { 
            lunes, martes, miercoles, jueves, viernes, sabado, 
            hra_inicio, hra_fin, salon, cupo, modalidad 
        } = req.body

        // Validación y asignación por defecto para los días (Booleanos)
        const dias = {
            lunes: lunes === true || lunes === 'true',
            martes: martes === true || martes === 'true',
            miercoles: miercoles === true || miercoles === 'true',
            jueves: jueves === true || jueves === 'true',
            viernes: viernes === true || viernes === 'true',
            sabado: sabado === true || sabado === 'true'
        }

        // Validación de horas (Deben estar presentes)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]?$/; // Formato HH:MM
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
            ...dias,
            hra_inicio,
            hra_fin,
            salon: salon.trim().toUpperCase(),
            cupo: parseInt(cupo),
            modalidad: modalidadFormateada
        })

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

// Función para obtener todos los horarios (READ)
const obtenerHorarios = async (req, res) => {
    try {
        const horarios = await Horario.findAll({
            attributes: [
                'id_horario', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 
                'hra_inicio', 'hra_fin', 'salon', 'cupo', 'modalidad'
            ]
        })
        return res.status(200).json({
            msg: "Horarios obtenidos exitosamente",
            horarios
        })
    } catch (error) {
        console.error("Error al obtener horarios:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para obtener un horario por su ID (READ)
const obtenerHorario = async (req, res) => {
    try {
        const { id } = req.params
        const horario = await Horario.findByPk(id, {
            attributes: [
                'id_horario', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 
                'hra_inicio', 'hra_fin', 'salon', 'cupo', 'modalidad'
            ]
        })

        if (!horario) {
            return res.status(404).json({
                msg: "Horario no encontrado"
            })
        }

        return res.status(200).json({
            msg: "Horario obtenido exitosamente",
            horario
        })
    } catch (error) {
        console.error("Error al obtener el horario:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para actualizar un horario por su ID (UPDATE)
const actualizarHorario = async (req, res) => {
    const { id } = req.params

    try {
        const horario = await Horario.findByPk(id)
        if (!horario) {
            return res.status(404).json({
                msg: "Horario no encontrado"
            })
        }

        // Si envían horas, validamos el formato
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]?$/;
        if (req.body.hra_inicio && !timeRegex.test(req.body.hra_inicio)) {
            return res.status(400).json({ msg: "La hora de inicio no tiene un formato válido (HH:MM)." });
        }
        if (req.body.hra_fin && !timeRegex.test(req.body.hra_fin)) {
            return res.status(400).json({ msg: "La hora de finalización no tiene un formato válido (HH:MM)." });
        }

        // Si envían salón, formateamos a MAYÚSCULAS
        if (req.body.salon) {
            req.body.salon = req.body.salon.trim().toUpperCase();
        }

        // Si envían cupo, validamos que sea positivo
        if (req.body.cupo && (isNaN(req.body.cupo) || parseInt(req.body.cupo) <= 0)) {
            return res.status(400).json({ msg: "El cupo debe ser un número entero positivo." });
        }

        // Si envían modalidad, validamos el ENUM de destino
        if (req.body.modalidad) {
            const modClean = req.body.modalidad.trim().toLowerCase();
            if (modClean === 'presencial') req.body.modalidad = 'Presencial';
            else if (modClean === 'en linea' || modClean === 'en línea') req.body.modalidad = 'En linea';
            else {
                return res.status(400).json({ msg: "La modalidad debe ser 'Presencial' o 'En linea'." });
            }
        }

        // Procesar los días booleanos si es que vienen en el body para actualizarlos correctamente
        const diasCampos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        diasCampos.forEach(dia => {
            if (req.body[dia] !== undefined) {
                req.body[dia] = req.body[dia] === true || req.body[dia] === 'true';
            }
        });

        await horario.update(req.body)

        return res.status(200).json({
            msg: "Horario actualizado exitosamente",
            horario
        })

    } catch (error) {
        console.error("Error al actualizar:", error)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "Este horario ya entra en conflicto con un registro único existente."
            })
        }
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intentelo de nuevo más tarde."
        })
    }
}

// Función para eliminar un horario por su ID (DELETE)
const eliminarHorario = async (req, res) => {
    const { id } = req.params

    try {
        const horario = await Horario.findByPk(id)
        if (!horario) {
            return res.status(404).json({
                msg: "Horario no encontrado"
            })
        }

        await horario.destroy()
        return res.status(200).json({
            msg: "Horario eliminado exitosamente"
        })

    } catch (error) {
        console.error("Error al eliminar:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intentelo de nuevo más tarde."
        })
    }
}

export {
    inicioHorario,
    registroHorario,
    obtenerHorarios,
    obtenerHorario,
    actualizarHorario,
    eliminarHorario
}