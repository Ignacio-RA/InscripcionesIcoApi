import "../models/relaciones.js";
import Materia from "../models/materia.js";

// Función para el inicio del módulo de materias
const inicioMateria = (req, res) => {
    res.json({
        msg: "Bienvenidos al módulo de Materias de la API de Inscripciones de ICO",
        descripcion: "CRUD de materias en la API de Inscripciones de ICO"
    })
}

// Función para crear una nueva materia (Create)
const registroMateria = async (req, res) => {
    try {
        const { cve_materia, nombre, semestre, creditos, tipo, laboratorio } = req.body

        //  Validacion de cve_materia (Debe ser un número entero positivo)
        if (!cve_materia || isNaN(cve_materia) || parseInt(cve_materia) <= 0) {
            return res.status(400).json({
                msg: "La clave de la materia es obligatoria y debe ser un número entero positivo."
            });
        }

        //  Validación de semestre (Basado en el ENUM del modelo '1' al '10')
        const semestresValidos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        if (!semestre || !semestresValidos.includes(semestre.toString())) {
            return res.status(400).json({
                msg: "El semestre no es válido. Debe ser un valor entre el 1 y el 10."
            });
        }

        //  Validación de tipo (Basado en el ENUM 'Obligatoria' o 'Optativa')
        // Transformamos la primera letra a mayúscula para que coincida exactamente con el ENUM
        const tipoFormateado = tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase() : null;
        const tiposValidos = ['Obligatoria', 'Optativa'];
        
        if (!tipoFormateado || !tiposValidos.includes(tipoFormateado)) {
            return res.status(400).json({
                msg: "El tipo de materia no es válido. Debe ser 'Obligatoria' o 'Optativa'."
            });
        }

        //  Conversión del nombre de la materia a MAYÚSCULAS
        const nombreMayus = nombre?.toUpperCase();

        //  Creación del registro en la base de datos
        const nuevaMateria = await Materia.create({
            cve_materia: parseInt(cve_materia),
            nombre: nombreMayus,
            semestre: semestre.toString(),
            creditos: parseInt(creditos),
            tipo: tipoFormateado,
            laboratorio: laboratorio !== undefined ? laboratorio : false // Si no se envía, usa el default false
        })

        // Se responde con un mensaje de éxito y estatus 201 (CREATED)
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

        // para evitar duplicacion de materia
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

export {
    inicioMateria,
    registroMateria
}