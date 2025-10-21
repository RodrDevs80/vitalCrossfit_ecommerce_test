import axios from "axios";

const getItemsCarritoByIdCarritoSer = async (idCarrito) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/itemsCarrito/all/itemsByCarrito/${idCarrito}`)
        //console.log(response.data)
        return response.data;
    } catch (err) {
        throw new Error(err.message);

    }
}

export default getItemsCarritoByIdCarritoSer;