import Alumno from "../models/alumno.js";

// Funcion para verificar numero de cuenta y fecha de nacimiento
const login = async (req, res) => {
    try {
        const { nmo_cuenta, f_nacimiento } = req.body;

        // 1. Validación estricta para que ninguna celda quede vacía
        if (nmo_cuenta === undefined || nmo_cuenta === null || nmo_cuenta.toString().trim() === "") {
            return res.status(400).json({
                msg: "El número de cuenta es obligatorio y no debe quedar vacío."
            });
        }

        if (f_nacimiento === undefined || f_nacimiento === null || f_nacimiento.toString().trim() === "") {
            return res.status(400).json({
                msg: "La fecha de nacimiento es obligatoria y no debe quedar vacía."
            });
        }

        // 2. Validación de formato rápido para el número de cuenta antes de consultar la BD
        const cuentaRegex = /^\d{9}$/;
        if (!cuentaRegex.test(nmo_cuenta.toString().trim())) {
            return res.status(400).json({
                msg: "El número de cuenta debe tener exactamente 9 dígitos numéricos."
            });
        }

        // Buscar si el alumno existe en la base de datos
        const alumno = await Alumno.findOne({ 
            where: { nmo_cuenta: nmo_cuenta.toString().trim() } 
        });

        // Si el alumno no existe
        if (!alumno) {
            return res.status(404).json({
                msg: "El número de cuenta o la fecha de nacimiento son incorrectos."
            });
        }

        // Verificar si la fecha de nacimiento NO coincide
        if (f_nacimiento.toString().trim() !== alumno.f_nacimiento) {
            return res.status(404).json({
                msg: "El número de cuenta o la fecha de nacimiento son incorrectos."
            });
        }  

        // Si todo está bien se responde con un mensaje de éxito y estatus 200 (OK)
        return res.status(200).json({
            msg: "Acceso concedido. El número de cuenta y la fecha de nacimiento son correctas.",
            alumno: {
                id: alumno.id_alumno,
                nombre: alumno.nombre,
                semestre: alumno.semestre
            }
        });

    } catch (error) { 
        console.error("Error en el proceso de login:", error);
        return res.status(500).json({
            msg: "Hubo un error en el servidor, inténtelo de nuevo más tarde."
        });
    }
}

export {
    login
}