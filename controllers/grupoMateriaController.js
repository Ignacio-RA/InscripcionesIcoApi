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

        // 1. Validaciones para que ninguna celda quede vacía (control de undefined, null y strings vacíos)
        if (id_grupo === undefined || id_grupo === null || id_grupo.toString().trim() === "") {
            return res.status(400).json({ msg: "El ID del grupo es obligatorio y no debe quedar vacío." });
        }
        if (id_materia === undefined || id_materia === null || id_materia.toString().trim() === "") {
            return res.status(400).json({ msg: "El ID de la materia es obligatorio y no debe quedar vacío." });
        }
        if (id_horario === undefined || id_horario === null || id_horario.toString().trim() === "") {
            return res.status(400).json({ msg: "El ID del horario es obligatorio y no debe quedar vacío." });
        }
        if (id_profesor === undefined || id_profesor === null || id_profesor.toString().trim() === "") {
            return res.status(400).json({ msg: "El ID del profesor es obligatorio y no debe quedar vacío." });
        }

        // 2. Validaciones de formato (Asegurar que sean números enteros positivos válidos)
        if (isNaN(id_grupo) || parseInt(id_grupo) <= 0) {
            return res.status(400).json({ msg: "El ID del grupo debe ser un número entero positivo válido." });
        }
        if (isNaN(id_materia) || parseInt(id_materia) <= 0) {
            return res.status(400).json({ msg: "El ID de la materia debe ser un número entero positivo válido." });
        }
        if (isNaN(id_horario) || parseInt(id_horario) <= 0) {
            return res.status(400).json({ msg: "El ID del horario debe ser un número entero positivo válido." });
        }
        if (isNaN(id_profesor) || parseInt(id_profesor) <= 0) {
            return res.status(400).json({ msg: "El ID del profesor debe ser un número entero positivo válido." });
        }

        // 3. Verificar si existe el grupo en la BD
        const existeGrupo = await Grupo.findByPk(id_grupo)
        if (!existeGrupo) {
            return res.status(404).json({
                msg: `El grupo con ID ${id_grupo} no existe. No se puede realizar la asignación.`
            })
        }

        // 4. Verificar si existe la materia en la BD
        const existeMateria = await Materia.findByPk(id_materia)
        if (!existeMateria) {
            return res.status(404).json({
                msg: `La materia con ID ${id_materia} no existe. No se puede realizar la asignación.`
            })
        }

        // 5. Verificar si existe el horario en la BD
        const existeHorario = await Horario.findByPk(id_horario)
        if (!existeHorario) {
            return res.status(404).json({
                msg: `El horario con ID ${id_horario} no existe. No se puede realizar la asignación.`
            })
        }

        // 6. Verificar si existe el profesor en la BD
        const existeProfesor = await Profesor.findByPk(id_profesor)
        if (!existeProfesor) {
            return res.status(404).json({
                msg: `El profesor con ID ${id_profesor} no existe. No se puede realizar la asignación.`
            })
        }

        // Creación del registro en la base de datos con tipos de datos limpios
        const nuevaAsignacion = await Grupo_Materia.create({
            id_grupo: parseInt(id_grupo),
            id_materia: parseInt(id_materia),
            id_horario: parseInt(id_horario),
            id_profesor: parseInt(id_profesor)
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

        // 1. Validación condicional para id_grupo
        if (req.body.id_grupo !== undefined) {
            if (req.body.id_grupo === null || req.body.id_grupo.toString().trim() === "") {
                return res.status(400).json({ msg: "El ID del grupo no puede quedar vacío." });
            }
            if (isNaN(req.body.id_grupo) || parseInt(req.body.id_grupo) <= 0) {
                return res.status(400).json({ msg: "El ID del grupo debe ser un número entero positivo válido." });
            }
            
            // Si es válido, verificar que exista en la BD
            const existeGrupo = await Grupo.findByPk(req.body.id_grupo)
            if (!existeGrupo) return res.status(404).json({ msg: "El nuevo ID de grupo no existe." })
            
            req.body.id_grupo = parseInt(req.body.id_grupo);
        }

        // 2. Validación condicional para id_materia
        if (req.body.id_materia !== undefined) {
            if (req.body.id_materia === null || req.body.id_materia.toString().trim() === "") {
                return res.status(400).json({ msg: "El ID de la materia no puede quedar vacío." });
            }
            if (isNaN(req.body.id_materia) || parseInt(req.body.id_materia) <= 0) {
                return res.status(400).json({ msg: "El ID de la materia debe ser un número entero positivo válido." });
            }

            // Si es válido, verificar que exista en la BD
            const existeMateria = await Materia.findByPk(req.body.id_materia)
            if (!existeMateria) return res.status(404).json({ msg: "El nuevo ID de materia no existe." })
            
            req.body.id_materia = parseInt(req.body.id_materia);
        }

        // 3. Validación condicional para id_horario
        if (req.body.id_horario !== undefined) {
            if (req.body.id_horario === null || req.body.id_horario.toString().trim() === "") {
                return res.status(400).json({ msg: "El ID del horario no puede quedar vacío." });
            }
            if (isNaN(req.body.id_horario) || parseInt(req.body.id_horario) <= 0) {
                return res.status(400).json({ msg: "El ID del horario debe ser un número entero positivo válido." });
            }

            // Si es válido, verificar que exista en la BD
            const existeHorario = await Horario.findByPk(req.body.id_horario)
            if (!existeHorario) return res.status(404).json({ msg: "El nuevo ID de horario no existe." })
            
            req.body.id_horario = parseInt(req.body.id_horario);
        }

        // 4. Validación condicional para id_profesor
        if (req.body.id_profesor !== undefined) {
            if (req.body.id_profesor === null || req.body.id_profesor.toString().trim() === "") {
                return res.status(400).json({ msg: "El ID del profesor no puede quedar vacío." });
            }
            if (isNaN(req.body.id_profesor) || parseInt(req.body.id_profesor) <= 0) {
                return res.status(400).json({ msg: "El ID del profesor debe ser un número entero positivo válido." });
            }

            // Si es válido, verificar que exista en la BD
            const existeProfesor = await Profesor.findByPk(req.body.id_profesor)
            if (!existeProfesor) return res.status(404).json({ msg: "El nuevo ID de profesor no existe." })
            
            req.body.id_profesor = parseInt(req.body.id_profesor);
        }

        // Si todo está correcto, proceder con la actualización parcial
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