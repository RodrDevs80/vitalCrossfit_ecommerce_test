import getProductoById from "./getProductoById";

const getProductoNombreCompleto = async (id) => {
    try {
        const res = await getProductoById(id)
        //console.log(res.nombre);
        return res.nombre;
    } catch (err) {
        throw new Error(err.message);
    }
}

export default getProductoNombreCompleto;