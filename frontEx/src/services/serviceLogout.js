import { toast } from "react-toastify";

export const logoutAdmin = () => {
    localStorage.removeItem('passAdmin');
    toast(`Hasta la proxima!!!👋`);

}

export const logoutCliente = () => {
    localStorage.removeItem('passCliente');
    toast(`Hasta la proxima!!!👋`);

}