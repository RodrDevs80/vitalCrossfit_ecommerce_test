import axios from "axios";

const updateUsuarioService = async (id, body) => {
    try {

        const tokenString = localStorage.getItem('passAdmin');

        if (!tokenString) {
            throw new Error("No se encontró token de autenticación");
        }

        const tokenData = JSON.parse(tokenString);


        if (!tokenData.accessToken) {
            throw new Error("El token no contiene la propiedad accessToken");
        }

        const respuesta = await axios.put(`http://localhost:3000/api/v1/usuarios/${id}`, body, {
            headers: {
                'Authorization': `Bearer ${tokenData.accessToken}`
            }
        });
        console.log(respuesta.data)
        return respuesta.data;
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            throw new Error(err.response.data.message);
        } else if (err.message) {
            throw new Error(err.message);
        } else {
            throw new Error("Error desconocido al intentar actualizar el usuario");
        }
    }
}

export default updateUsuarioService;