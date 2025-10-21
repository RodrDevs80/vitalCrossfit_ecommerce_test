import getAllUsuarios from "./getAllUsuarios";
import getCateConsultaSimple from "./getCateConsultaSimple";
import getCuponesActivos from "./getCuponesActivos";
import getOrdenes from "./getOrdenes";
import getProductosConsultaSimple from "./getProductosConsultaSimple";
import Swal from 'sweetalert2'


const fechDashboard = (setEstadoPro, setEstabaCate, setEstadoCupones, setEstadoUsuarios, setEstadoPedidos) => {

    getProductosConsultaSimple()
        .then((res) => setEstadoPro(res.length))
        .catch((err) => console.log(err.message));

    getCateConsultaSimple()
        .then((res) => setEstabaCate(res.length))
        .catch((err) => console.log(err.message));

    getCuponesActivos()
        .then((res) => setEstadoCupones(res.length))
        .catch((err) => console.log(err.message));

    getAllUsuarios()
        .then((res) => setEstadoUsuarios(res.length))
        .catch((err) => {
            if (err.message === "Token expirado") {
                Swal.fire({
                    title: 'Cerrando sesión!',
                    text: 'Token expirado',
                    icon: 'info',
                    confirmButtonText: 'Ok'
                })
                setEstadoUsuarios(null);
            }
        });

    getOrdenes()
        .then((res) => setEstadoPedidos(res.total))
        .catch((err) => console.log(err.message));

}

export default fechDashboard;