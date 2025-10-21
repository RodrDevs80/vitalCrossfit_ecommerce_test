import axios from "axios";

const getAllMensajesByProductoId = async (idProducto) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/mensajes/${idProducto}`)
        return response.data
    } catch (err) {
        throw new Error(err.message);

    }

}

export default getAllMensajesByProductoId;