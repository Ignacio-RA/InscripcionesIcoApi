import express from "express";
import { 
    inicioHorario, 
    registroHorario, 
    obtenerHorarios, 
    obtenerHorario, 
    actualizarHorario, 
    eliminarHorario 
} from "../controllers/horarioController.js";

const horarioRouter = express.Router();

// Routing de bienvenida
horarioRouter.get('/inicio', inicioHorario);

// Ruta para registrar un nuevo horario (CREATE)
horarioRouter.post('/', registroHorario);

// Ruta para obtener todos los horarios (READ)
horarioRouter.get('/', obtenerHorarios);

// Ruta para obtener un horario por su ID (READ)
horarioRouter.get('/:id', obtenerHorario);

// Ruta para actualizar un horario por su ID (UPDATE)
horarioRouter.patch('/:id', actualizarHorario);

// Ruta para eliminar un horario por su ID (DELETE)
horarioRouter.delete('/:id', eliminarHorario);

export default horarioRouter;