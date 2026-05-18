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
        const { 
            nombre, ap_paterno, ap_materno, nmo_cuenta, correo, 
            generacion, semestre, f_nacimiento, estado, edo_pago, turno 
        } = req.body

        // 1. Validaciones para que ninguna celda quede vacía (evita undefined, null y strings vacíos)
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ msg: "El nombre es obligatorio y no debe quedar vacío." });
        }
        if (!ap_paterno || ap_paterno.trim() === "") {
            return res.status(400).json({ msg: "El apellido paterno es obligatorio y no debe quedar vacío." });
        }
        if (!ap_materno || ap_materno.trim() === "") {
            return res.status(400).json({ msg: "El apellido materno es obligatorio y no debe quedar vacío." });
        }
        if (nmo_cuenta === undefined || nmo_cuenta === null || nmo_cuenta.toString().trim() === "") {
            return res.status(400).json({ msg: "El número de cuenta es obligatorio y no debe quedar vacío." });
        }
        if (!correo || correo.trim() === "") {
            return res.status(400).json({ msg: "El correo electrónico es obligatorio y no debe quedar vacío." });
        }
        if (generacion === undefined || generacion === null || generacion.toString().trim() === "") {
            return res.status(400).json({ msg: "La generación es obligatoria y no debe quedar vacía." });
        }
        if (semestre === undefined || semestre === null || semestre.toString().trim() === "") {
            return res.status(400).json({ msg: "El semestre es obligatorio y no debe quedar vacío." });
        }
        if (!f_nacimiento || f_nacimiento.trim() === "") {
            return res.status(400).json({ msg: "La fecha de nacimiento es obligatoria y no debe quedar vacía." });
        }
        if (estado === undefined || estado === null || estado.toString().trim() === "") {
            return res.status(400).json({ msg: "El estado del alumno es obligatorio y no debe quedar vacío." });
        }
        if (edo_pago === undefined || edo_pago === null || edo_pago.toString().trim() === "") {
            return res.status(400).json({ msg: "El estado de pago es obligatorio y no debe quedar vacío." });
        }
        if (!turno || turno.trim() === "") {
            return res.status(400).json({ msg: "El turno es obligatorio y no debe quedar vacío." });
        }

        // 2. Validación de formato de nmo_cuenta (exactamente 9 dígitos numéricos)
        const cuentaRegex = /^\d{9}$/;
        if (!cuentaRegex.test(nmo_cuenta.toString().trim())) {
            return res.status(400).json({
                msg: "El número de cuenta debe tener exactamente 9 dígitos numéricos."
            });
        }

        // 3. Validación de formato de correo
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correoRegex.test(correo.trim())) {
            return res.status(400).json({
                msg: "El correo electrónico proporcionado no tiene un formato válido."
            });
        }

        // 4. Validación de tipos numéricos para semestre y generación
        if (isNaN(semestre) || parseInt(semestre) <= 0 || parseInt(semestre) > 12) {
            return res.status(400).json({ msg: "El semestre debe ser un número entero válido (ej. entre 1 y 12)." });
        }
        if (isNaN(generacion) || parseInt(generacion) <= 0) {
            return res.status(400).json({ msg: "La generación debe ser un año numérico válido." });
        }

        // 5. Conversión limpia de campos de texto a MAYÚSCULAS y remoción de espacios extra
        const nombreMayus = nombre.trim().toUpperCase();
        const apPaternoMayus = ap_paterno.trim().toUpperCase();
        const apMaternoMayus = ap_materno.trim().toUpperCase();
        const turnoMayus = turno.trim().toUpperCase();

        // Creación del registro en la base de datos
        const nuevoAlumno = await Alumno.create({
            nmo_cuenta: nmo_cuenta.toString().trim(),
            nombre: nombreMayus,
            ap_paterno: apPaternoMayus,
            ap_materno: apMaternoMayus,
            correo: correo.trim().toLowerCase(), // Convencionalmente los correos van en minúsculas
            generacion: parseInt(generacion),
            semestre: parseInt(semestre),
            turno: turnoMayus,
            f_nacimiento: f_nacimiento.trim(),
            estado: typeof estado === 'boolean' ? estado : estado.toString().trim() === 'true',
            edo_pago: typeof edo_pago === 'boolean' ? edo_pago : edo_pago.toString().trim() === 'true'
        })

        // Se responde con un mensaje de éxito y estatus 201 (CREATED)
        return res.status(201).json({
            msg: "Alumno registrado exitosamente",
            alumno: {
                id: nuevoAlumno.id_alumno,
                nombre: nuevoAlumno.nombre,
                nmo_cuenta: nuevoAlumno.nmo_cuenta
            }
        })

    } catch (error) {
        console.error("error al registrar alumno", error)

        // Si el error es por duplicado (nmo_cuenta o correo ya existe)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "El número de cuenta o el correo electrónico ya se encuentra registrado."
            })
        }

        return res.status(500).json({
            msg: "Hubo un error en el servidor, intente más tarde."
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

// Funcion para actualizar un alumno por su ID (UPDATE)
const actualizarAlumno = async (req, res) => {
    const { id } = req.params

    try {
        const alumno = await Alumno.findByPk(id)  
        if (!alumno){
            return res.status(404).json({
                msg: "Alumno no encontrado"
            })
        }

        // Creamos un objeto limpio donde construiremos las actualizaciones validadas
        const datosActualizados = {};

        // 1. Validación condicional de Nombre
        if (req.body.nombre !== undefined) {
            if (req.body.nombre === null || req.body.nombre.trim() === "") {
                return res.status(400).json({ msg: "El nombre no puede quedar vacío." });
            }
            datosActualizados.nombre = req.body.nombre.trim().toUpperCase();
        }

        // 2. Validación condicional de Apellido Paterno
        if (req.body.ap_paterno !== undefined) {
            if (req.body.ap_paterno === null || req.body.ap_paterno.trim() === "") {
                return res.status(400).json({ msg: "El apellido paterno no puede quedar vacío." });
            }
            datosActualizados.ap_paterno = req.body.ap_paterno.trim().toUpperCase();
        }

        // 3. Validación condicional de Apellido Materno
        if (req.body.ap_materno !== undefined) {
            if (req.body.ap_materno === null || req.body.ap_materno.trim() === "") {
                return res.status(400).json({ msg: "El apellido materno no puede quedar vacío." });
            }
            datosActualizados.ap_materno = req.body.ap_materno.trim().toUpperCase();
        }

        // 4. Validación condicional de nmo_cuenta
        if (req.body.nmo_cuenta !== undefined) {
            if (req.body.nmo_cuenta === null || req.body.nmo_cuenta.toString().trim() === "") {
                return res.status(400).json({ msg: "El número de cuenta no puede quedar vacío." });
            }
            const cuentaRegex = /^\d{9}$/;
            if (!cuentaRegex.test(req.body.nmo_cuenta.toString().trim())) {
                return res.status(400).json({
                    msg: "El número de cuenta debe tener exactamente 9 dígitos numéricos."
                });
            }
            datosActualizados.nmo_cuenta = req.body.nmo_cuenta.toString().trim();
        }

        // 5. Validación condicional de correo
        if (req.body.correo !== undefined) {
            if (req.body.correo === null || req.body.correo.trim() === "") {
                return res.status(400).json({ msg: "El correo electrónico no puede quedar vacío." });
            }
            const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!correoRegex.test(req.body.correo.trim())) {
                return res.status(400).json({
                    msg: "El correo electrónico proporcionado no tiene un formato válido."
                });
            }
            datosActualizados.correo = req.body.correo.trim().toLowerCase();
        }

        // 6. Validación condicional de Turno
        if (req.body.turno !== undefined) {
            if (req.body.turno === null || req.body.turno.trim() === "") {
                return res.status(400).json({ msg: "El turno no puede quedar vacío." });
            }
            datosActualizados.turno = req.body.turno.trim().toUpperCase();
        }

        // 7. Validación condicional de Semestre
        if (req.body.semestre !== undefined) {
            if (req.body.semestre === null || req.body.semestre.toString().trim() === "") {
                return res.status(400).json({ msg: "El semestre no puede quedar vacío." });
            }
            if (isNaN(req.body.semestre) || parseInt(req.body.semestre) <= 0 || parseInt(req.body.semestre) > 12) {
                return res.status(400).json({ msg: "El semestre debe ser un número entero válido entre 1 y 12." });
            }
            datosActualizados.semestre = parseInt(req.body.semestre);
        }

        // 8. Validación condicional de Generación
        if (req.body.generacion !== undefined) {
            if (req.body.generacion === null || req.body.generacion.toString().trim() === "") {
                return res.status(400).json({ msg: "La generación no puede quedar vacía." });
            }
            if (isNaN(req.body.generacion) || parseInt(req.body.generacion) <= 0) {
                return res.status(400).json({ msg: "La generación debe ser un año numérico válido." });
            }
            datosActualizados.generacion = parseInt(req.body.generacion);
        }

        // 9. Validación condicional de Fecha de Nacimiento
        if (req.body.f_nacimiento !== undefined) {
            if (req.body.f_nacimiento === null || req.body.f_nacimiento.trim() === "") {
                return res.status(400).json({ msg: "La fecha de nacimiento no puede quedar vacía." });
            }
            datosActualizados.f_nacimiento = req.body.f_nacimiento.trim();
        }

        // 10. Validación condicional de Banderas / Booleans (estado y edo_pago)
        if (req.body.estado !== undefined) {
            if (req.body.estado === null || req.body.estado.toString().trim() === "") {
                return res.status(400).json({ msg: "El estado del alumno no puede quedar vacío." });
            }
            datosActualizados.estado = typeof req.body.estado === 'boolean' ? req.body.estado : req.body.estado.toString().trim() === 'true';
        }

        if (req.body.edo_pago !== undefined) {
            if (req.body.edo_pago === null || req.body.edo_pago.toString().trim() === "") {
                return res.status(400).json({ msg: "El estado de pago no puede quedar vacío." });
            }
            datosActualizados.edo_pago = typeof req.body.edo_pago === 'boolean' ? req.body.edo_pago : req.body.edo_pago.toString().trim() === 'true';
        }

        // Actualizamos el alumno utilizando únicamente las propiedades controladas y limpias
        await alumno.update(datosActualizados)

        // Se responde con mensaje de éxito, el alumno actualizado y estatus 200 (OK)
        return res.status(200).json({
            msg: "Alumno actualizado exitosamente",
            alumno
        })

    } catch (error) {
        console.error("Error al actualizar:", error)
        
        // Si el error es por duplicado (ej. el correo o nmo_cuenta ya existe)
        if (error.name === 'SequelizeUniqueConstraintError'){
            return res.status(400).json({
                msg: "El correo o número de cuenta ya se encuentra registrado por otro alumno."
            })
        }
        return res.status(500).json({
            msg: "Hubo un error en el servidor, inténtelo de nuevo más tarde."
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