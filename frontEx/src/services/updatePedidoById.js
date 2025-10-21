import axios from "axios";

const updateOrdenByIdService = async (id, body) => {
    try {
        const respuesta = await axios.put(`http://localhost:3000/api/v1/ordenes/${id}`, body);
        return respuesta.data
    } catch (err) {
        throw new Error(err.message);
    }
}
export default updateOrdenByIdService;