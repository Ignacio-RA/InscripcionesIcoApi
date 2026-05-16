import "../models/relaciones.js";
import Alumno from "../models/alumno.js";

const inicio = (req, res) => {
    res.json({
        msg: "Bienvenidos a la API de Inscripciones de ICO",
        descripcion: "CRUD de usuarios en la API de Inscripciones de ICO"
    })
}

// Funcion para crear un nuevo alumno (Create)
const registroAlumno = async (req, res) => {
    try {
        const { nombre, ap_paterno, ap_materno, nmo_cuenta, correo, generacion, semestre, f_nacimiento, estado, edo_pago, turno } = req.body

        // 1. Validacion de nmo_cuenta a 9 digitos
        const cuentaRegex = /^\d{9}$/;
        if (!nmo_cuenta || !cuentaRegex.test(nmo_cuenta)) {
            return res.status(400).json({
                msg: "El número de cuenta es obligatorio y debe tener exactamente 9 dígitos numéricos."
            });
        }

        // 2. Validacion de correo
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correo || !correoRegex.test(correo)) {
            return res.status(400).json({
                msg: "El correo electrónico proporcionado no tiene un formato válido."
            });
        }

        // 3. Conversión de campos de texto a MAYÚSCULAS
        // El operador ?. (optional chaining) evita errores si el campo llega vacío
        const nombreMayus = nombre?.toUpperCase();
        const apPaternoMayus = ap_paterno?.toUpperCase();
        const apMaternoMayus = ap_materno?.toUpperCase();
        const turnoMayus = turno?.toUpperCase();

        const nuevoAlumno = await Alumno.create({
            nmo_cuenta,
            nombre: nombreMayus,
            ap_paterno: apPaternoMayus,
            ap_materno: apMaternoMayus,
            correo,
            generacion,
            semestre,
            turno: turnoMayus,
            f_nacimiento,
            estado,
            edo_pago,
        })

        // Se responde con un mensaje de exito y estatus 201 (CREATED)
        return res.status(201).json({
            msg: "Alumno registrado exitosamente",
            alumno: {
                id: nuevoAlumno.id_alumno,
                nombre: nuevoAlumno.nombre
            }
        })

    } catch (error) {
        console.error("error al registrar alumno", error)

        // Si el error es por duplicado (nmo_cuenta o correo ya existe)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "el nmo_cuenta o correo ya se encuentra registrado"
            })
        }

        return res.status(500).json({
            msg: "hubo un error en el servidor, intente mas tarde"
        })
    }
}

export {
    inicio,
    registroAlumno
}