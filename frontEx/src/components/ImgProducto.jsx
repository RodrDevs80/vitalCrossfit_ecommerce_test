import { useEffect, useState } from "react";
import getProductoById from "../services/getProductoById";

const ImgProducto = ({ idProducto }) => {
  const [urlImg, setUrlImg] = useState("");
  const [cargando, setCargando] = useState(true);
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const producto = await getProductoById(idProducto);
        //console.log(producto);
        setUrlImg(producto.imagenUrl);
        setNombre(producto.nombre);
      } catch (error) {
        setUrlImg("Error al cargar");
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    cargarProducto();
  }, [idProducto]);

  if (cargando) {
    return <span className="text-gray-400">Cargando...</span>;
  }

  return (
    <img
      src={urlImg}
      alt={nombre}
      className="w-20 h-20 object-cover rounded-lg"
    />
  );
};

export default ImgProducto;
