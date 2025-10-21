import "../css/botonFlotante.css";

export const BotonFlotante = () => {
  return (
    <a
      href="https://wa.me/12345678900?text=Hola"
      className="float-wa hover:scale-110 transition-all"
      target="_blank"
    >
      <i className="fa fa-whatsapp mt-4"></i>
    </a>
  );
};
