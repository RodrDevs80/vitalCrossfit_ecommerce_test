import axios from "axios";

const createCarritoService = async (body) => {
    try {
        const response = await axios.post(`http://localhost:3000/api/v1/carritos`, body)
        //console.log(response.data)
        return response.data;
    } catch (err) {
        throw new Error(err.message);

    }
}

export default createCarritoService;