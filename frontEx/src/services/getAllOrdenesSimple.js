import axios from "axios";

const getAllOrdenesSimple = async () => {
    try {
        const respuesta = await axios.get('http://localhost:3000/api/v1/ordenes');
        return respuesta.data
    } catch (err) {
        throw new Error(err.message);

    }
}

export default getAllOrdenesSimple;