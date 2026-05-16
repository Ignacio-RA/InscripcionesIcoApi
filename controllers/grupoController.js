import "../models/relaciones.js";
import Grupo from "../models/grupo.js";

// Función para el inicio del módulo de grupos
const inicioGrupo = (req, res) => {
    res.json({
        msg: "Bienvenidos al módulo de Grupos de la API de Inscripciones de ICO",
        descripcion: "CRUD de grupos en la API de Inscripciones de ICO"
    })
}

// Función para crear un nuevo grupo (CREATE)
const registroGrupo = async (req, res) => {
    try {
        const { nombre_grupo, turno, semestre } = req.body

        // 1. Validación de nombre_grupo
        if (!nombre_grupo || nombre_grupo.trim() === "") {
            return res.status(400).json({
                msg: "El nombre del grupo es obligatorio."
            });
        }

        // 2. Validación de turno (Convertimos a MAYÚSCULAS para aceptar 'm' o 'v')
        const turnoMayus = turno?.toUpperCase();
        const turnosValidos = ['M', 'V'];
        if (!turnoMayus || !turnosValidos.includes(turnoMayus)) {
            return res.status(400).json({
                msg: "El turno no es válido. Debe ser 'M' (Matutino) o 'V' (Vespertino)."
            });
        }

        // 3. Validación de semestre (Basado en tu ENUM del '1' al '10')
        const semestresValidos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        if (!semestre || !semestresValidos.includes(semestre.toString())) {
            return res.status(400).json({
                msg: "El semestre no es válido. Debe ser un valor entre el 1 y el 10."
            });
        }

        // Conversión del nombre del grupo a MAYÚSCULAS para mantener consistencia
        const nombreGrupoMayus = nombre_grupo.trim().toUpperCase();

        // Creación del registro en la base de datos con Sequelize
        const nuevoGrupo = await Grupo.create({
            nombre_grupo: nombreGrupoMayus,
            turno: turnoMayus,
            semestre: semestre.toString()
        })

        // Respuesta exitosa 201 (CREATED)
        return res.status(201).json({
            msg: "Grupo registrado exitosamente",
            grupo: {
                id: nuevoGrupo.id_grupo,
                nombre_grupo: nuevoGrupo.nombre_grupo,
                turno: nuevoGrupo.turno,
                semestre: nuevoGrupo.semestre
            }
        })

    } catch (error) {
        console.error("error al registrar grupo", error)

        // Para evitar duplicación de grupo
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "El grupo ya se encuentra registrado."
            })
        }

        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para obtener todos los grupos (READ)
const obtenerGrupos = async (req, res) => {
    try {
        const grupos = await Grupo.findAll({
            attributes: ['id_grupo', 'nombre_grupo', 'turno', 'semestre']
        })
        return res.status(200).json({
            msg: "Grupos obtenidos exitosamente",
            grupos
        })
    } catch (error) {
        console.error("Error al obtener grupos:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para obtener un grupo por su ID (READ)
const obtenerGrupo = async (req, res) => {
    try {
        const { id } = req.params
        const grupo = await Grupo.findByPk(id, {
            attributes: ['id_grupo', 'nombre_grupo', 'turno', 'semestre']
        })

        if (!grupo) {
            return res.status(404).json({
                msg: "Grupo no encontrado"
            })
        }

        return res.status(200).json({
            msg: "Grupo obtenido exitosamente",
            grupo
        })
    } catch (error) {
        console.error("Error al obtener el grupo:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para actualizar un grupo por su ID (UPDATE)
const actualizarGrupo = async (req, res) => {
    const { id } = req.params

    try {
        const grupo = await Grupo.findByPk(id)
        if (!grupo) {
            return res.status(404).json({
                msg: "Grupo no encontrado"
            })
        }

        // Si envían turno, lo formateamos a MAYÚSCULAS y validamos antes de actualizar
        if (req.body.turno) {
            req.body.turno = req.body.turno.toUpperCase();
            const turnosValidos = ['M', 'V'];
            if (!turnosValidos.includes(req.body.turno)) {
                return res.status(400).json({
                    msg: "El turno no es válido. Debe ser 'M' o 'V'."
                });
            }
        }

        // Si envían nombre, limpiamos espacios y pasamos a MAYÚSCULAS
        if (req.body.nombre_grupo) {
            req.body.nombre_grupo = req.body.nombre_grupo.trim().toUpperCase();
        }

        // Si envían el semestre, validamos las opciones permitidas
        if (req.body.semestre) {
            const semestresValidos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            if (!semestresValidos.includes(req.body.semestre.toString())) {
                return res.status(400).json({
                    msg: "El semestre no es válido. Debe ser un valor entre el 1 y el 10."
                });
            }
        }

        await grupo.update(req.body)

        return res.status(200).json({
            msg: "Grupo actualizado exitosamente",
            grupo
        })

    } catch (error) {
        console.error("Error al actualizar:", error)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "El nombre del grupo ya se encuentra registrado."
            })
        }
        return res.status(500).json({
            msg: "Hubo un error en el servidor, inténtelo de nuevo más tarde."
        })
    }
}

// Función para eliminar un grupo por su ID (DELETE)
const eliminarGrupo = async (req, res) => {
    const { id } = req.params

    try {
        const grupo = await Grupo.findByPk(id)
        if (!grupo) {
            return res.status(404).json({
                msg: "Grupo no encontrado"
            })
        }

        await grupo.destroy()
        return res.status(200).json({
            msg: "Grupo eliminado exitosamente"
        })

    } catch (error) {
        console.error("Error al eliminar:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, inténtelo de nuevo más tarde."
        })
    }
}

export {
    inicioGrupo,
    registroGrupo,
    obtenerGrupos,
    obtenerGrupo,
    actualizarGrupo,
    eliminarGrupo
} 