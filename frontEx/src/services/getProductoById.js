import axios from "axios";

const getProductoById = async (id) => {
    try {
        const res = await axios.get(`http://localhost:3000/api/v1/productos/${id}`);
        const data = res.data;
        if (!data) {
            return null
        }
        const { Producto } = data
        return Producto;
    } catch (err) {
        throw new Error(err.message);

    }
}

export default getProductoById;