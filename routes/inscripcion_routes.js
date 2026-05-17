import express from "express";
import {inicioInscripcion,registroInscripcion,obtenerInscripciones,obtenerInscripcion,actualizarInscripcion,eliminarInscripcion} from "../controllers/inscripcionController.js";

const inscripcionRouter = express.Router();

// Routing de bienvenida
inscripcionRouter.get('/inicio', inicioInscripcion);

// Ruta para registrar una nueva inscripción (CREATE)
inscripcionRouter.post('/', registroInscripcion);

// Ruta para obtener todas las inscripciones (READ)
inscripcionRouter.get('/', obtenerInscripciones);

// Ruta para obtener una inscripción por su ID (READ)
inscripcionRouter.get('/:id', obtenerInscripcion);

// Ruta para actualizar una inscripción por su ID (UPDATE)
inscripcionRouter.patch('/:id', actualizarInscripcion);

// Ruta para eliminar una inscripción por su ID (DELETE)
inscripcionRouter.delete('/:id', eliminarInscripcion);

export default inscripcionRouter;