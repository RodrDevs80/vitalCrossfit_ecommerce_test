import { useState, useEffect } from "react";
import getClienteNombreCompleto from "../util/getNombreCompletoUser";

const NombreCliente = ({ idUsuario }) => {
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const nombreCompleto = await getClienteNombreCompleto(idUsuario);
        setNombre(nombreCompleto);
      } catch (error) {
        setNombre("Error al cargar");
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    cargarCliente();
  }, [idUsuario]);

  if (cargando) {
    return <span className="text-gray-400">Cargando...</span>;
  }

  return <div className="text-sm font-medium text-gray-900">{nombre}</div>;
};

export default NombreCliente;
