import { useState, useEffect } from "react";
import getProductoNombreCompleto from "../services/getProductoNombreCompletoServ";

const NombreProducto = ({ idProducto }) => {
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const nombreCompleto = await getProductoNombreCompleto(idProducto);
        console.log(nombreCompleto);
        setNombre(nombreCompleto);
      } catch (error) {
        setNombre("Error al cargar");
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

  return <div className="text-sm font-medium text-gray-900">{nombre}</div>;
};

export default NombreProducto;
