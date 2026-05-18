import express, { Router } from "express";
import { inicio, registroAlumno, obtenerAlumnos, obtenerAlumno, actualizarAlumno,eliminarAlumno} from "../controllers/alumnoController.js";
import { login } from "../controllers/loginController.js";


const alumnoRouter = express.Router();

//Routing
alumnoRouter.get('/inicio',inicio)

//Ruta para registrar un nuevo alumno (CREATE)
alumnoRouter.post('/', registroAlumno)

//Ruta para obtener todos los alumnos (READ)
alumnoRouter.get('/',obtenerAlumnos)
//Ruta para obtner un alumno por su ID (READ)
alumnoRouter.get('/:id', obtenerAlumno)

//Ruta para actualizar un alumno por su ID (UPDATE)
alumnoRouter.patch('/:id',actualizarAlumno)

//Ruta para eliminar un alumno por su ID (DELETE)
alumnoRouter.delete('/:id',eliminarAlumno)

//Ruta para iniciar sesion (LOGIN)
alumnoRouter.post('/login',login)

export default alumnoRouter;
