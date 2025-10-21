import { Router } from "express";
import { createCategoria, deleteCategoria, deleteLogicoCategoria, getAllCategoriaActivos, getAllCategorias, getCategoriaById, getCategoriasSimple, servidorDeImagenDeCategoria, updateCategoria } from "../controllers/categoriaController.js";
import { uploadStorageCategoriaImg } from "../middleware/multer.middleware.js";

const categoriaRouter = Router();

categoriaRouter.get("/all", getAllCategorias);

categoriaRouter.get("/activos", getAllCategoriaActivos);

categoriaRouter.get('/:id', getCategoriaById)

categoriaRouter.post("/", uploadStorageCategoriaImg.single('imagen'), createCategoria);

categoriaRouter.put('/:id', uploadStorageCategoriaImg.single('imagen'), updateCategoria);

//Eliminación lógica
categoriaRouter.patch("/:id", deleteLogicoCategoria);

//Eliminación física
categoriaRouter.delete('/:id', deleteCategoria);


//http://localhost:3000/api/v1/categorias/imagen/portadas/filename.jpg
categoriaRouter.get('/imagen/portadas/:fileName', servidorDeImagenDeCategoria)
//http://localhost:3000/api/v1/categorias/simple
categoriaRouter.get("/consulta/simple", getCategoriasSimple);

export default categoriaRouter;