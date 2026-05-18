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

        // 1. Validación de casillas vacías para los días de la semana
        if (
            lunes === undefined || lunes === '' ||
            martes === undefined || martes === '' ||
            miercoles === undefined || miercoles === '' ||
            jueves === undefined || jueves === '' ||
            viernes === undefined || viernes === '' ||
            sabado === undefined || sabado === ''
        ) {
            return res.status(400).json({
                msg: "No se debe dejar vacía ninguna casilla de los días de la semana. Debe especificar true o false para cada uno."
            });
        }

        // 2. Validación de casillas vacías para horas, salón y CUPO
        if (!hra_inicio || hra_inicio.trim() === "") {
            return res.status(400).json({ msg: "La hora de inicio es obligatoria y no debe quedar vacía." });
        }
        if (!hra_fin || hra_fin.trim() === "") {
            return res.status(400).json({ msg: "La hora de finalización es obligatoria y no debe quedar vacía." });
        }
        if (!salon || salon.trim() === "") {
            return res.status(400).json({ msg: "El salón es obligatorio y no debe quedar vacío." });
        }
        // Nueva validación de existencia para cupo
        if (cupo === undefined || cupo === null || cupo.toString().trim() === "") {
            return res.status(400).json({ msg: "El cupo es obligatorio y no debe quedar vacío." });
        }

        // Asignación segura de días una vez confirmado que no están vacíos
        const dias = {
            lunes: lunes === true || lunes === 'true',
            martes: martes === true || martes === 'true',
            miercoles: miercoles === true || miercoles === 'true',
            jueves: jueves === true || jueves === 'true',
            viernes: viernes === true || viernes === 'true',
            sabado: sabado === true || sabado === 'true'
        }

        // 3. Validación de formato de horas (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]?$/;
        if (!timeRegex.test(hra_inicio)) {
            return res.status(400).json({ msg: "La hora de inicio debe tener un formato válido (HH:MM)." });
        }
        if (!timeRegex.test(hra_fin)) {
            return res.status(400).json({ msg: "La hora de finalización debe tener un formato válido (HH:MM)." });
        }

        // 4. Validación de valor para el cupo (Debe ser entero positivo)
        if (isNaN(cupo) || parseInt(cupo) <= 0) {
            return res.status(400).json({ msg: "El cupo debe ser un número entero positivo mayor a cero." });
        }

        // Validación de modalidad (Basado en el ENUM 'Presencial' o 'En linea')
        let modalidadFormateada = null;
        if (modalidad) {
            const modClean = modalidad.trim().toLowerCase();
            if (modClean === 'presencial') modalidadFormateada = 'Presencial';
            if (modClean === 'en linea' || modClean === 'en línea') modalidadFormateada = 'En linea';
        }

        const modalitiesValidas = ['Presencial', 'En linea'];
        if (!modalidadFormateada || !modalitiesValidas.includes(modalidadFormateada)) {
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
            return res.status(400).json({ msg: "Este horario ya se encuentra registrado." })
        }
        return res.status(500).json({ msg: "Hubo un error en el servidor, intente más tarde." })
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
            return res.status(404).json({ msg: "Horario no encontrado" })
        }

        // 1. Validación condicional para los días de la semana
        const diasCampos = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
        const intentaActualizarDias = diasCampos.some(dia => req.body[dia] !== undefined);

        if (intentaActualizarDias) {
            const tieneCasillasVacias = diasCampos.some(dia => req.body[dia] === undefined || req.body[dia] === '');
            if (tieneCasillasVacias) {
                return res.status(400).json({
                    msg: "Si vas a modificar los días del horario, no debes dejar vacía ninguna casilla de la semana. Debes especificar true o false para cada uno."
                });
            }
            diasCampos.forEach(dia => {
                req.body[dia] = req.body[dia] === true || req.body[dia] === 'true';
            });
        }

        // 2. Validación de casillas vacías para horas (si es que vienen en el body)
        if (req.body.hra_inicio !== undefined && req.body.hra_inicio.trim() === "") {
            return res.status(400).json({ msg: "La hora de inicio no puede quedar vacía." });
        }
        if (req.body.hra_fin !== undefined && req.body.hra_fin.trim() === "") {
            return res.status(400).json({ msg: "La hora de finalización no puede quedar vacía." });
        }

        // 3. Validación de formato de horas
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]?$/;
        if (req.body.hra_inicio && !timeRegex.test(req.body.hra_inicio)) {
            return res.status(400).json({ msg: "La hora de inicio no tiene un formato válido (HH:MM)." });
        }
        if (req.body.hra_fin && !timeRegex.test(req.body.hra_fin)) {
            return res.status(400).json({ msg: "La hora de finalización no tiene un formato válido (HH:MM)." });
        }

        // 4. Validación de casilla vacía y formateo para el salón
        if (req.body.salon !== undefined) {
            if (req.body.salon.trim() === "") {
                return res.status(400).json({ msg: "El salón no puede quedar vacío." });
            }
            req.body.salon = req.body.salon.trim().toUpperCase();
        }

        // 5. NUEVA Validación de casilla vacía y valor para el CUPO
        if (req.body.cupo !== undefined) {
            if (req.body.cupo === null || req.body.cupo.toString().trim() === "") {
                return res.status(400).json({ msg: "El cupo no puede quedar vacío." });
            }
            if (isNaN(req.body.cupo) || parseInt(req.body.cupo) <= 0) {
                return res.status(400).json({ msg: "El cupo debe ser un número entero positivo." });
            }
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

        await horario.update(req.body)

        return res.status(200).json({
            msg: "Horario actualizado exitosamente",
            horario
        })

    } catch (error) {
        console.error("Error al actualizar:", error)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ msg: "Este horario ya entra en conflicto con un registro único existente." })
        }
        return res.status(500).json({ msg: "Hubo un error en el servidor, intentelo de nuevo más tarde." })
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