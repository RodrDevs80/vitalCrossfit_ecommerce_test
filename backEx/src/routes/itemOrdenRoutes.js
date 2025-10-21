import { Router } from "express";
import { getAllItemsOrden, getItemOrdenById, createItemOrden, updateItemOrden, deleteItemOrden, getItemsOrdenByIdPedido } from "../controllers/itemOrdenController.js";


const itemOrdenRouter = Router();

itemOrdenRouter.get("/", getAllItemsOrden);

itemOrdenRouter.get('/:id', getItemOrdenById);

itemOrdenRouter.post("/", createItemOrden);

itemOrdenRouter.put('/:id', updateItemOrden);

//Eliminación física
itemOrdenRouter.delete('/:id', deleteItemOrden);

//buscar todos lo item de una orden por id
itemOrdenRouter.get('/detalles/:id', getItemsOrdenByIdPedido);


export default itemOrdenRouter;