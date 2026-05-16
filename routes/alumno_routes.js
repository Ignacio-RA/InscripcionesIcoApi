import express, { Router } from "express";
import { inicio, registroAlumno} from "../controllers/alumnoController.js";
const alumnoRouter = express.Router();

//Routing
alumnoRouter.get('/inicio',inicio)

//Ruta para regustrar un nuevo alumno (CREATE)
alumnoRouter.post('/', registroAlumno)

export default alumnoRouter;
