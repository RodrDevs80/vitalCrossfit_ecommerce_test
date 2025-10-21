import axios from "axios";

const getItemServicio = async (id) => {
    try {
        const res = await axios.get(`http://localhost:3000/api/v1/itemsOrden/detalles/${id}`);
        const items = res.data.data
        const orden = res.data.dataOrden
        //console.log(res.data.data);

        if (items === "No hay items para esta orden") {
            return "sin Items";
        }

        return { items, orden };
    } catch (err) {
        throw new Error(err.message);
    }
}

export default getItemServicio;