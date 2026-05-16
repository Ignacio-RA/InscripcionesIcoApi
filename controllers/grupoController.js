import "../models/relaciones.js";
import Grupo from "../models/grupo.js";

// Función para el inicio del módulo de grupos
const inicioGrupo = (req, res) => {
    res.json({
        msg: "Bienvenidos al módulo de Grupos de la API de Inscripciones de ICO",
        descripcion: "CRUD de grupos en la API de Inscripciones de ICO"
    })
}

// Función para crear un nuevo grupo (Create)
const registroGrupo = async (req, res) => {
    try {
        const { nombre_grupo, turno, semestre } = req.body

        // Validación de nombre_grupo
        if (!nombre_grupo || nombre_grupo.trim() === "") {
            return res.status(400).json({
                msg: "El nombre del grupo es obligatorio."
            });
        }

        // Validación de turno (Convertimos a MAYÚSCULAS para aceptar 'm' o 'v')
        const turnoMayus = turno?.toUpperCase();
        const turnosValidos = ['M', 'V'];
        if (!turnoMayus || !turnosValidos.includes(turnoMayus)) {
            return res.status(400).json({
                msg: "El turno no es válido. Debe ser 'M' (Matutino) o 'V' (Vespertino)."
            });
        }

        // Validación de semestre (Basado en tu ENUM del '1' al '10')
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

        // Para evitar duplicacion de grupo
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

export {
    inicioGrupo,
    registroGrupo
}