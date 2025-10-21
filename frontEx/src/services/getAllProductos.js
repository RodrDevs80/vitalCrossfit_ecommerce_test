import axios from "axios";

const getAllProductos = async (params = {}) => {
    try {
        console.log('Solicitando productos con params:', params);
        const response = await axios.get('http://localhost:3000/api/v1/productos/all', {
            params: params,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('Respuesta recibida:', response.data); // ← Agrega esto
        return response.data;
    } catch (err) {
        console.error('Error en getAllProductos:', err.response?.data || err.message);
        throw new Error(err.message);
    }
};

export default getAllProductos;