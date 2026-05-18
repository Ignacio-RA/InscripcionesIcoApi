import Alumno from "../models/alumno.js";
import Administrador from "../models/administrador.js";

// Funcion para verificar numero de cuenta y fecha de nacimiento
const login = async (req, res) => {
    try {
        // Extraemos los posibles campos que pueden venir del Front-end/Postman
        const { nmo_cuenta, f_nacimiento, correo, password } = req.body;

        // 1. Normalizar las entradas: identificar qué credenciales se enviaron
        const identificador = (nmo_cuenta || correo)?.toString().trim();
        const credencialSecreta = (f_nacimiento || password)?.toString().trim();

        // 2. Validar estrictamente que no vengan celdas vacías
        if (!identificador) {
            return res.status(400).json({
                msg: "El identificador (Número de cuenta o Correo) es obligatorio y no debe quedar vacío."
            });
        }
        if (!credencialSecreta) {
            return res.status(400).json({
                msg: "La credencial de acceso (Fecha de nacimiento o Contraseña) es obligatoria y no debe quedar vacía."
            });
        }

        // --- INTENTO 1: BUSCAR EN LA TABLA DE ALUMNOS ---
        // El número de cuenta de un alumno siempre tiene 9 dígitos numéricos
        const cuentaRegex = /^\d{9}$/;
        
        if (cuentaRegex.test(identificador)) {
            const alumno = await Alumno.findOne({ where: { nmo_cuenta: identificador } });

            if (alumno) {
                // Verificar si la fecha de nacimiento coincide exactamente
                if (credencialSecreta !== alumno.f_nacimiento) {
                    return res.status(401).json({
                        msg: "El número de cuenta o la fecha de nacimiento son incorrectos."
                    });
                }

                // Login exitoso como Alumno
                return res.status(200).json({
                    msg: "Acceso concedido como Alumno.",
                    rol: "ALUMNO",
                    usuario: {
                        id: alumno.id_alumno,
                        nombre: alumno.nombre,
                        semestre: alumno.semestre
                    }
                });
            }
        }

        // --- INTENTO 2: BUSCAR EN LA TABLA DE ADMINISTRADORES ---
        // Si no se encontró un alumno, pasamos a buscar por correo en Administrador
        const administrador = await Administrador.findOne({ where: { correo: identificador.toLowerCase() } });

        if (administrador) {
            // Verificar la contraseña usando el método personalizado (prototype) definido en tu modelo Administrador
            const passwordValido = administrador.verificarPassword(credencialSecreta);
            
            if (!passwordValido) {
                return res.status(401).json({
                    msg: "El correo electrónico o la contraseña son incorrectos."
                });
            }

            // Login exitoso como Administrador
            return res.status(200).json({
                msg: "Acceso concedido como Administrador.",
                rol: "ADMINISTRADOR",
                usuario: {
                    id: administrador.id_admin,
                    nombre: administrador.nombre,
                    correo: administrador.correo
                }
            });
        }

        // Si no se encontró ni como alumno ni como administrador
        return res.status(404).json({
            msg: "Las credenciales proporcionadas no corresponden a ningún usuario registrado."
        });

    } catch (error) {
        console.error("Error en el proceso de login unificado:", error);
        return res.status(500).json({
            msg: "Hubo un error en el servidor, inténtelo de nuevo más tarde."
        });
    }
};

export {
    login
}