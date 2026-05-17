import express from "express";
import { inicioHistorial,registroHistorial, obtenerHistoriales, obtenerHistorial,actualizarHistorial,eliminarHistorial } from "../controllers/historialController.js";

const historialRouter = express.Router();

// Routing de bienvenida
historialRouter.get('/inicio', inicioHistorial);

// Ruta para registrar un nuevo historial (CREATE)
historialRouter.post('/', registroHistorial);

// Ruta para obtener todos los historiales (READ)
historialRouter.get('/', obtenerHistoriales);

// Ruta para obtener un historial por su ID (READ)
historialRouter.get('/:id', obtenerHistorial);

// Ruta para actualizar un historial por su ID (UPDATE)
historialRouter.patch('/:id', actualizarHistorial);

// Ruta para eliminar un historial por su ID (DELETE)
historialRouter.delete('/:id', eliminarHistorial);

export default historialRouter;