import Producto from "../models/Producto.js";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
import { Op } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAllProductosSimple = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      order: [['nombre', 'ASC']],
      attributes: ['id', 'nombre']
    });

    res.json({
      success: true,
      data: productos
    });
  } catch (error) {
    console.error("Error en getAllProductosSimple:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

const getAllProductos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    let orderBy = req.query.orderBy || 'createdAt';
    let orderDirection = req.query.orderDirection || 'DESC';

    // Validar y mapear campos de ordenación
    const validOrderFields = ['id', 'nombre', 'precio', 'activo', 'oferta', 'descuento', 'imagenUrl', 'fechaActualizacion', 'idCategoria', 'descripcion'];
    if (!validOrderFields.includes(orderBy)) {
      orderBy = 'fechaActualizacion';
    }

    // Validar dirección de ordenación
    const validDirections = ['ASC', 'DESC'];
    if (!validDirections.includes(orderDirection.toUpperCase())) {
      orderDirection = 'DESC';
    }
    const whereClause = {};

    if (req.query.idCategoria) {
      whereClause.idCategoria = req.query.idCategoria;
    }
    if (req.query.minPrecio || req.query.maxPrecio) {
      whereClause.precio = {};
      if (req.query.minPrecio) {
        whereClause.precio[Op.gte] = parseFloat(req.query.minPrecio);
      }
      if (req.query.maxPrecio) {
        whereClause.precio[Op.lte] = parseFloat(req.query.maxPrecio);
      }
    }
    if (req.query.search) {
      whereClause.nombre = {
        [Op.like]: `%${req.query.search}%`
      };
    }
    // Consulta con paginación y ordenación
    const { count, rows: products } = await Producto.findAndCountAll({
      where: whereClause,
      order: [[orderBy, orderDirection]],
      limit: limit,
      offset: offset,
      attributes: ['id', 'nombre', 'precio', 'activo', 'oferta', 'descuento', 'imagenUrl', 'fechaActualizacion', 'idCategoria', 'descripcion']
    });

    const totalPages = Math.ceil(count / limit);


    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        sorting: {
          orderBy,
          orderDirection
        }
      }
    });

  } catch (err) {
    res.status(500).json({ error: "Error al obtener el listado de productos", message: err.message });
  }
}

const getAllProductosActivos = async (req, res) => {
  try {
    const allProductosActivos = await Producto.scope("activos").findAll();
    if (allProductosActivos.length === 0) {
      res.status(200).json({ status: 200, message: 'No hay productos activos en la base de datos!!!' })
    } else {
      res.status(200).json(allProductosActivos);
    }
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el listado de Productos activos", message: err.message });
  }
}

const getProductosOfertasAndDescuentos = async (req, res) => {
  try {
    const productosOfertas = await Producto.scope("activos").findAll({
      where: {
        oferta: true
      }
    })

    res.status(200).json({
      status: 200,
      message: productosOfertas.length === 0 ? 'No hay productos con ofertas en la base de datos' : 'Productos con ofertas obtenidos exitosamente',
      data: productosOfertas,
      total: productosOfertas.length
    })

  } catch (error) {
    res.status(500).json({ error: "Error al obtener el Producto", message: err.message });
  }
}


const getProductoById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validación del ID
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'ID inválido'
      });
    }

    const ProductoById = await Producto.findByPk(id);
    if (ProductoById === null) {
      return res.status(404).json({ status: 404, title: 'Not Found', message: `No existe el Producto buscado con el id: ${id}` });
    }

    res.status(200).json({ status: 200, Producto: ProductoById });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el Producto", message: err.message });
  }
}


const createProducto = async (req, res) => {
  const nombreImagen = req.file.filename;
  console.log(req.file)
  try {
    const {
      nombre,
      descripcion,
      precio,
      especificaciones,
      idCategoria,
      calificacion,
      oferta,
      descuento
    } = req.body;

    // Validación básica de campos requeridos
    if (!nombre || !descripcion || !precio || !especificaciones || !idCategoria) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'Los campos nombre, descripción, precio, especificaciones y idCategoría son obligatorios'
      });
    }

    const newProducto = await Producto.create({
      nombre,
      descripcion,
      precio,
      imagenUrl: `http://localhost:3000/api/v1/productos/imagen/portadas/${nombreImagen}`,
      especificaciones,
      idCategoria,
      calificacion,
      oferta,
      descuento
    });


    res.status(201).json({
      status: 201,
      message: 'Se creó de manera exitosa un nuevo producto',
      newProducto
    });
  } catch (err) {

    res.status(500).json({
      error: "Error al intentar crear un nuevo Producto",
      message: err.message
    });
  }
};
const updateProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'ID inválido'
      });
    }

    // Verificar si el producto existe primero
    const productoExistente = await Producto.findByPk(id);
    if (!productoExistente) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: `No existe el producto con id: ${id}`
      });
    }

    const { nombre, descripcion, precio, especificaciones, idCategoria, calificacion, oferta, descuento, activo } = req.body;

    const camposAActualizar = {};

    // Campos básicos
    if (nombre !== undefined) camposAActualizar.nombre = nombre;
    if (descripcion !== undefined) camposAActualizar.descripcion = descripcion;
    if (precio !== undefined) camposAActualizar.precio = parseFloat(precio);
    if (especificaciones !== undefined) camposAActualizar.especificaciones = especificaciones;
    if (idCategoria !== undefined) camposAActualizar.idCategoria = parseInt(idCategoria);
    if (calificacion !== undefined) camposAActualizar.calificacion = parseFloat(calificacion);
    if (oferta !== undefined) camposAActualizar.oferta = oferta === 'true' || oferta === true;
    if (descuento !== undefined) camposAActualizar.descuento = parseInt(descuento);
    if (activo !== undefined) camposAActualizar.activo = activo;
    // Manejo de imagen
    if (req.file) {
      const nombreImagen = req.file.filename;
      camposAActualizar.imagenUrl = `http://localhost:3000/api/v1/productos/imagen/portadas/${nombreImagen}`;

    }

    await Producto.update(camposAActualizar, {
      where: { id }
    });

    const productoActualizado = await Producto.findByPk(id);

    res.status(200).json({
      status: 200,
      message: `Producto actualizado correctamente`,
      data: productoActualizado
    });

  } catch (err) {
    console.error('Error en updateProducto:', err);
    res.status(500).json({
      status: 500,
      title: 'Internal Server Error',
      message: 'Error al actualizar el producto',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

const deleteProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validación del ID
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'ID inválido'
      });
    }

    const productoAEliminar = await Producto.findByPk(id);
    if (productoAEliminar === null) {
      return res.status(404).json({ status: 404, title: 'Not Found', message: 'No existe el producto buscado' });
    }

    await Producto.destroy({
      where: { id }
    });

    res.status(200).json({ status: 200, message: `Se eliminó correctamente el producto con el id: ${id}`, ProductoEliminado: productoAEliminar });
  } catch (err) {
    res.status(500).json({ error: "Error al intentar eliminar Producto", message: err.message });
  }
}

const deleteLogicoProducto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validación del ID
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'ID inválido'
      });
    }

    const producto = await Producto.findByPk(id);

    if (producto === null) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: 'No existe el Producto buscado'
      });
    }

    await Producto.update(
      { activo: !producto.activo },
      { where: { id } }
    );

    res.status(200).json({
      status: 200,
      message: `Estado del Producto ${producto.activo ? 'desactivado' : 'activado'} correctamente`
    });
  } catch (err) {
    res.status(500).json({
      error: "Error al intentar modificar el estado del Producto",
      message: err.message
    });
  }
}

const servidorDeImagenDePortada = (req, res) => {
  try {
    const { fileName } = req.params;

    // Ruta corregida - sube dos niveles para llegar a backEx/uploads
    const imagePath = path.join(__dirname, '..', '..', 'uploads', 'productos', 'portadas', fileName);

    if (!fs.existsSync(imagePath)) {
      console.log('Imagen no encontrada en:', imagePath);
      return res.status(404).json({
        error: "Imagen no encontrada",
        message: `La imagen ${fileName} no existe`
      });
    }

    // Determinar el tipo de contenido
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
export { getAllProductos, getAllProductosActivos, getProductoById, createProducto, updateProducto, deleteProducto, deleteLogicoProducto, getProductosOfertasAndDescuentos, servidorDeImagenDePortada, getAllProductosSimple }