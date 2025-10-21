import Swal from "sweetalert2";

const SwAlertaComp = (titulo, texto, icono) => {
    return Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        confirmButtonText: "Ok",
    });
};

export default SwAlertaComp;