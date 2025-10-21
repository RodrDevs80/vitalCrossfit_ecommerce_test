import axios from "axios";

const createItemOrdenService = async (body) => {
    try {
        const response = await axios.post(`http://localhost:3000/api/v1/itemsOrden`, body)
        //console.log(response.data)
        return response.data;
    } catch (err) {
        throw new Error(err.message);

    }
}

export default createItemOrdenService;