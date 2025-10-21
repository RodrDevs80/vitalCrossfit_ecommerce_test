import ItemOrden from "../models/ItemOrden.js";
import Orden from "../models/Orden.js"
const getAllItemsOrden = async (req, res) => {
    try {
        const allItemsOrden = await ItemOrden.findAll();

        res.status(200).json({
            status: 200,
            message: allItemsOrden.length === 0 ? 'No hay itemsOrden en la base de datos' : 'itemsOrden obtenidas exitosamente',
            data: allItemsOrden,
            total: allItemsOrden.length
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Error al obtener el listado de itemsOrden",
            message: err.message
        });
    }
}

const getItemOrdenById = async (req, res) => {
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

        const itemOrden = await ItemOrden.findByPk(id);

        if (!itemOrden) {
            return res.status(404).json({
                status: 404,
                title: 'Not Found',
                message: `No existe el itemOrden con el id: ${id}`
            });
        }

        res.status(200).json({
            status: 200,
            message: 'ItemOrden obtenido exitosamente',
            data: itemOrden
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Error al obtener el ItemOrden",
            message: err.message
        });
    }
}

const createItemOrden = async (req, res) => {
    try {
        const { idOrden, idProducto, cantidad, precioUnitario } = req.body;

        // Validación de campos requeridos
        if (!idOrden || !idProducto || !cantidad || !precioUnitario) {
            return res.status(400).json({
                status: 400,
                title: 'Bad Request',
                message: 'Los campos idOrden, idProducto, cantidad y precioUnitario son obligatorios'
            });
        }

        const nuevoItemOrden = await ItemOrden.create({ idOrden, idProducto, cantidad, precioUnitario });

        res.status(201).json({
            status: 201,
            message: 'ItemOrden creada exitosamente',
            data: nuevoItemOrden
        });

    } catch (err) {

        res.status(500).json({
            status: 500,
            error: "Error al crear itemOrden",
            message: err.message
        });
    }
}

const updateItemOrden = async (req, res) => {
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

        const { idOrden, idProducto, cantidad, precioUnitario } = req.body;

        // Validación de campos requeridos
        if (!idOrden || !idProducto || !cantidad || !precioUnitario) {
            return res.status(400).json({
                status: 400,
                title: 'Bad Request',
                message: 'Los campos idOrden, idProducto, cantidad y precioUnitario son obligatorios'
            });
        }

        const itemOrden = await ItemOrden.findByPk(id);
        if (!itemOrden) {
            return res.status(404).json({
                status: 404,
                title: 'Not Found',
                message: `No existe el itemOrden con el id: ${id}`
            });
        }

        const datosActualizacion = { idOrden, idProducto, cantidad, precioUnitario };

        await ItemOrden.update(datosActualizacion, { where: { id } });

        // Obtener la categoría actualizada para devolverla
        const itemOrdenActualizado = await ItemOrden.findByPk(id);

        res.status(200).json({
            status: 200,
            message: `ItemOrden actualizado correctamente`,
            data: itemOrdenActualizado
        });

    } catch (err) {

        res.status(500).json({
            status: 500,
            error: "Error al actualizar el itemOrden",
            message: err.message
        });
    }
}

const deleteItemOrden = async (req, res) => {
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

        const itemOrden = await ItemOrden.findByPk(id);
        if (!itemOrden) {
            return res.status(404).json({
                status: 404,
                title: 'Not Found',
                message: `No existe el itemCarrito con el id: ${id}`
            });
        }

        await ItemOrden.destroy({ where: { id } });

        res.status(200).json({
            status: 200,
            message: `ItemOrden eliminada correctamente`,
            data: itemOrden
        });

    } catch (err) {

        res.status(500).json({
            status: 500,
            error: "Error al eliminar el itemOrden",
            message: err.message
        });
    }
}

const getItemsOrdenByIdPedido = async (req, res) => {
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

        const orden = await Orden.findByPk(id);

        if (!orden) {
            return res.status(404).json({
                status: 404,
                title: 'Not Found',
                message: `No existe el orden con el id: ${id}`
            });
        }

        const itemsOrden = await ItemOrden.findAll({
            where: {
                idOrden: id
            }
        })

        res.status(200).json({
            status: 200,
            message: 'Items obtenidos exitosamente',
            dataOrden: orden,
            data: itemsOrden.length === 0 ? "No hay items para esta orden" : itemsOrden
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: "Error al obtener el Items",
            message: err.message
        });
    }
}




export { getAllItemsOrden, getItemOrdenById, createItemOrden, updateItemOrden, deleteItemOrden, getItemsOrdenByIdPedido }