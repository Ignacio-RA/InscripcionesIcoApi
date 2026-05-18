import db from "../config/db.js"
import { Alumno, Materia, Historial_Academico } from "../models/relaciones.js"

// Función para el inicio del módulo (Opcional, siguiendo tu estándar)
const inicioHistorial = (req, res) => {
    res.json({
        msg: "Bienvenidos al módulo de Historial Académico de la API de Inscripciones de ICO",
        descripcion: "CRUD de historial académico en la API de Inscripciones de ICO"
    })
}

// Función para registrar un nuevo historial_academico (CREATE)
const registroHistorial = async (req, res) => {
    try {
        const { id_alumno, id_materia, calificacion, periodo } = req.body

        // 1. Validaciones para que ninguna celda quede vacía
        if (id_alumno === undefined || id_alumno === null || id_alumno.toString().trim() === "") {
            return res.status(400).json({ msg: "El ID del alumno es obligatorio y no debe quedar vacío." });
        }
        if (id_materia === undefined || id_materia === null || id_materia.toString().trim() === "") {
            return res.status(400).json({ msg: "El ID de la materia es obligatorio y no debe quedar vacío." });
        }
        if (calificacion === undefined || calificacion === null || calificacion.toString().trim() === "") {
            return res.status(400).json({ msg: "La calificación es obligatoria y no debe quedar vacía." });
        }
        if (!periodo || periodo.trim() === "") {
            return res.status(400).json({ msg: "El periodo es obligatorio y no debe quedar vacío." });
        }

        // 2. Validaciones de formato y valores válidos
        if (isNaN(id_alumno) || parseInt(id_alumno) <= 0) {
            return res.status(400).json({ msg: "El ID del alumno debe ser un número entero positivo válido." });
        }
        if (isNaN(id_materia) || parseInt(id_materia) <= 0) {
            return res.status(400).json({ msg: "El ID de la materia debe ser un número entero positivo válido." });
        }
        
        // Validar que la calificación sea un número entre 0 y 10 (puedes ajustar el rango si usan otra escala)
        const nota = parseFloat(calificacion);
        if (isNaN(nota) || nota < 0 || nota > 10) {
            return res.status(400).json({ msg: "La calificación debe ser un número válido entre 0.0 y 10.0." });
        }

        // Verificar si existe alumno 
        const existeAlumno = await Alumno.findByPk(id_alumno)
        if (!existeAlumno) {
            return res.status(404).json({
                msg: `El alumno con ID ${id_alumno} no existe. No se puede asignar el alumno`
            })
        }

        // Verificar si existe materia
        const existeMateria = await Materia.findByPk(id_materia)
        if (!existeMateria) {
            return res.status(404).json({
                msg: `La materia con ID ${id_materia} no existe. No se puede asignar la materia`
            })
        }

        // Creación del registro con los datos limpios y formateados
        const nuevoHistorial = await Historial_Academico.create({
            id_alumno: parseInt(id_alumno),
            id_materia: parseInt(id_materia),
            calificacion: nota,
            periodo: periodo.trim().toUpperCase() // Mantenemos consistencia de mayúsculas sin espacios extra
        })

        return res.status(201).json({
            msg: "Historial Académico registrado exitosamente",
            historial: nuevoHistorial
        })

    } catch (error) {
        console.error("Error al registrar historial", error)
        
        // Por si tienes un índice único para evitar que se duplique la misma materia para el mismo alumno en el mismo periodo
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "Ya existe un registro de historial académico para este alumno, materia y periodo."
            })
        }

        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde"
        })
    }
}

// Función para obtener todos los historiales (READ)
const obtenerHistoriales = async (req, res) => {
    try {
        const historiales = await Historial_Academico.findAll({
            attributes: ['id_historial', 'id_alumno', 'id_materia', 'calificacion', 'periodo'],
            include: [
                { model: Alumno, attributes: ['nombre', 'ap_paterno'] },
                { model: Materia, attributes: ['nombre'] }
            ]
        })

        return res.status(200).json({
            msg: "Historiales obtenidos exitosamente",
            historiales
        })

    } catch (error) {
        console.error("Error al obtener historiales", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Funcion para obtener un historial por su ID (READ)
const obtenerHistorial = async (req, res) => {
    try {
        const { id } = req.params
        const historial = await Historial_Academico.findByPk(id, {
            attributes: ['id_historial', 'id_alumno', 'id_materia', 'calificacion', 'periodo'],
            include: [
                { model: Alumno, attributes: ['nombre', 'ap_paterno'] },
                { model: Materia, attributes: ['nombre'] }
            ]
        })
        if (!historial) {
            return res.status(404).json({
                msg: `No se encontro un historial con ID ${id}.`
            })
        }
        return res.status(200).json({
            msg: "Historial obtenido exitosamente",
            historial
        })
    } catch (error) {
        console.error("Error al obtener historial", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde"
        })
    }
}

// Función para actualizar un historial por su ID (UPDATE)
const actualizarHistorial = async (req, res) => {
    const { id } = req.params
    try {
        const historial = await Historial_Academico.findByPk(id)
        if (!historial) {
            return res.status(404).json({ msg: "Historial no encontrado" })
        }

        // 1. Validación condicional para id_alumno
        if (req.body.id_alumno !== undefined) {
            if (req.body.id_alumno === null || req.body.id_alumno.toString().trim() === "") {
                return res.status(400).json({ msg: "El ID del alumno no puede quedar vacío." });
            }
            if (isNaN(req.body.id_alumno) || parseInt(req.body.id_alumno) <= 0) {
                return res.status(400).json({ msg: "El ID del alumno debe ser un número entero positivo válido." });
            }
            
            // Validar que el nuevo exista en la BD
            const existeAlumno = await Alumno.findByPk(req.body.id_alumno)
            if (!existeAlumno) return res.status(404).json({ msg: "El nuevo ID de alumno no existe." })
        }

        // 2. Validación condicional para id_materia
        if (req.body.id_materia !== undefined) {
            if (req.body.id_materia === null || req.body.id_materia.toString().trim() === "") {
                return res.status(400).json({ msg: "El ID de la materia no puede quedar vacío." });
            }
            if (isNaN(req.body.id_materia) || parseInt(req.body.id_materia) <= 0) {
                return res.status(400).json({ msg: "El ID de la materia debe ser un número entero positivo válido." });
            }

            // Validar que la nueva exista en la BD
            const existeMateria = await Materia.findByPk(req.body.id_materia)
            if (!existeMateria) return res.status(404).json({ msg: "El nuevo ID de materia no existe." })
        }

        // 3. Validación condicional para la calificación (rango de 0 a 10)
        if (req.body.calificacion !== undefined) {
            if (req.body.calificacion === null || req.body.calificacion.toString().trim() === "") {
                return res.status(400).json({ msg: "La calificación no puede quedar vacía." });
            }
            
            const nota = parseFloat(req.body.calificacion);
            if (isNaN(nota) || nota < 0 || nota > 10) {
                return res.status(400).json({ msg: "La calificación debe ser un número válido entre 0.0 y 10.0." });
            }
            req.body.calificacion = nota; // Guardamos el valor ya convertido a flotante
        }

        // 4. Validación condicional para el periodo
        if (req.body.periodo !== undefined) {
            if (req.body.periodo === null || req.body.periodo.trim() === "") {
                return res.status(400).json({ msg: "El periodo no puede quedar vacío." });
            }
            req.body.periodo = req.body.periodo.trim().toUpperCase();
        }

        // Procedemos a actualizar el registro con los datos validados y limpios
        await historial.update(req.body)
        
        return res.status(200).json({
            msg: "Historial actualizado exitosamente",
            historial
        })
    } catch (error) {
        console.error("Error al actualizar:", error)
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "La actualización genera un conflicto con un registro de historial ya existente para este alumno."
            })
        }

        return res.status(500).json({ msg: "Hubo un error en el servidor, inténtelo de nuevo más tarde." })
    }
}

// Función para eliminar un historial por su ID (DELETE)
const eliminarHistorial = async (req, res) => {
    const { id } = req.params
    try {
        const historial = await Historial_Academico.findByPk(id)
        if (!historial) {
            return res.status(404).json({ msg: "Historial no encontrado" })
        }
        await historial.destroy()
        return res.status(200).json({ msg: "Historial eliminado exitosamente" })
    } catch (error) {
        console.error("Error al eliminar:", error)
        return res.status(500).json({ msg: "Hubo un error en el servidor" })
    }
}

export {
    inicioHistorial,
    registroHistorial,
    obtenerHistoriales,
    obtenerHistorial,
    actualizarHistorial,
    eliminarHistorial
}
