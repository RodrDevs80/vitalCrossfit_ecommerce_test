import axios from "axios";

const getCarritoByIdUserSer = async (idUsuario) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/carritos/byUsuario/${idUsuario}`)
        //console.log(response.data)
        return response.data;
    } catch (err) {
        throw new Error(err.message);

    }
}

export default getCarritoByIdUserSer;