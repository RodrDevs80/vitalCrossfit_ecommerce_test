import axios from "axios";

const updateItemsCarrito = async (id, body) => {
    try {
        const response = await axios.put(`http://localhost:3000/api/v1/itemsCarrito/${id}`, body)
        //console.log(response.data)
        return response.data;
    } catch (err) {
        throw new Error(err.message);

    }
}

export default updateItemsCarrito;