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

// Funcion para obtner todos los alumnos (READ)
const obtenerAlumnos = async (req,res)=>{
    try{
        const alumnos = await Alumno.findAll({
            atributes:['nmo_cuenta','ap_paterno','ap_materno','correo','generacion','semestre','turno','f_nacimiento','estado','edo_pago']
        })
        // se responde con un mensaje de texto de exito, la lista de usuarios y estatus 200 (OK)
        return res.status(200).json({
            msg: "Alumnos obtenidos exitosamente",
            alumnos
        })
    }catch (error){
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente mas tarde."

        })
    }
}

// Funcion para obtner un alumno por su ID (READ)
const obtenerAlumno = async (req,res)=>{
    try{
        const {id} = req.params
        const alumno = await Alumno.findByPk( id, {
            atributes:['nmo_cuenta','ap_paterno','ap_materno','correo','generacion','semestre','turno','f_nacimiento','estado','edo_pago']
        })
        // se responde con un mensaje de texto de exito, la lista de usuarios y estatus 200 (OK)
        return res.status(200).json({
            msg: "Alumno obtenidos exitosamente",
            alumno
        })
    }catch (error){
        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente mas tarde."

        })
    }
}

// Funcion para actualizar un allumno por su ID (UPDATE)
const actualizarAlumno = async (req,res)=>{
    const {id} = req.params

    try {
        
        const alumno = await Alumno.findByPk(id)  
        if (!alumno){
            return res.status(404).json({
                msg: "Alumno no encontrado"
            })
        }

    await alumno.update(req.body)
    //Se responde con mensaje de exito, el alumno y estatus 200 (OK)
    return res.status(200).json({
        msg: "Alumno actualizado exitosamente",
        alumno
    })

    } catch (error) {
        console.error("Error all actualizar:", error)
        //Si el error es por duplicado (ej. el correo o nmo_cuenta ya existe)
        if (error.name ==='SequelizeUniqueConstraintError'){
            return res.status(400).json({
                msg: "El correo o nmo_cuenta ya se encuentra registrado."
            })
        }
        return res.status(500).json({
                msg: "Hubo un error en el servidor, intentelo de nuevo más tarde."
            })
    }
}

// Funcion para eliminar un alumno por su ID (DELETE)
const eliminarAlumno = async (req,res)=>{
    const {id} = req.params

    try {
        
        const alumno = await Alumno.findByPk(id)  
        if (!alumno){
            return res.status(404).json({
                msg: "Alumno no encontrado"
            })
        }

    await alumno.destroy()
    //Se responde con mensaje de exito y estatus(OK)
    return res.status(200).json({
        msg: "Alumno eliminado exitosamente"  
    })

    } catch (error) {
        console.error("Error al eliminar:", error)
        return res.status(500).json({
                msg: "Hubo un error en el servidor, intentelo de nuevo más tarde."
            })
    }
}

export {
    inicio,
    registroAlumno,
    obtenerAlumnos,
    obtenerAlumno,
    actualizarAlumno,
    eliminarAlumno
}