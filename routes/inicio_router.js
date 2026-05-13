import express from "express";
import {inicio} from "../controllers/inicioController.js"

const router=express.Router();

//Routing
router.get('/inicio',inicio)

export default router