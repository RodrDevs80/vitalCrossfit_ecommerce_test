import Usuario from "../models/Usuario.js";

const getAllUsuario = async (req, res) => {
  try {
    const allUsuarios = await Usuario.findAll();
    if (allUsuarios.length === 0) {
      res.status(200).json({ status: 200, message: 'No hay usuarios en la base de datos!!!' })
    } else {
      res.status(200).json(allUsuarios);
    }
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el listado de usuarios", message: err.message });
  }
}

const getAllUsuariosActivos = async (req, res) => {
  try {
    const allUsuariosActivos = await Usuario.scope("activos").findAll();
    if (allUsuariosActivos.length === 0) {
      res.status(200).json({ status: 200, message: 'No hay usuarios activos en la base de datos!!!' })
    } else {
      res.status(200).json(allUsuariosActivos);
    }
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el listado de usuarios activos", message: err.message });
  }
}

const getUsuarioById = async (req, res) => {
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

    const usuarioById = await Usuario.findByPk(id);
    if (usuarioById === null) {
      return res.status(404).json({ status: 404, title: 'Not Found', message: `No existe el usuario buscado con el id: ${id}` });
    }

    res.status(200).json({ status: 200, usuario: usuarioById });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el usuario", message: err.message });
  }
}

const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, contrasena, rol } = req.body;

    // Validación básica de campos requeridos
    if (!nombre || !apellido || !email || !contrasena || !rol) {
      return res.status(400).json({
        status: 400,
        title: 'Bad Request',
        message: 'Los campos nombre, apellido, email, contrasena y rol son obligatorios'
      });
    }

    const newUsuario = await Usuario.create({ nombre, apellido, email, contrasena, rol });
    res.status(201).json({ status: 201, message: 'Se creó de manera exitosa un nuevo usuario', newUsuario });
  } catch (err) {
    res.status(500).json({ error: "Error al intentar crear un nuevo usuario", message: err.message });
  }
}

const updateUsuario = async (req, res) => {
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

    const { nombre, apellido, email, contrasena, rol } = req.body;
    const usuarioAActualizar = await Usuario.findByPk(id);

    if (usuarioAActualizar === null) {
      return res.status(404).json({ status: 404, title: 'Not Found', message: `No existe el usuario buscado con el id: ${id}` });
    }

    // Crear objeto con solo los campos que se van a actualizar
    const camposAActualizar = {};
    if (nombre !== undefined) camposAActualizar.nombre = nombre;
    if (apellido !== undefined) camposAActualizar.apellido = apellido;
    if (email !== undefined) camposAActualizar.email = email;
    if (contrasena !== undefined) camposAActualizar.contrasena = contrasena;
    if (rol !== undefined) camposAActualizar.rol = rol;

    await Usuario.update(camposAActualizar, {
      where: { id }
    });

    res.status(200).json({ status: 200, message: `Se actualizó correctamente el usuario con el id: ${id}` });
  } catch (err) {
    res.status(500).json({ error: "Error al intentar actualizar el usuario", message: err.message });
  }
}

const deleteUsuario = async (req, res) => {
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

    const usuarioAEliminar = await Usuario.findByPk(id);
    if (usuarioAEliminar === null) {
      return res.status(404).json({ status: 404, title: 'Not Found', message: 'No existe el usuario buscado' });
    }

    await Usuario.destroy({
      where: { id }
    });

    res.status(200).json({ status: 200, message: `Se eliminó correctamente el usuario con el id: ${id}`, usuarioEliminado: usuarioAEliminar });
  } catch (err) {
    res.status(500).json({ error: "Error al intentar eliminar usuario", message: err.message });
  }
}


const deleteLogicoUsuario = async (req, res) => {
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

    const usuario = await Usuario.findByPk(id);

    if (usuario === null) {
      return res.status(404).json({
        status: 404,
        title: 'Not Found',
        message: 'No existe el usuario buscado'
      });
    }

    await Usuario.update(
      { activo: !usuario.activo },
      { where: { id } }
    );

    res.status(200).json({
      status: 200,
      message: `Estado del usuario ${usuario.activo ? 'desactivado' : 'activado'} correctamente`
    });
  } catch (err) {
    res.status(500).json({
      error: "Error al intentar modificar el estado del usuario",
      message: err.message
    });
  }
}

export { getAllUsuario, getAllUsuariosActivos, getUsuarioById, createUsuario, updateUsuario, deleteUsuario, deleteLogicoUsuario }