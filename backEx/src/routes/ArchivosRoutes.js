import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import Producto from "../models/Producto.js";
import validateExistencia from "../middleware/validateExistencia.js";
import { deleteArchivo, downloadArchivo, getAllArchivosByIdProducto, getAllImgsURLByIdProductos, getImgById, servidorDeImagenes, uploadArchivo, uploadsArchivos, deleteArchivosDeUnProducto } from "../controllers/archivoController.js";


//: POST /api/v1/files/upload  implementar lógica: (ej: /uploads/productos/{id}).
//multipart/form-data
// Crear un endpoint para obtener la lista de archivos de un producto específico
//(ej: GET /api/v1/files/:idProducto).
//Crear un endpoint para descargar un archivo específico (ej: GET
// /api/v1/files/download/:fileName), configurando las cabeceras HTTP adecuadas para
//forzar la descarga.

const routerArchivos = Router();
//subir archivo y guardar en base de datos
routerArchivos.post('/upload/:idProducto', validateExistencia(Producto, 'idProducto'), upload.single('archivo'), uploadArchivo)
//lista de archivos de un producto específico
routerArchivos.get('/:idProducto', validateExistencia(Producto, 'idProducto'), getAllArchivosByIdProducto)
//descargar un archivo específico
routerArchivos.get('/download/:fileName', downloadArchivo);
//eliminar archivo por id  http://localhost:3000/api/v1/files/9
routerArchivos.delete('/:id', deleteArchivo);
//eliminar todos los archivos de un producto
//ejemplo http://localhost:3000/api/v1/files/1
routerArchivos.delete('/:idProducto', deleteArchivosDeUnProducto);
//subir y guardar en la base de datos multiples archivos
//ejemplo http://localhost:3000/api/v1/files/upload/multiple/1
routerArchivos.post('/upload/multiple/:idProducto', validateExistencia(Producto, 'idProducto'), upload.array('archivos', 10), uploadsArchivos)

// Endpoint para servir imágenes (ruta dinámica)
//ejemplo: http://localhost:3000/api/v1/files/image/5/123456-abc123.jpg
routerArchivos.get('/image/:productId/:fileName', servidorDeImagenes);

// combina filesystem + base de datos- Trae todas las imágenes de un producto por su id
//http://localhost:3000/api/v1/files/imagenes-db/:productId
routerArchivos.get('/imagenes-db/:productId', validateExistencia(Producto, 'productId'), getAllImgsURLByIdProductos);

//trae una imagen por su id
routerArchivos.get('/imagen-db/:id', getImgById);

export default routerArchivos;