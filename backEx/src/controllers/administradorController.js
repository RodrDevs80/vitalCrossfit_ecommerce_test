import Administrador from "../models/Administrador.js";
import { validationResult } from 'express-validator';



export const getAdmin = async (req, res) => {
  try {
    //http://localhost:3000/api/v1/administradores?page=2&limit=5
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const administradores = await Administrador.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: administradores.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(administradores.count / limit),
        totalItems: administradores.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error("Error en getAllAdmin:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudieron obtener los administradores"
    });
  }

}

export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "ID de administrador inválido"
      });
    }

    const administrador = await Administrador.findByPk(id);

    if (!administrador) {
      return res.status(404).json({
        success: false,
        error: "Administrador no encontrado"
      });
    }

    res.json({
      success: true,
      data: administrador
    });
  } catch (err) {
    console.error("Error en getAdminById:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo obtener el administrador"
    });
  }
}

export const createAdmin = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de entrada inválidos",
        details: errors.array()
      });
    }

    const { nombre, apellido, email, contrasena, rol } = req.body;

    const nuevoAdmin = await Administrador.create({
      nombre,
      apellido,
      email,
      contrasena,
      rol
    });

    // Obtener el usuario con el rol incluido
    const adminNuevo = await Administrador.findByPk(nuevoAdmin.id);

    res.status(201).json({
      success: true,
      data: adminNuevo,
      message: "Administrador creado exitosamente"
    });
  } catch (err) {
    console.error("Error en createAdmin:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo crear el administrador"
    });
  }
}


export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Datos de entrada inválidos",
        details: errors.array()
      });
    }

    const administrador = await Administrador.findByPk(id);
    if (!administrador) {
      return res.status(404).json({
        success: false,
        error: "Administrador no encontrado"
      });
    }

    await administrador.update(req.body);

    // Obtener el usuario actualizado con el rol incluido
    const adminActualizado = await Administrador.findByPk(id);

    res.json({
      success: true,
      data: adminActualizado,
      message: "Administrador actualizado exitosamente"
    });
  } catch (err) {
    console.error("Error en updateAdmin:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo actualizar el administrador"
    });
  }
}


export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const administrador = await Administrador.findByPk(id);
    if (!administrador) {
      return res.status(404).json({
        success: false,
        error: "Administrador no encontrado"
      });
    }

    await administrador.destroy();

    res.json({
      success: true,
      message: "Administrador eliminado exitosamente"
    });
  } catch (err) {
    console.error("Error en deleteUsuario:", err);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "No se pudo eliminar el usuario"
    });
  }
}

export const deleteLogicoAdmin = async (req, res) => {
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

    const administrador = await Administrador.findByPk(id);

    if (!administrador) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: 'No existe el Administrador buscado'
      });
    }

    await Administrador.update(
      { activo: !administrador.activo },
      { where: { id } }
    );

    res.status(200).json({
      status: 200,
      message: `Estado del administrador ${administrador.activo ? 'desactivado' : 'activado'} correctamente`
    });
  } catch (err) {
    res.status(500).json({
      error: "Error al intentar modificar el estado del administrador",
      message: err.message
    });
  }
}

