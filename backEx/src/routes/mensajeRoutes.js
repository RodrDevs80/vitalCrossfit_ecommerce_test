import { Router } from "express";
import { getAllMensajesByProductoId, createMensaje } from "../controllers/mensajeController.js"


const mensajeRouter = Router();

mensajeRouter.get("/:idProducto", getAllMensajesByProductoId);

mensajeRouter.post("/", createMensaje);

export default mensajeRouter;

