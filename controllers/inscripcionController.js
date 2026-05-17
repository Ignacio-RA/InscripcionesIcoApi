import db from "../config/db.js"
import { Alumno, Materia, Grupo,Grupo_Materia,Inscripcion } from "../models/relaciones.js"
// Función para el inicio del módulo de inscripciones
const inicioInscripcion = (req, res) => {
    res.json({
        msg: "Bienvenidos al módulo de Inscripciones de la API de Inscripciones de ICO",
        descripcion: "CRUD de inscripciones de alumnos en sus respectivos grupos y materias"
    })
}

// Función para registrar una nueva inscripción (CREATE)  
const registroInscripcion = async (req, res) => {
    try {
        const { id_gpo_materia, id_alumno } = req.body

        // Verificar si existe la asignación grupo_materia
        const existeGrupoMateria = await Grupo_Materia.findByPk(id_gpo_materia)
        if (!existeGrupoMateria) {
            return res.status(404).json({
                msg: `La asignación Grupo-Materia con ID ${id_gpo_materia} no existe. No se puede realizar la inscripción.`
            })
        }

        // Verificar si existe el alumno
        const existeAlumno = await Alumno.findByPk(id_alumno)
        if (!existeAlumno) {
            return res.status(404).json({
                msg: `El alumno con ID ${id_alumno} no existe. No se puede realizar la inscripción.`
            })
        }

        // Creación del registro en la base de datos (fecha_inscripcion se asigna por defecto)
        const nuevaInscripcion = await Inscripcion.create({
            id_gpo_materia,
            id_alumno
        })

        return res.status(201).json({
            msg: "Inscripción registrada exitosamente",
            inscripcion: nuevaInscripcion
        })

    } catch (error) {
        console.error("Error al registrar inscripción", error)

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "El alumno ya se encuentra inscrito en este grupo-materia."
            })
        }

        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para obtener todas las inscripciones (READ)
const obtenerInscripciones = async (req, res) => {
    try {
        const inscripciones = await Inscripcion.findAll({   
            attributes: ['id_inscripcion', 'id_gpo_materia', 'id_alumno', 'fecha_inscripcion'],
            include: [
                {
                    model: Alumno,
                    attributes: ['nmo_cuenta', 'nombre', 'ap_paterno', 'ap_materno']
                },
                {
                    model: Grupo_Materia,
                    attributes: ['id_grupo', 'id_materia', 'id_horario'],
                    include: [
                        { model: Grupo, attributes: ['nombre_grupo', 'turno'] },
                        { model: Materia, attributes: ['cve_materia', 'nombre'] }
                    ]
                }
            ]
        })

        return res.status(200).json({
            msg: "Inscripciones obtenidas exitosamente",
            inscripciones
        })
    } catch (error) {
        console.error("Error al obtener inscripciones:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para obtener una inscripción por su ID (READ)
const obtenerInscripcion = async (req, res) => {
    try {
        const { id } = req.params
        const inscripcion = await Inscripcion.findByPk(id, {
            attributes: ['id_inscripcion', 'id_gpo_materia', 'id_alumno', 'fecha_inscripcion'],
            include: [
                {
                    model: Alumno,
                    attributes: ['nmo_cuenta', 'nombre', 'ap_paterno', 'ap_materno']
                },
                {
                    model: Grupo_Materia,
                    attributes: ['id_grupo', 'id_materia', 'id_horario'],
                    include: [
                        { model: Grupo, attributes: ['nombre_grupo', 'turno'] },
                        { model: Materia, attributes: ['cve_materia', 'nombre'] }
                    ]
                }
            ]
        })

        if (!inscripcion) {
            return res.status(404).json({
                msg: `No se encontró la inscripción con ID ${id}.`
            })
        }

        return res.status(200).json({
            msg: "Inscripción obtenida exitosamente",
            inscripcion
        })
    } catch (error) {
        console.error("Error al obtener la inscripción:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para actualizar una inscripción por su ID (UPDATE)
const actualizarInscripcion = async (req, res) => {
    const { id } = req.params

    try {
        const inscripcion = await Inscripcion.findByPk(id)
        if (!inscripcion) {
            return res.status(404).json({ msg: "Inscripción no encontrada" })
        }

        // Si se intenta cambiar el grupo-materia, validar que exista
        if (req.body.id_gpo_materia) {
            const existeGrupoMateria = await Grupo_Materia.findByPk(req.body.id_gpo_materia)
            if (!existeGrupoMateria) {
                return res.status(404).json({ msg: "El nuevo ID de Grupo-Materia no existe." })
            }
        }

        // Si se intenta cambiar el alumno, validar que exista
        if (req.body.id_alumno) {
            const existeAlumno = await Alumno.findByPk(req.body.id_alumno)
            if (!existeAlumno) {
                return res.status(404).json({ msg: "El alumno no existe." })
            }
        }

        await inscripcion.update(req.body)

        return res.status(200).json({
            msg: "Inscripción actualizada exitosamente",
            inscripcion
        })

    } catch (error) {
        console.error("Error al actualizar la inscripción:", error)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "Los datos enviados generan una duplicación con una inscripción existente."
            })
        }
        return res.status(500).json({ msg: "Hubo un error en el servidor, inténtelo de nuevo más tarde." })
    }
}

// Función para eliminar una inscripción por su ID (DELETE)
const eliminarInscripcion = async (req, res) => {
    const { id } = req.params

    try {
        const inscripcion = await Inscripcion.findByPk(id)
        if (!inscripcion) {
            return res.status(404).json({ msg: "Inscripción no encontrada" })
        }

        await inscripcion.destroy()
        return res.status(200).json({ msg: "Inscripción eliminada exitosamente" })

    } catch (error) {
        console.error("Error al eliminar la inscripción:", error)
        return res.status(500).json({ msg: "Hubo un error en el servidor, inténtelo de nuevo más tarde." })
    }
}

export {
    inicioInscripcion,
    registroInscripcion,
    obtenerInscripciones,
    obtenerInscripcion,
    actualizarInscripcion,
    eliminarInscripcion
}