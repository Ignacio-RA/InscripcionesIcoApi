import express from "express";
import { inicioGrupo, registroGrupo } from "../controllers/grupoController.js";
const grupoRouter = express.Router();

// Routing
grupoRouter.get('/inicio', inicioGrupo);

// Ruta para registrar un nuevo grupo (CREATE)
grupoRouter.post('/', registroGrupo);

export default grupoRouter;