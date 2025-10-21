import { Router } from "express";
import CuponDescuento from "../models/CuponDescuento.js";
import { createCupon, deleteFisicoCupon, deleteLogicoCupon, getAllCupones, getAllCuponesActivos, getCuponById, updateCupon, validarCupon } from "../controllers/cuponesDesController.js";

const cuponDescuentoRouter = Router();

cuponDescuentoRouter.get("/", getAllCupones);
//Traer todos los cupones activos
cuponDescuentoRouter.get("/activos", getAllCuponesActivos);

cuponDescuentoRouter.get('/:id', getCuponById);

cuponDescuentoRouter.post("/", createCupon);

cuponDescuentoRouter.put('/:id', updateCupon);

//Eliminación física
cuponDescuentoRouter.delete('/:id', deleteFisicoCupon);

//Eliminación Lógica
cuponDescuentoRouter.patch("/:id", deleteLogicoCupon)

//Validar cupón por código
cuponDescuentoRouter.get("/validar/:codigoCupon", validarCupon);


export default cuponDescuentoRouter;