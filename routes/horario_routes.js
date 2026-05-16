import express from "express";
import { inicioHorario, registroHorario } from "../controllers/horarioController.js";
const horarioRouter = express.Router();

// Routing
horarioRouter.get('/inicio', inicioHorario);

// Ruta para registrar un nuevo horario (CREATE)
horarioRouter.post('/', registroHorario);

export default horarioRouter;