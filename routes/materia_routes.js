import express from "express";
import { inicioMateria, registroMateria } from "../controllers/materiaController.js";
const materiaRouter = express.Router();

// Routing
materiaRouter.get('/inicio', inicioMateria);

// Ruta para registrar una nueva materia (CREATE)
materiaRouter.post('/', registroMateria);

export default materiaRouter;