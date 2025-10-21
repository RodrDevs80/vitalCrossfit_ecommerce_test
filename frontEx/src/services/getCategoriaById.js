import axios from "axios";

const getCategoriaById = async (id) => {
    try {
        const res = await axios.get(`http://localhost:3000/api/v1/categorias/${id}`);
        const data = res.data;
        return data.data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export default getCategoriaById;