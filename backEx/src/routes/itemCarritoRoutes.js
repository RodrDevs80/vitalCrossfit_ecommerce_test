import { Router } from "express";
import { createItemCarrito, deleteItemCarrito, getAllItemsCarrito, getItemCarritoById, updateItemCarrito, getAllitemsByIdCarrito } from "../controllers/itemCarritoController.js";


const itemCarritoRouter = Router();

itemCarritoRouter.get("/", getAllItemsCarrito);

itemCarritoRouter.get("/all/itemsByCarrito/:id", getAllitemsByIdCarrito)

itemCarritoRouter.get('/:id', getItemCarritoById);

itemCarritoRouter.post("/", createItemCarrito);

itemCarritoRouter.put('/:id', updateItemCarrito);

//Eliminación física
itemCarritoRouter.delete('/:id', deleteItemCarrito);




export default itemCarritoRouter;