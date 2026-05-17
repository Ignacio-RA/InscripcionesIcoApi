import "../models/relaciones.js";
import Grupo_Materia from "../models/grupo_materias.js";
import Grupo from "../models/grupo.js";
import Materia from "../models/materia.js";
import Horario from "../models/horario.js";
import Profesor from "../models/profesor.js";

// Función para el inicio del módulo de grupo_materia
const inicioGrupoMateria = (req, res) => {
    res.json({
        msg: "Bienvenidos al módulo de Grupo-Materia de la API de Inscripciones de ICO",
        descripcion: "CRUD de la asignación de materias a grupos, horarios y profesores"
    })
}

// Función para registrar una nueva asignación grupo_materia (CREATE)
const registroGrupoMateria = async (req, res) => {
    try {
        const { id_grupo, id_materia, id_horario, id_profesor } = req.body

        //  Verificar si existe el grupo
        const existeGrupo = await Grupo.findByPk(id_grupo)
        if (!existeGrupo) {
            return res.status(404).json({
                msg: `El grupo con ID ${id_grupo} no existe. No se puede realizar la asignación.`
            })
        }

        //  Verificar si existe la materia
        const existeMateria = await Materia.findByPk(id_materia)
        if (!existeMateria) {
            return res.status(404).json({
                msg: `La materia con ID ${id_materia} no existe. No se puede realizar la asignación.`
            })
        }

        // Verificar si existe el horario
        const existeHorario = await Horario.findByPk(id_horario)
        if (!existeHorario) {
            return res.status(404).json({
                msg: `El horario con ID ${id_horario} no existe. No se puede realizar la asignación.`
            })
        }

        //  Verificar si existe el profesor
        const existeProfesor = await Profesor.findByPk(id_profesor)
        if (!existeProfesor) {
            return res.status(404).json({
                msg: `El profesor con ID ${id_profesor} no existe. No se puede realizar la asignación.`
            })
        }

        // Creación del registro en la base de datos
        const nuevaAsignacion = await Grupo_Materia.create({
            id_grupo,
            id_materia,
            id_horario,
            id_profesor
        })

        return res.status(201).json({
            msg: "Asignación de Grupo-Materia registrada exitosamente",
            grupoMateria: nuevaAsignacion
        })

    } catch (error) {
        console.error("Error al registrar grupo_materia", error)
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "Esta asignación exacta ya se encuentra registrada en el sistema."
            })
        }

        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para obtener todas las asignaciones (READ)
const obtenerGruposMaterias = async (req, res) => {
    try {
        const asignaciones = await Grupo_Materia.findAll({
            attributes: ['id_gpo_materia', 'id_grupo', 'id_materia', 'id_horario', 'id_profesor'],
            include: [
                { model: Grupo, attributes: ['nombre_grupo', 'turno', 'semestre'] },
                { model: Materia, attributes: ['cve_materia', 'nombre'] },
                { model: Horario, attributes: ['hra_inicio', 'hra_fin', 'salon', 'modalidad'] },
                { model: Profesor, attributes: ['nombre', 'ap_paterno', 'correo'] }
            ]
        })

        return res.status(200).json({
            msg: "Asignaciones obtenidas exitosamente",
            asignaciones
        })
    } catch (error) {
        console.error("Error al obtener asignaciones:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para obtener una asignación por su ID (READ)
const obtenerGrupoMateria = async (req, res) => {
    try {
        const { id } = req.params
        const asignacion = await Grupo_Materia.findByPk(id, {
            attributes: ['id_gpo_materia', 'id_grupo', 'id_materia', 'id_horario', 'id_profesor'],
            include: [
                { model: Grupo, attributes: ['nombre_grupo', 'turno', 'semestre'] },
                { model: Materia, attributes: ['cve_materia', 'nombre'] },
                { model: Horario, attributes: ['hra_inicio', 'hra_fin', 'salon', 'modalidad'] },
                { model: Profesor, attributes: ['nombre', 'ap_paterno', 'correo'] }
            ]
        })

        if (!asignacion) {
            return res.status(404).json({
                msg: `No se encontró la asignación Grupo-Materia con ID ${id}.`
            })
        }

        return res.status(200).json({
            msg: "Asignación obtenida exitosamente",
            asignacion
        })
    } catch (error) {
        console.error("Error al obtener la asignación:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para actualizar una asignación por su ID (UPDATE)
const actualizarGrupoMateria = async (req, res) => {
    const { id } = req.params

    try {
        const asignacion = await Grupo_Materia.findByPk(id)
        if (!asignacion) {
            return res.status(404).json({ msg: "Asignación Grupo-Materia no encontrada" })
        }

        // Si se intenta cambiar el grupo, validar que exista
        if (req.body.id_grupo) {
            const existeGrupo = await Grupo.findByPk(req.body.id_grupo)
            if (!existeGrupo) return res.status(404).json({ msg: "El nuevo ID de grupo no existe." })
        }

        // Si se intenta cambiar la materia, validar que exista
        if (req.body.id_materia) {
            const existeMateria = await Materia.findByPk(req.body.id_materia)
            if (!existeMateria) return res.status(404).json({ msg: "El nuevo ID de materia no existe." })
        }

        // Si se intenta cambiar el horario, validar que exista
        if (req.body.id_horario) {
            const existeHorario = await Horario.findByPk(req.body.id_horario)
            if (!existeHorario) return res.status(404).json({ msg: "El nuevo ID de horario no existe." })
        }

        // Si se intenta cambiar el profesor, validar que exista
        if (req.body.id_profesor) {
            const existeProfesor = await Profesor.findByPk(req.body.id_profesor)
            if (!existeProfesor) return res.status(404).json({ msg: "El nuevo ID de profesor no existe." })
        }

        await asignacion.update(req.body)

        return res.status(200).json({
            msg: "Asignación Grupo-Materia actualizada exitosamente",
            grupoMateria: asignacion
        })

    } catch (error) {
        console.error("Error al actualizar:", error)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "Los datos enviados entran en conflicto con una asignación existente."
            })
        }
        return res.status(500).json({ msg: "Hubo un error en el servidor, inténtelo de nuevo más tarde." })
    }
}

// Función para eliminar una asignación por su ID (DELETE)
const eliminarGrupoMateria = async (req, res) => {
    const { id } = req.params

    try {
        const asignacion = await Grupo_Materia.findByPk(id)
        if (!asignacion) {
            return res.status(404).json({ msg: "Asignación Grupo-Materia no encontrada" })
        }

        await asignacion.destroy()
        return res.status(200).json({ msg: "Asignación Grupo-Materia eliminada exitosamente" })

    } catch (error) {
        console.error("Error al eliminar:", error)
        return res.status(500).json({ msg: "Hubo un error en el servidor, inténtelo de nuevo más tarde." })
    }
}

export {
    inicioGrupoMateria,
    registroGrupoMateria,
    obtenerGruposMaterias,
    obtenerGrupoMateria,
    actualizarGrupoMateria,
    eliminarGrupoMateria
}