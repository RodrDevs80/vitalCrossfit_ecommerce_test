import axios from "axios";

const getUserByIdLibre = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/usuarios/consultaSimple/${id}`)
        //console.log(response.data)
        return response.data;
    } catch (err) {
        throw new Error(err.message);

    }
}

export default getUserByIdLibre;