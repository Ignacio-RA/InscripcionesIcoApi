import express from "express";
import { 
    inicioProfesor, 
    registroProfesor, 
    obtenerProfesores, 
    obtenerProfesor, 
    actualizarProfesor, 
    eliminarProfesor 
} from "../controllers/profesorController.js";

const profesorRouter = express.Router();

// Routing de bienvenida
profesorRouter.get('/inicio', inicioProfesor);

// Ruta para registrar un nuevo profesor (CREATE)
profesorRouter.post('/', registroProfesor);

// Ruta para obtener todos los profesores (READ)
profesorRouter.get('/', obtenerProfesores);

// Ruta para obtener un profesor por su ID (READ)
profesorRouter.get('/:id', obtenerProfesor);

// Ruta para actualizar un profesor por su ID (UPDATE)
profesorRouter.patch('/:id', actualizarProfesor);

// Ruta para eliminar un profesor por su ID (DELETE)
profesorRouter.delete('/:id', eliminarProfesor);

export default profesorRouter;