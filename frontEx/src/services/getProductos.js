import axios from "axios";

const getProductos = async () => {
    try {
        const res = await axios.get("http://localhost:3000/api/v1/productos/activos");
        const data = res.data
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
export default getProductos;