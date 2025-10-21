import Carrito from "../models/Carrito.js";
import Usuario from "../models/Usuario.js";

const getAllCarritos = async (req, res) => {
  try {
    const allCarritos = await Carrito.findAll();

    res.status(200).json({
      status: 200,
      message: allCarritos.length === 0 ? 'No hay carritos en la base de datos' : 'carritos obtenidas exitosamente',
      data: allCarritos,
      total: allCarritos.length
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      error: "Error al obtener el listado de carritos",
      message: err.message
    });
  }
}

const getCarritoById = async (req, res) => {
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

    const carrito = await Carrito.findByPk(id);

    if (!carrito) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: `No existe el carrito con el id: ${id}`
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Carrito obtenido exitosamente',
      data: carrito
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      error: "Error al obtener la carrito",
      message: err.message
    });
  }
}

const createCarrito = async (req, res) => {
  try {
    const { idUsuario } = req.body;

    // Validación de campos requeridos
    if (!idUsuario) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'El campos idUsuario es obligatorio'
      });
    }

    const nuevoCarrito = await Carrito.create({ idUsuario });

    res.status(201).json({
      status: 201,
      message: 'Carrito creada exitosamente',
      data: nuevoCarrito
    });

  } catch (err) {

    res.status(500).json({
      status: 500,
      error: "Error al crear carrito",
      message: err.message
    });
  }
}

const updateCarrito = async (req, res) => {
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

    const { idUsuario } = req.body;

    if (!idUsuario) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'El campo es idUsuario obligatorio'
      });
    }

    const carrito = await Carrito.findByPk(id);
    if (!carrito) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: `No existe el carrito con el id: ${id}`
      });
    }

    const datosActualizacion = { idUsuario };

    await Carrito.update(datosActualizacion, { where: { id } });

    // Obtener la categoría actualizada para devolverla
    const carritoActualizado = await Carrito.findByPk(id);

    res.status(200).json({
      status: 200,
      message: `Carrito actualizado correctamente`,
      data: carritoActualizado
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      error: "Error al actualizar la carrito",
      message: err.message
    });
  }
}

const deleteCarrito = async (req, res) => {
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

    const carrito = await Carrito.findByPk(id);
    if (!carrito) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: `No existe el carrito con el id: ${id}`
      });
    }

    await Carrito.destroy({ where: { id } });

    res.status(200).json({
      status: 200,
      message: `Carrito eliminada correctamente`,
      data: carrito
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      error: "Error al eliminar el carrito",
      message: err.message
    });
  }
}

const getAllCarritoByIdUser = async (req, res) => {
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

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: `No existe el usuario con el id: ${id}`
      });
    }


    const carrito = await Carrito.findAll({
      where: {
        idUsuario: id
      }
    })

    console.log('Desde el Back: ', carrito)

    if (carrito.length === 0) {
      return res.status(200).json({
        status: 200,
        estado: false,
        message: 'Usuario sin carrito',
      });
    }
    res.status(200).json({
      status: 200,
      estado: true,
      message: 'Carrito obtenido exitosamente',
      data: carrito
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      error: "Error al obtener la carrito",
      message: err.message
    });
  }
}

export { getAllCarritos, getCarritoById, createCarrito, updateCarrito, deleteCarrito, getAllCarritoByIdUser };