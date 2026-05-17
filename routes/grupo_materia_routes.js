import express from "express";
import {inicioGrupoMateria,registroGrupoMateria,obtenerGruposMaterias,obtenerGrupoMateria,actualizarGrupoMateria,eliminarGrupoMateria} from "../controllers/grupoMateriaController.js";

const grupoMateriaRouter = express.Router();

// Routing de bienvenida
grupoMateriaRouter.get('/inicio', inicioGrupoMateria);

// Ruta para registrar una nueva asignación (CREATE)
grupoMateriaRouter.post('/', registroGrupoMateria);

// Ruta para obtener todas las asignaciones (READ)
grupoMateriaRouter.get('/', obtenerGruposMaterias);

// Ruta para obtener una asignación por su ID (READ)
grupoMateriaRouter.get('/:id', obtenerGrupoMateria);

// Ruta para actualizar una asignación por su ID (UPDATE)
grupoMateriaRouter.patch('/:id', actualizarGrupoMateria);

// Ruta para eliminar una asignación por su ID (DELETE)
grupoMateriaRouter.delete('/:id', eliminarGrupoMateria);

export default grupoMateriaRouter;