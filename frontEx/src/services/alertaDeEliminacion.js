import Swal from "sweetalert2";

const eliminarAlert = async (instacia) => {
    const resultado = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Estás seguro de que quieres eliminar este ${instacia}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, bórralo!!",
        cancelButtonText: "No, cancela",
        reverseButtons: true,
    });
    return resultado.isConfirmed;
};


export default eliminarAlert;