import Swal from "sweetalert2";

const swalServiceConfirmed = async (titulo, texto, icono, btnConfirm, btnCancel) => {
    const resultado = await Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        showCancelButton: true,
        confirmButtonText: btnConfirm,
        cancelButtonText: btnCancel,
        reverseButtons: true,
    });
    return resultado.isConfirmed;
};


export default swalServiceConfirmed;