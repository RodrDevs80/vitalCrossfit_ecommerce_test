import { Router } from "express";
import { getAllCarritos, getCarritoById, deleteCarrito, createCarrito, updateCarrito, getAllCarritoByIdUser } from "../controllers/carritoController.js";
import { getAllRecordsService } from "../servicios/pruebaGenerica.js";

import Carrito from "../models/Carrito.js";
//para prueba
const getAllCarritosSer = getAllRecordsService(Carrito, "Carritos");

const carritoRouter = Router();

carritoRouter.get("/", getAllCarritosSer);

carritoRouter.get("/byUsuario/:id", getAllCarritoByIdUser)

carritoRouter.get('/:id', getCarritoById);

carritoRouter.post("/", createCarrito);

carritoRouter.put('/:id', updateCarrito);

//Eliminación física
carritoRouter.delete('/:id', deleteCarrito);

export default carritoRouter;