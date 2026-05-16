import express from "express";
import { 
    inicioMateria, 
    registroMateria, 
    obtenerMaterias, 
    obtenerMateria, 
    actualizarMateria, 
    eliminarMateria 
} from "../controllers/materiaController.js";

const materiaRouter = express.Router();

// Routing de bienvenida
materiaRouter.get('/inicio', inicioMateria);

// Ruta para registrar una nueva materia (CREATE)
materiaRouter.post('/', registroMateria);

// Ruta para obtener todas las materias (READ)
materiaRouter.get('/', obtenerMaterias);

// Ruta para obtener una materia por su ID (READ)
materiaRouter.get('/:id', obtenerMateria);

// Ruta para actualizar una materia por su ID (UPDATE)
materiaRouter.patch('/:id', actualizarMateria);

// Ruta para eliminar una materia por su ID (DELETE)
materiaRouter.delete('/:id', eliminarMateria);

export default materiaRouter;