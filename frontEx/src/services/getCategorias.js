import axios from "axios";

const getCategorias = async (params = {}) => {
    try {
        const response = await axios.get('http://localhost:3000/api/v1/categorias/all', {
            params: params
        });
        return response.data;
    } catch (err) {
        throw new Error(err.message);
    }
};

export default getCategorias;