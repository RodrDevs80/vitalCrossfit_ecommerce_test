import axios from "axios";

const getItemsCarritoSer = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/itemsCarrito`)
        //console.log(response.data)
        return response.data;
    } catch (err) {
        throw new Error(err.message);

    }
}

export default getItemsCarritoSer;