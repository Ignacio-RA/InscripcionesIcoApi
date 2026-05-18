import { Router } from "express";
import { registroAdministrador, obtenerAdministradores } from "../controllers/administradorController.js";

const administradorRouter = Router();

// Ruta para registrar un nuevo administrador (CREATE)
administradorRouter.post('/', registroAdministrador);

// Ruta para obtener la lista general de administradores (READ)
administradorRouter.get('/', obtenerAdministradores);

export default administradorRouter;