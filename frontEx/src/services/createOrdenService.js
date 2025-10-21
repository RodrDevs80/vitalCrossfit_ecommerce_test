import axios from "axios";

const createOrdenService = async (body) => {
    try {
        const respuesta = await axios.post('http://localhost:3000/api/v1/ordenes', body);
        return respuesta.data
    } catch (err) {
        throw new Error(err.message);

    }

}
export default createOrdenService;