import axios from "axios";

const deleteItemsCarritoSer = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:3000/api/v1/itemsCarrito/${id}`)
        //console.log(response.data)
        return response.data;
    } catch (err) {
        throw new Error(err.message);

    }
}

export default deleteItemsCarritoSer;