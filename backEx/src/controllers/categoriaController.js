import Categoria from "../models/Categoria.js";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
import { Op } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const getAllCategorias = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    let orderBy = req.query.orderBy || 'createdAt';
    let orderDirection = req.query.orderDirection || 'DESC';

    // Validar y mapear campos de ordenación
    const validOrderFields = ['id', 'nombre', 'descripcion', 'activo', 'imagenUrl', 'fechaDeCreacion', 'fechaDeActualizacion'];
    if (!validOrderFields.includes(orderBy)) {
      orderBy = 'fechaActualizacion';
    }

    // Validar dirección de ordenación
    const validDirections = ['ASC', 'DESC'];
    if (!validDirections.includes(orderDirection.toUpperCase())) {
      orderDirection = 'DESC';
    }
    const whereClause = {};

    if (req.query.nombre) {
      whereClause.nombre = req.query.nombre;
    }

    if (req.query.search) {
      whereClause.nombre = {
        [Op.like]: `%${req.query.search}%`
      };
    }

    // Consulta con paginación y ordenación
    const { count, rows: categorias } = await Categoria.findAndCountAll({
      where: whereClause,
      order: [[orderBy, orderDirection]],
      limit: limit,
      offset: offset,
      attributes: ['id', 'nombre', 'descripcion', 'activo', 'imagenUrl', 'fechaDeCreacion', 'fechaDeActualizacion']
    });

    const totalPages = Math.ceil(count / limit);

    if (categorias.length === 0) {
      res.status(200).json({ status: 200, message: 'No hay categorias en la base de datos!!!' })
    } else {
      res.json({
        success: true,
        data: {
          categorias,
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
    }

  } catch (err) {
    res.status(500).json({
      status: 500,
      error: "Error al obtener el listado de categorías",
      message: err.message
    });
  }
};

const getAllCategoriaActivos = async (req, res) => {
  try {
    const categoriasActivas = await Categoria.scope("activos").findAll();

    res.status(200).json({
      status: 200,
      message: categoriasActivas.length === 0 ? 'No hay categorías activas en la base de datos' : 'Categorías activas obtenidas exitosamente',
      data: categoriasActivas,
      total: categoriasActivas.length
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: "Error al obtener el listado de categorías activas",
      message: err.message
    });
  }
}

const getCategoriaById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validación del ID
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'ID inválido. Debe ser un número entero positivo'
      });
    }

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: `No existe la categoría con el id: ${id}`
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Categoría obtenido exitosamente',
      data: categoria
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      error: "Error al obtener la categoría",
      message: err.message
    });
  }
}


const createCategoria = async (req, res) => {
  // console.log(req.file)
  try {
    const { nombre, descripcion } = req.body;

    // Validación de campos requeridos
    if (!nombre || !descripcion) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'Los campos nombre, descripcion son obligatorios'
      });
    }

    // Validación de tipos
    if (typeof nombre !== 'string' || typeof descripcion !== 'string') {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'Los campos nombre, descripcion deben ser strings'
      });
    }
    let imagenUrl = "";
    // Manejo de imagen
    if (req.file) {
      const nombreImagen = req.file.filename;
      imagenUrl = `http://localhost:3000/api/v1/categorias/imagen/portadas/${nombreImagen}`;
    }

    const nuevaCategoria = await Categoria.create({ nombre, descripcion, imagenUrl });

    res.status(201).json({
      status: 201,
      message: 'Categoría creada exitosamente',
      data: nuevaCategoria
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      error: "Error al crear la categoría",
      message: err.message
    });
  }
};

const updateCategoria = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validación del ID
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'ID inválido. Debe ser un número entero positivo'
      });
    }

    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'Los campos nombre, descripcion son obligatorios'
      });
    }

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: `No existe la categoría con el id: ${id}`
      });
    }

    // Validación de tipos
    if (typeof nombre !== 'string' || typeof descripcion !== 'string') {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'Los campos nombre, descripcion deben ser strings'
      });
    }
    let imagenUrl = "";
    // Manejo de imagen
    if (req.file) {
      const nombreImagen = req.file.filename;
      //http://localhost:3000/api/v1/categorias/imagen/portadas/1757447087723-s2ohb0.jpg
      imagenUrl = `http://localhost:3000/api/v1/categorias/imagen/portadas/${nombreImagen}`;
    }
    const datosActualizacion = { nombre, descripcion, imagenUrl };

    await Categoria.update(datosActualizacion, { where: { id } });

    // Obtener la categoría actualizada para devolverla
    const categoriaActualizada = await Categoria.findByPk(id);

    res.status(200).json({
      status: 200,
      message: `Categoría actualizada correctamente`,
      data: categoriaActualizada
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      error: "Error al actualizar la categoría",
      message: err.message
    });
  }
};

const deleteLogicoCategoria = async (req, res) => {
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

    const categoria = await Categoria.findByPk(id);

    if (categoria === null) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: 'No existe la categoría buscado'
      });
    }

    await Categoria.update(
      { activo: !categoria.activo },
      { where: { id } }
    );

    res.status(200).json({
      status: 200,
      message: `Estado de la categoría ${categoria.activo ? 'desactivado' : 'activado'} correctamente`
    });
  } catch (err) {
    res.status(500).json({
      error: "Error al intentar modificar el estado de la categoría",
      message: err.message
    });
  }
};

const deleteCategoria = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validación del ID
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'ID inválido. Debe ser un número entero positivo'
      });
    }

    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: `No existe la categoría con el id: ${id}`
      });
    }

    await Categoria.destroy({ where: { id } });

    res.status(200).json({
      status: 200,
      message: `Categoría eliminada correctamente`,
      data: categoria
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      error: "Error al eliminar la categoría",
      message: err.message
    });
  }
};

const servidorDeImagenDeCategoria = (req, res) => {
  try {
    const { fileName } = req.params;
    //backEx\uploads\categorias\portadas\1757447087723-s2ohb0.jpg
    // Ruta corregida - sube dos niveles para llegar a backEx/uploads
    const imagePath = path.join(__dirname, '..', '..', 'uploads', 'categorias', 'portadas', fileName);

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

const getCategoriasSimple = async (req, res) => {
  try {
    const categorias = await Categoria.findAll({
      order: [['nombre', 'ASC']],
      attributes: ['id', 'nombre', 'descripcion', 'imagenUrl', 'activo']
    });

    res.json({
      success: true,
      data: categorias
    });
  } catch (error) {
    console.error("Error en getCategoriasSimple:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};
export { getAllCategorias, getAllCategoriaActivos, createCategoria, updateCategoria, deleteCategoria, deleteLogicoCategoria, getCategoriaById, servidorDeImagenDeCategoria, getCategoriasSimple }


