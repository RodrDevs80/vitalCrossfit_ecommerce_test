import Mensaje from "../models/Mensaje.js";
import Producto from "../models/Producto.js";

const getAllMensajesByProductoId = async (req, res) => {

    try {
        const idProducto = Number(req.params.idProducto);

        // Validación del ID
        if (isNaN(idProducto) || idProducto <= 0) {
            return res.status(400).json({
                status: 400,
                title: 'Bad Request',
                message: 'iDProducto inválido. Debe ser un número entero positivo'
            });
        }

        const producto = await Producto.findByPk(idProducto);

        if (!producto) {
            return res.status(404).json({
                status: 404,
                title: 'Not Found',
                message: `No existe el producto con el id: ${idProducto}`
            });
        }

        const allMensajes = await Mensaje.findAll({
            where: {
                idProducto,
            }
        });

        res.status(200).json({
            status: 200,
            message: allMensajes.length === 0 ? "No hay mensajes para ese producto en la base de datos" : "mensajes obtenidos de manera satisfactoria",
            data: allMensajes,
            total: allMensajes.length
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Error al obtener el listado de mensajes",
            message: err.message
        });
    }
}

const createMensaje = async (req, res) => {
    try {

        const { texto, calificacion, idProducto } = req.body

        //validar que no estén vacíos
        if (!texto || !calificacion || !idProducto) {
            return res.status(400).json({
                status: 400,
                title: 'Bad Request',
                error: "Los campos texto e ideProducto son requeridos",
            });
        }

        const newMensaje = await Mensaje.create({ texto, idProducto, calificacion });

        res.status(201).json({
            status: 201,
            message: 'Mensaje creado exitosamente',
            data: newMensaje
        });


    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Error al crear el listado mensaje",
            message: err.message
        });
    }
}

export { getAllMensajesByProductoId, createMensaje }