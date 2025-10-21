import axios from "axios";

const createUsuarioService = async (body) => {
    try {
        const respuesta = await axios.post('http://localhost:3000/api/v1/usuarios', body);
        console.log(respuesta.data)
        return respuesta.data;
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            throw new Error(err.response.data.message);
        } else if (err.message) {
            throw new Error(err.message);
        } else {
            throw new Error("Error desconocido al intentar crear un usuario");
        }
    }
}

export default createUsuarioService;