import axios from "axios";

const getCateConsultaSimple = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/categorias/consulta/simple');
        return response.data.data;
    } catch (err) {
        throw new Error(err.message);
    }
};

export default getCateConsultaSimple;