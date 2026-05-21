import express from "express"
import administradorRouter from "./routes/administrador_routes.js"
import router from "./routes/inicio_router.js"
import alumnoRouter from "./routes/alumno_routes.js"
import materiaRouter from "./routes/materia_routes.js"   
import grupoRouter from "./routes/grupo_routes.js"       
import profesorRouter from "./routes/profesor_routes.js" 
import horarioRouter from "./routes/horario_routes.js"   
import historialRouter from "./routes/historial_routes.js"
import grupoMateriaRouter from "./routes/grupo_materia_routes.js"
import inscripcionRouter from "./routes/inscripcion_routes.js" 
import db from "./config/db.js"
import './models/relaciones.js'
import cors from 'cors'

// Crear la aplicación
const app = express()

//Habilitar CORS para la ruta de REACT
app.use(cors({ origin: 'http://localhost:4173'}))

// Accesos a los datos del formulario y JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Conexión a la base de datos
const conectarDB = async () => {
    try {
        await db.authenticate();
        await db.sync() 
        console.log("Conexion exitosa y tablas sincronizadas");
    } catch (error) {
        console.log("Error al conectar o sincronizar:", error);
    }
}

conectarDB();

// Routing
app.use("/", router)
app.use("/administrador",administradorRouter)
app.use("/alumnos", alumnoRouter)
app.use("/materias", materiaRouter)     
app.use("/grupos", grupoRouter)         
app.use("/profesores", profesorRouter)
app.use("/horarios", horarioRouter)     
app.use("/historial-academico", historialRouter)
app.use("/grupo-materia", grupoMateriaRouter)
app.use("/inscripciones", inscripcionRouter) 

// Definiendo el puerto
const port = 3800 
app.listen(port, () => {
    console.log(`Esperando peticiones en el puerto ${port}`)
})