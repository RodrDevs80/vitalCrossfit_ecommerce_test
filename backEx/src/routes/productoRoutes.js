import { Router } from "express";
import { createProducto, deleteLogicoProducto, deleteProducto, getAllProductos, getAllProductosActivos, getAllProductosSimple, getProductoById, getProductosOfertasAndDescuentos, servidorDeImagenDePortada, updateProducto } from "../controllers/productoController.js";
import { uploadPortada } from "../middleware/multer.middleware.js";


const productoRoutes = Router();

productoRoutes.get("/all", getAllProductos);

productoRoutes.get("/activos", getAllProductosActivos);

productoRoutes.get("/activos/ofertas", getProductosOfertasAndDescuentos)

productoRoutes.get('/:id', getProductoById);

productoRoutes.post("/", uploadPortada.single('portada'), createProducto);


//http://localhost:3000/api/v1/productos/imagen/portadas/filename.jpg
productoRoutes.get('/imagen/portadas/:fileName', servidorDeImagenDePortada)

productoRoutes.put('/:id', uploadPortada.single('portada'), updateProducto);

//Eliminación física
productoRoutes.delete('/:id', deleteProducto);

// Eliminación lógica
productoRoutes.patch("/:id", deleteLogicoProducto);

//consulta simple:
productoRoutes.get('/consulta/simple', getAllProductosSimple)

export default productoRoutes;



