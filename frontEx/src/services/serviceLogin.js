import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { toast } from "react-toastify";

const headers = {
    "Content-Type": "application/json"
}
const serviceLogin = async (apiUrl, email, contrasena, location) => {

    try {

        const res = await axios.post(apiUrl, {
            email,
            contrasena
        }, headers);
        const data = res.data;
        const { accessToken, refreshToken } = data.data;
        const decoded = jwtDecode(accessToken);
        const typeRol = decoded.type;
        const id = decoded.id
        console.log(location)
        console.log(typeRol)
        console.log(id)

        if (location.includes("/administrador") && typeRol === "administrador" || location.includes("/login") && typeRol === "usuario") {
            if (decoded.type === "administrador") {
                localStorage.setItem('passAdmin', JSON.stringify({ accessToken, refreshToken, typeRol, id }))
                toast(`Bienvenido ${typeRol}`)
            }
            if (decoded.type === "usuario") {
                localStorage.setItem('passCliente', JSON.stringify({ accessToken, refreshToken, typeRol, id }))
                toast(`Bienvenido ${typeRol}`)
            }

            return { accessToken, refreshToken, typeRol, id }
        } else {
            return "pagina equivocada";
        }


    } catch (err) {
        throw new Error(err.message);
    }

}

export default serviceLogin;