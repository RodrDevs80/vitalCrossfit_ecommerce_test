import { ToastContainer, toast } from "react-toastify";

export const Notificacion = () => {
  const notify = () => toast("hola");

  return (
    <div>
      <button onClick={notify}>Notify!</button>
      <ToastContainer />
    </div>
  );
};
