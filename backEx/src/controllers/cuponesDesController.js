import CuponDescuento from "../models/CuponDescuento.js";

const getAllCupones = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    let orderBy = req.query.orderBy || 'createdAt';
    let orderDirection = req.query.orderDirection || 'DESC';

    // Validar y mapear campos de ordenación
    const validOrderFields = ['id', 'nombre', 'codigo', 'porcentajeDescuento', 'activo', 'idProducto', 'fechaCreacion', 'fechaActualizacion'];
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
    const { count, rows: cupones } = await CuponDescuento.findAndCountAll({
      where: whereClause,
      order: [[orderBy, orderDirection]],
      limit: limit,
      offset: offset,
      attributes: ['id', 'nombre', 'codigo', 'porcentajeDescuento', 'activo', 'idProducto', 'fechaCreacion', 'fechaActualizacion']
    });

    const totalPages = Math.ceil(count / limit);


    res.status(200).json({
      success: true,
      data: {
        cupones,
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
    res.status(500).json({
      status: 500,
      error: "Error al obtener el listado de cupones",
      message: err.message
    });
  }
};


const getAllCuponesActivos = async (req, res) => {
  try {
    const allCuponesActivos = await CuponDescuento.scope("activo").findAll();
    res.status(200).json({
      status: 200,
      message: allCuponesActivos.length === 0 ? 'No hay cupones en la base de datos' : 'cupones obtenidas exitosamente',
      data: allCuponesActivos,
      total: allCuponesActivos.length
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: "Error al obtener el listado de cupones",
      message: err.message
    });
  }
}

const getCuponById = async (req, res) => {
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
    const cupon = await CuponDescuento.findByPk(id);
    if (!cupon) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: `No existe el cupón con el id: ${id}`
      })
    }

    res.status(200).json({
      status: 200,
      message: 'cupón obtenido exitosamente',
      data: cupon,
    })
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: `Error al obtener el cupón con el id: ${id}`,
      message: err.message
    });
  }

}

const createCupon = async (req, res) => {
  try {
    const { nombre, codigo, porcentajeDescuento, idProducto } = req.body;

    // Validación de campos requeridos
    if (!nombre || !codigo || !porcentajeDescuento || !idProducto) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'Los campos nombre, código, porcentajeDescuento, idProducto  es obligatorio'
      });
    }

    const nuevoCupon = await CuponDescuento.create({ nombre, codigo, porcentajeDescuento, idProducto });

    res.status(201).json({
      status: 201,
      message: "Nuevo cupón creado con éxito",
      data: nuevoCupon
    })

  } catch (err) {

    res.status(500).json({
      status: 500,
      error: `Error al crear cupón`,
      message: err.message
    });
  }
}
const updateCupon = async (req, res) => {
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


    const cupon = await CuponDescuento.findByPk(id)
    if (!cupon) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: `No existe el cupón con el id: ${id}`
      });
    }
    const { nombre, codigo, porcentajeDescuento, idProducto } = req.body;

    // Validación de campos requeridos
    if (!nombre || !codigo || !porcentajeDescuento || !idProducto) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'Los campos nombre, código, porcentajeDescuento, idProducto  es obligatorio'
      });
    }
    await CuponDescuento.update({ nombre, codigo, porcentajeDescuento, idProducto }, { where: { id: id } })

    // Obtener el cupón actualizado para devolverlo
    const cuponActualizado = await CuponDescuento.findByPk(id);

    res.status(200).json({
      status: 200,
      message: `Cupón actualizado correctamente`,
      data: cuponActualizado
    });


  } catch (err) {

    res.status(500).json({
      status: 500,
      error: `Error al actualizar cupón`,
      message: err.message
    });
  }
}

const deleteFisicoCupon = async (req, res) => {
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

    const cupon = await CuponDescuento.findByPk(id);
    if (!cupon) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: `No existe el cupón con el id: ${id}`
      })
    }

    await CuponDescuento.destroy({
      where: {
        id: id
      },
    })
    res.status(200).json({
      status: 200,
      message: `Cupón con el id:${id} eliminado correctamente`,
    });


  } catch (err) {
    res.status(500).json({
      status: 500,
      error: `Error al eliminar cupón`,
      message: err.message
    });
  }
}
const deleteLogicoCupon = async (req, res) => {
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

    const cupon = await CuponDescuento.findByPk(id);
    if (!cupon) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: `No existe el cupón con el id: ${id}`
      })
    }

    await CuponDescuento.update(
      { activo: !cupon.activo },
      { where: { id: id } }
    );
    res.status(200).json({
      status: 200,
      message: `Cupón con el id:${id} ${cupon.activo ? 'desactivado' : 'activado'} correctamente`,
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      error: `Error al desactivar cupón`,
      message: err.message
    });
  }
}

const validarCupon = async (req, res) => {
  try {
    const codigoCupon = req.params.codigoCupon;

    const cupon = await CuponDescuento.scope("activo").findOne({
      where: {
        codigo: codigoCupon
      }
    });

    if (!cupon) {
      return res.status(200).json({
        message: `No existe el cupón con el código: ${codigoCupon}`,
        valido: false
      })
    }
    res.status(200).json({
      status: 200,
      message: `Cupón con el código:${codigoCupon} es valido `,
      valido: true,
      cupon
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      error: `Error al validar cupón`,
      message: err.message
    });
  }
}

export { getAllCuponesActivos, getCuponById, createCupon, updateCupon, deleteFisicoCupon, deleteLogicoCupon, validarCupon, getAllCupones }