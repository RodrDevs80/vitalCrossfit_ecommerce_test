import { Router } from "express";
import { getAllOrdenes, getOrdenById, createOrden, updateOrden, deleteOrden } from "../controllers/ordenController.js";


const ordenRouter = Router();

ordenRouter.get("/", getAllOrdenes);

ordenRouter.get('/:id', getOrdenById);

ordenRouter.post("/", createOrden);

ordenRouter.put('/:id', updateOrden);

//Eliminación física
ordenRouter.delete('/:id', deleteOrden);

export default ordenRouter;