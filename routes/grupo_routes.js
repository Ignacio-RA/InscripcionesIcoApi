import express from "express";
import { 
    inicioGrupo, registroGrupo, obtenerGrupos, obtenerGrupo, actualizarGrupo, eliminarGrupo } from "../controllers/grupoController.js";

const grupoRouter = express.Router();

// Routing de bienvenida
grupoRouter.get('/inicio', inicioGrupo);

// Ruta para registrar un nuevo grupo (CREATE)
grupoRouter.post('/', registroGrupo);

// Ruta para obtener todos los grupos (READ)
grupoRouter.get('/', obtenerGrupos);

// Ruta para obtener un grupo por su ID (READ)
grupoRouter.get('/:id', obtenerGrupo);

// Ruta para actualizar un grupo por su ID (UPDATE)
grupoRouter.patch('/:id', actualizarGrupo);

// Ruta para eliminar un grupo por su ID (DELETE)
grupoRouter.delete('/:id', eliminarGrupo);

export default grupoRouter;