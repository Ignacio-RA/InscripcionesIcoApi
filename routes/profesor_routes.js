import express from "express";
import { inicioProfesor, registroProfesor } from "../controllers/profesorController.js";
const profesorRouter = express.Router();

// Routing
profesorRouter.get('/inicio', inicioProfesor);

// Ruta para registrar un nuevo profesor (CREATE)
profesorRouter.post('/', registroProfesor);

export default profesorRouter;