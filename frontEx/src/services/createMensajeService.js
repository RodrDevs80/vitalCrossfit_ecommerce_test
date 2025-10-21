import axios from "axios";

const createMensajeService = async (body) => {
    try {
        const response = await axios.post(`http://localhost:3000/api/v1/mensajes`, body)
        return response.data
    } catch (err) {
        throw new Error(err.message);

    }

}

export default createMensajeService;