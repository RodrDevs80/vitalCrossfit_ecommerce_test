import axios from "axios";

const getProductosConsultaSimple = async () => {
    try {
        const respuesta = await axios.get('http://localhost:5173/api/v1/productos/consulta/simple');
        return respuesta.data.data

    } catch (err) {
        throw new Error(err.message)

    }
}

export default getProductosConsultaSimple;