import axios from "axios";

const getItemPrecioTotalServicio = async (id) => {
    let precioTotal = 0;
    try {
        const res = await axios.get(`http://localhost:3000/api/v1/itemsOrden/detalles/${id}`);
        const items = res.data.data
        console.log(res.data.data);

        if (items === "No hay items para esta orden") {
            return precioTotal;
        }
        items.forEach(item => {
            precioTotal += item.cantidad * item.precioUnitario;
        });

        return precioTotal;
    } catch (err) {
        throw new Error(err.message);
    }
}

export default getItemPrecioTotalServicio;