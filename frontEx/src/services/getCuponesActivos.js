import axios from "axios";

const getCuponesActivos = async () => {
    try {
        const respuesta = await axios.get('http://localhost:5173/api/v1/cupones/activos');
        return respuesta.data.data;
    } catch (err) {
        throw new Error(err.message);

    }

}

export default getCuponesActivos;