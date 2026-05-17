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

        const nuevoHistorial = await Historial_Academico.create({
            id_alumno,
            id_materia,
            calificacion,
            periodo: periodo?.toUpperCase() // Mantenemos consistencia de mayúsculas
        })

        return res.status(201).json({
            msg: "Historial Académico registrado exitosamente",
            historial: nuevoHistorial
        })

    } catch (error) {
        console.error("Error al registrar historial", error)
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

        // Si se intenta cambiar el alumno, validar que el nuevo exista
        if (req.body.id_alumno) {
            const existeAlumno = await Alumno.findByPk(req.body.id_alumno)
            if (!existeAlumno) return res.status(404).json({ msg: "El nuevo ID de alumno no existe" })
        }

        // Si se intenta cambiar la materia, validar que la nueva exista
        if (req.body.id_materia) {
            const existeMateria = await Materia.findByPk(req.body.id_materia)
            if (!existeMateria) return res.status(404).json({ msg: "El nuevo ID de materia no existe" })
        }

        if (req.body.periodo) req.body.periodo = req.body.periodo.toUpperCase();

        await historial.update(req.body)
        return res.status(200).json({
            msg: "Historial actualizado exitosamente",
            historial
        })
    } catch (error) {
        console.error("Error al actualizar:", error)
        return res.status(500).json({ msg: "Hubo un error en el servidor" })
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
