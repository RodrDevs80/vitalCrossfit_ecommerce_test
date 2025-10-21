import axios from "axios";



const getImgGaleriaByIdProd = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/v1/files/imagenes-db/${id}`);
        //http://localhost:3000/api/v1/files/image/20/
        const imagenesUrls = response.data.images.map((item) => `http://localhost:3000/api/v1/files/image/${id}/${item.filename}`);

        return imagenesUrls;
    } catch (err) {
        throw new Error(err.message);

    }
}

export default getImgGaleriaByIdProd;