import axios from "axios";

const deletePedido = async (id) => {
    try {
        const respuesta = await axios.delete(`http://localhost:3000/api/v1/ordenes/${id}`);
        return respuesta.data
    } catch (err) {
        throw new Error(err.message);
    }
}
export default deletePedido;