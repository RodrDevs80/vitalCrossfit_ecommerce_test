import { useState, useEffect } from "react";
import getItemPrecioTotalServicio from "../services/getItemPrecioTotalServicio";

const TotalOrden = ({ idOrden }) => {
  const [precioTotal, setPrecioTotal] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPrecioTotal = async () => {
      try {
        const precioTotal = await getItemPrecioTotalServicio(idOrden);
        setPrecioTotal(precioTotal);
      } catch (error) {
        setPrecioTotal("Error al cargar");
        console.error(error);
      } finally {
        setCargando(false);
      }
    };

    cargarPrecioTotal();
  }, [idOrden]);

  if (cargando) {
    return <span className="text-gray-400">Cargando...</span>;
  }

  return (
    <div className="text-sm font-medium text-gray-900">
      ${Number(precioTotal).toFixed(2)}
    </div>
  );
};

export default TotalOrden;
