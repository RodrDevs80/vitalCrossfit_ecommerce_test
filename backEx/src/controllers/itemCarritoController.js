import { param } from "express-validator";
import ItemCarrito from "../models/ItemCarrito.js";
import Carrito from "../models/Carrito.js";

const getAllItemsCarrito = async (req, res) => {
    try {
        const allItemsCarrito = await ItemCarrito.findAll();

        res.status(200).json({
            status: 200,
            message: allItemsCarrito.length === 0 ? 'No hay itemsCarrito en la base de datos' : 'itemsCarrito obtenidas exitosamente',
            data: allItemsCarrito,
            total: allItemsCarrito.length
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Error al obtener el listado de itemsCarrito",
            message: err.message
        });
    }
}

const getItemCarritoById = async (req, res) => {
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

        const itemCarrito = await ItemCarrito.findByPk(id);

        if (!itemCarrito) {
            return res.status(404).json({
                status: 404,
                title: 'Not Found',
                message: `No existe el itemCarrito con el id: ${id}`
            });
        }

        res.status(200).json({
            status: 200,
            message: 'ItemCarrito obtenido exitosamente',
            data: itemCarrito
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Error al obtener el ItemCarrito",
            message: err.message
        });
    }
}


const createItemCarrito = async (req, res) => {
    try {
        const { idCarrito, idProducto, cantidad, precioUnitario } = req.body;

        // Validación de campos requeridos
        if (!idCarrito || !idProducto || !cantidad || !precioUnitario) {
            return res.status(400).json({
                status: 400,
                title: 'Bad Request',
                message: 'Los campos idCarrito, idProducto, total, cantidad y precioUnitario son obligatorios'
            });
        }

        const nuevoItemCarrito = await ItemCarrito.create({ idCarrito, idProducto, cantidad, precioUnitario });

        res.status(201).json({
            status: 201,
            message: 'ItemCarrito creada exitosamente',
            data: nuevoItemCarrito
        });

    } catch (err) {

        res.status(500).json({
            status: 500,
            error: "Error al crear itemCarrito",
            message: err.message
        });
    }
}

const updateItemCarrito = async (req, res) => {
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

        const { idCarrito, idProducto, cantidad, precioUnitario } = req.body;

        // Validación de campos requeridos
        if (!idCarrito || !idProducto || !cantidad || !precioUnitario) {
            return res.status(400).json({
                status: 400,
                title: 'Bad Request',
                message: 'Los campos idCarrito, idProducto, cantidad y precioUnitario son obligatorios'
            });
        }

        const itemCarrito = await ItemCarrito.findByPk(id);
        if (!itemCarrito) {
            return res.status(404).json({
                status: 404,
                title: 'Not Found',
                message: `No existe el itemCarrito con el id: ${id}`
            });
        }

        const datosActualizacion = { idCarrito, idProducto, cantidad, precioUnitario };

        await ItemCarrito.update(datosActualizacion, { where: { id } });

        // Obtener la categoría actualizada para devolverla
        const itemCarritoActualizado = await ItemCarrito.findByPk(id);

        res.status(200).json({
            status: 200,
            message: `ItemCarrito actualizado correctamente`,
            data: itemCarritoActualizado
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Error al actualizar el itemCarrito",
            message: err.message
        });
    }
}

const deleteItemCarrito = async (req, res) => {
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

        const itemCarrito = await ItemCarrito.findByPk(id);
        if (!itemCarrito) {
            return res.status(404).json({
                status: 404,
                title: 'Not Found',
                message: `No existe el itemCarrito con el id: ${id}`
            });
        }

        await ItemCarrito.destroy({ where: { id } });

        res.status(200).json({
            status: 200,
            message: `ItemCarrito eliminada correctamente`,
            data: itemCarrito
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Error al eliminar el itemCarrito",
            message: err.message
        });
    }
}

const getAllitemsByIdCarrito = async (req, res) => {
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
                message: `No existe el Carrito con el id: ${id}`
            });
        }

        const allItemsCarrito = await ItemCarrito.findAll({ where: { idCarrito: id } });

        res.status(200).json({
            status: 200,
            message: allItemsCarrito.length === 0 ? 'No hay itemsCarrito en la base de datos' : 'itemsCarrito obtenidas exitosamente',
            data: allItemsCarrito,
            total: allItemsCarrito.length
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Error al obtener el listado de itemsCarrito por id de Carrito",
            message: err.message
        });
    }
}

export { getAllItemsCarrito, getItemCarritoById, createItemCarrito, updateItemCarrito, deleteItemCarrito, getAllitemsByIdCarrito }