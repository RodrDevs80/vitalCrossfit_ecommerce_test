import Archivo from '../models/Archivos.js';
import Producto from '../models/Producto.js';
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadArchivo = async (req, res) => {
  try {
    const { id } = req.foundRecord;

    const archivo = await Archivo.create({
      nombre: req.file.filename,
      nombreOriginal: req.file.originalname,
      tipo: req.file.mimetype,
      peso: req.file.size,
      ruta: req.file.path,
      idProducto: id
    })

    res.json({
      status: 201,
      message: 'Archivo subido y creado exitosamente',
      file: archivo
    });
  } catch (err) {
    res.status(500).json({
      error: "Error al intentar crear nuevo Archivo",
      message: err.message
    });
  }

}


const getAllArchivosByIdProducto = async (req, res) => {
  try {
    const { id } = req.foundRecord;

    const archivos = await Archivo.findAll({
      where: {
        idProducto: id
      }
    });
    const producto = await Producto.findByPk(id);

    res.json({
      status: 200,
      message: 'Listado de archivos por producto',
      producto: producto,
      archivos: archivos
    });
  } catch (err) {
    res.status(500).json({
      error: "Error al intentar listar archivos",
      message: err.message
    });
  }

}



const downloadArchivo = async (req, res) => {
  try {
    const { fileName } = req.params;

    const archivo = await Archivo.findOne({
      where: { nombre: fileName }
    });

    if (!archivo) {
      return res.status(404).json({
        error: "Archivo no encontrado",
        message: `El archivo ${fileName} no existe`
      });
    }

    if (!fs.existsSync(archivo.ruta)) {
      return res.status(404).json({
        error: "Archivo no disponible",
        message: "El archivo no se encuentra en el servidor"
      });
    }


    res.download(archivo.ruta, archivo.nombreOriginal, (err) => {
      if (err) {
        console.error('Error en la descarga:', err);
        if (!res.headersSent) {
          res.status(500).json({
            error: "Error en la descarga",
            message: err.message
          });
        }
      }
    });

  } catch (err) {
    console.error('Error general:', err);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Error al intentar descargar archivo",
        message: err.message
      });
    }
  }
}
const deleteArchivo = async (req, res) => {
  try {
    const { id } = req.params;
    const archivo = await Archivo.findByPk(id);

    if (!archivo) {
      return res.status(404).json({
        error: "Archivo no encontrado",
        message: `El archivo con ID ${id} no existe`
      });
    }

    const filePath = path.join(process.cwd(), archivo.ruta);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await archivo.destroy();

    res.status(200).json({
      success: true,
      status: 200,
      message: "El archivo se eliminó correctamente"
    });

  } catch (err) {
    console.error('Error general:', err);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Error al intentar eliminar archivo",
        message: err.message
      });
    }
  }
}
const deleteArchivosDeUnProducto = async (req, res) => {
  try {
    const { idProducto } = req.params; // id del producto


    const archivos = await Archivo.findAll({
      where: { idProducto }
    })

    const producto = await Producto.findByPk(idProducto);
    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado",
        message: `El producto con ID ${idProducto} no existe`
      });
    }

    if (archivos || archivos.length > 0) {
      const filesRutas = archivos.map(archivo =>
        path.join(process.cwd(), archivo.ruta)
      );

      //borrado del disco
      const deleteResults = await Promise.allSettled(
        filesRutas.map(filePath => {
          return new Promise((resolve, reject) => {
            if (fs.existsSync(filePath)) {
              fs.unlink(filePath, (error) => {
                if (error) {
                  console.error(`Error eliminando ${filePath}:`, error);
                  reject(error);
                } else {
                  console.log(`Archivo eliminado: ${filePath}`);
                  resolve(filePath);
                }
              });
            } else {
              console.warn(`Archivo no encontrado: ${filePath}`);
              resolve(null);
            }
          });
        })
      );

      await Promise.all(
        archivos.map(archivo => archivo.destroy())
      );
      return res.status(200).json({
        success: true,
        status: 200,
        message: `Se eliminaron ${archivos.length} archivos correctamente`
      });
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: `El producto no tenia archivos asociados`
    });


  } catch (err) {
    console.error('Error general:', err);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Error al intentar eliminar archivos",
        message: err.message
      });
    }
  }
}
const uploadsArchivos = async (req, res) => {
  try {
    const { id } = req.foundRecord;


    await req.files.forEach(archivo => Archivo.create({
      nombre: archivo.filename,
      nombreOriginal: archivo.originalname,
      tipo: archivo.mimetype,
      peso: archivo.size,
      ruta: archivo.path,
      idProducto: id
    }))


    res.json({
      status: 201,
      message: 'Archivos subidos y creados exitosamente',
      files: req.files
    });
  } catch (err) {
    res.status(500).json({
      error: "Error al intentar crear nuevo Archivo",
      message: err.message
    });
  }
}

const servidorDeImagenes = (req, res) => {
  try {
    const { productId, fileName } = req.params;
    const imagePath = path.join(__dirname, '..', '..', 'uploads', 'productos', productId, fileName);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        error: "Imagen no encontrada",
        message: `La imagen ${fileName} no existe para el producto ${productId}`
      });
    }

    let contentType = 'application/octet-stream';
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else if (fileName.endsWith('.png')) {
      contentType = 'image/png';
    } else if (fileName.endsWith('.gif')) {
      contentType = 'image/gif';
    } else if (fileName.endsWith('.webp')) {
      contentType = 'image/webp';
    }
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    res.sendFile(imagePath);

  } catch (error) {
    console.error('Error al servir imagen:', error);
    res.status(500).json({
      error: "Error al cargar la imagen",
      message: error.message
    });
  }
}


const getAllImgsURLByIdProductos = async (req, res) => {
  try {
    const { productId } = req.params;
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads', productId);

    const archivosDB = await Archivo.findAll({
      where: { idProducto: productId },
      attributes: ['id', 'nombre', 'nombreOriginal', 'tipo', 'peso', 'ruta', 'fechaSubida']
    });


    let filesExist = [];
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      filesExist = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
      });
    }


    const imageRoutes = archivosDB.map(archivo => {
      const fileExists = filesExist.includes(archivo.nombre);

      return {
        id: archivo.id,
        filename: archivo.nombre,
        originalName: archivo.nombreOriginal,
        type: archivo.tipo,
        size: archivo.peso,
        uploadDate: archivo.fechaSubida,
        exists: fileExists,
        url: `/uploads/productos/${productId}/${archivo.nombre}`,
        apiUrl: `http://localhost:3000/api/v1/files/image/${productId}/${archivo.nombre}`,
        downloadUrl: `http://localhost:3000/api/v1/files/download/${archivo.nombre}`
      };
    });


    const filterImgRoutes = imageRoutes.filter(archivo => archivo.type.startsWith('image'));

    res.status(200).json({
      success: true,
      productId: parseInt(productId),
      totalImages: filterImgRoutes.length,
      images: filterImgRoutes
    });

  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    res.status(500).json({
      success: false,
      error: "Error al obtener las imágenes del producto",
      message: error.message
    });
  }
}
const getImgById = async (req, res) => {
  try {
    const { id } = req.params;

    const img = await Archivo.findByPk(id);

    if (!img) {
      return res.status(404).json({
        error: "Imagen no encontrada",
        message: `La imagen no existe para el producto`
      });
    }
    if (!img.tipo.startsWith('image')) {
      return res.status(404).json({
        error: "Imagen no encontrada",
        message: `El archivo solicitado no es una imagen`
      });
    }

    const imagePath = path.join(__dirname, '..', 'uploads', 'productos', img.idProducto.toString(), img.nombre.toString());



    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        error: "Imagen no encontrada",
        message: `La imagen ${img.nombre} no existe para el producto con el ID:  ${img.idProducto}`
      });
    }


    const imgConRutaDinamica = {
      id: img.id,
      filename: img.nombre,
      originalName: img.nombreOriginal,
      type: img.tipo,
      size: img.peso,
      uploadDate: img.fechaSubida,
      url: `/uploads/productos/${img.idProducto}/${img.nombre}`,
      apiUrl: `http://localhost:3000/api/v1/files/image/${img.idProducto}/${img.nombre}`,
      downloadUrl: `http://localhost:3000/api/v1/files/download/${img.nombre}`
    };

    res.status(200).json({
      success: true,
      imagen: imgConRutaDinamica
    });

  } catch (error) {
    console.error('Error al obtener imagen:', error);
    res.status(500).json({
      success: false,
      error: "Error al obtener la imagen del producto",
      message: error.message
    });
  }
}
export { uploadArchivo, getAllArchivosByIdProducto, downloadArchivo, deleteArchivo, uploadsArchivos, servidorDeImagenes, getAllImgsURLByIdProductos, getImgById, deleteArchivosDeUnProducto }