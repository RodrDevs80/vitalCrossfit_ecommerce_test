import getUserByIdService from "../services/getUserByIdService";

const getClienteNombreCompleto = async (id) => {
    try {
        const cliente = await getUserByIdService(id);
        let nombreCompleto = `${cliente.usuario.nombre} ${cliente.usuario.apellido}`;
        return nombreCompleto;
    } catch (err) {
        console.log(err.message);
    }
};

export default getClienteNombreCompleto;