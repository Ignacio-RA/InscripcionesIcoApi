import "../models/relaciones.js";
import Materia from "../models/materia.js";

// Función para el inicio del módulo de materias
const inicioMateria = (req, res) => {
    res.json({
        msg: "Bienvenidos al módulo de Materias de la API de Inscripciones de ICO",
        descripcion: "CRUD de materias en la API de Inscripciones de ICO"
    })
}

// Función para crear una nueva materia (CREATE)
const registroMateria = async (req, res) => {
    try {
        const { cve_materia, nombre, semestre, creditos, tipo, laboratorio } = req.body

        // Validación de cve_materia (Debe ser un número entero positivo)
        if (!cve_materia || isNaN(cve_materia) || parseInt(cve_materia) <= 0) {
            return res.status(400).json({
                msg: "La clave de la materia es obligatoria y debe ser un número entero positivo."
            });
        }

        // Validación de semestre (Basado en el ENUM del modelo '1' al '10')
        const semestresValidos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        if (!semestre || !semestresValidos.includes(semestre.toString())) {
            return res.status(400).json({
                msg: "El semestre no es válido. Debe ser un valor entre el 1 y el 10."
            });
        }

        // Validación de tipo (Basado en el ENUM 'Obligatoria' o 'Optativa')
        const tipoFormateado = tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase() : null;
        const tiposValidos = ['Obligatoria', 'Optativa'];
        
        if (!tipoFormateado || !tiposValidos.includes(tipoFormateado)) {
            return res.status(400).json({
                msg: "El tipo de materia no es válido. Debe ser 'Obligatoria' o 'Optativa'."
            });
        }

        // Conversión del nombre de la materia a MAYÚSCULAS
        const nombreMayus = nombre?.toUpperCase();

        // Creación del registro en la base de datos
        const nuevaMateria = await Materia.create({
            cve_materia: parseInt(cve_materia),
            nombre: nombreMayus,
            semestre: semestre.toString(),
            creditos: parseInt(creditos),
            tipo: tipoFormateado,
            laboratorio: laboratorio !== undefined ? laboratorio : false
        })

        return res.status(201).json({
            msg: "Materia registrada exitosamente",
            materia: {
                id: nuevaMateria.id_materia,
                clave: nuevaMateria.cve_materia,
                nombre: nuevaMateria.nombre
            }
        })

    } catch (error) {
        console.error("error al registrar materia", error)

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "La clave de la materia (cve_materia) ya se encuentra registrada."
            })
        }

        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para obtener todas las materias (READ)
const obtenerMaterias = async (req, res) => {
    try {
        const materias = await Materia.findAll({
            attributes: ['id_materia', 'cve_materia', 'nombre', 'semestre', 'creditos', 'tipo', 'laboratorio']
        })
        return res.status(200).json({
            msg: "Materias obtenidas exitosamente",
            materias
        })
    } catch (error) {
        console.error("Error al obtener materias:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para obtener una materia por su ID (READ)
const obtenerMateria = async (req, res) => {
    try {
        const { id } = req.params
        const materia = await Materia.findByPk(id, {
            attributes: ['id_materia', 'cve_materia', 'nombre', 'semestre', 'creditos', 'tipo', 'laboratorio']
        })

        if (!materia) {
            return res.status(404).json({
                msg: "Materia no encontrada"
            })
        }

        return res.status(200).json({
            msg: "Materia obtenida exitosamente",
            materia
        })
    } catch (error) {
        console.error("Error al obtener la materia:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
        })
    }
}

// Función para actualizar una materia por su ID (UPDATE)
const actualizarMateria = async (req, res) => {
    const { id } = req.params

    try {
        const materia = await Materia.findByPk(id)
        if (!materia) {
            return res.status(404).json({
                msg: "Materia no encontrada"
            })
        }

        // Si envían cve_materia, validamos que sea número entero positivo
        if (req.body.cve_materia && (isNaN(req.body.cve_materia) || parseInt(req.body.cve_materia) <= 0)) {
            return res.status(400).json({ msg: "La clave de la materia debe ser un número entero positivo." });
        }

        // Si envían nombre, convertimos a MAYÚSCULAS
        if (req.body.nombre) {
            req.body.nombre = req.body.nombre.trim().toUpperCase();
        }

        // Si envían el semestre, validamos contra los permitidos
        if (req.body.semestre) {
            const semestresValidos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
            if (!semestresValidos.includes(req.body.semestre.toString())) {
                return res.status(400).json({ msg: "El semestre no es válido. Debe ser un valor entre el 1 y el 10." });
            }
        }

        // Si envían el tipo, formateamos la capitalización y validamos el ENUM
        if (req.body.tipo) {
            req.body.tipo = req.body.tipo.charAt(0).toUpperCase() + req.body.tipo.slice(1).toLowerCase();
            const tiposValidos = ['Obligatoria', 'Optativa'];
            if (!tiposValidos.includes(req.body.tipo)) {
                return res.status(400).json({ msg: "El tipo de materia debe ser 'Obligatoria' o 'Optativa'." });
            }
        }

        // Procesar booleano de laboratorio si viene explícito
        if (req.body.laboratorio !== undefined) {
            req.body.laboratorio = req.body.laboratorio === true || req.body.laboratorio === 'true';
        }

        await materia.update(req.body)

        return res.status(200).json({
            msg: "Materia actualizada exitosamente",
            materia
        })

    } catch (error) {
        console.error("Error al actualizar:", error)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "La clave de la materia (cve_materia) ya se encuentra registrada en otro registro."
            })
        }
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intentelo de nuevo más tarde."
        })
    }
}

// Función para eliminar una materia por su ID (DELETE)
const eliminarMateria = async (req, res) => {
    const { id } = req.params

    try {
        const materia = await Materia.findByPk(id)
        if (!materia) {
            return res.status(404).json({
                msg: "Materia no encontrada"
            })
        }

        await materia.destroy()
        return res.status(200).json({
            msg: "Materia eliminada exitosamente"
        })

    } catch (error) {
        console.error("Error al eliminar:", error)
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intentelo de nuevo más tarde."
        })
    }
}

export {
    inicioMateria,
    registroMateria,
    obtenerMaterias,
    obtenerMateria,
    actualizarMateria,
    eliminarMateria
}