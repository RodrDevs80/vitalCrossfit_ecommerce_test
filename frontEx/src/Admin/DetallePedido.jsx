import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Package,
  SunIcon,
  DollarSign,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import getItemServicio from "../services/getItemsByIdOrderService";
import NombreCliente from "../components/NombreCliente";
import NombreProducto from "../components/NombreProducto";
import TotalOrden from "../components/TotalOrden";

const DetallePedido = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    id: id,
    cliente: " ",
    direccionEnvio: " ",
    telefonoEnvio: " ",
    total: 0,
    detalles: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const productsPerPage = 10;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const { items, orden } = await getItemServicio(id);
        console.log(items, orden);
        const newListItemOrder = {
          id: orden.id,
          cliente: orden.idUsuario,
          direccionEnvio: orden.direccionEnvio,
          telefonoEnvio: orden.telefonoEnvio,
          detalles: items,
        };
        setTimeout(() => {
          setOrder(newListItemOrder);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);
  console.log(order);
  // Calcular productos paginados
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts =
    order?.detalles?.slice(indexOfFirstProduct, indexOfLastProduct) || [];
  const totalPages = Math.ceil(
    (order?.detalles?.length || 0) / productsPerPage
  );

  const handleBack = () => {
    navigate("/administrador/pedidos");
  };

  const getPaginationRange = () => {
    const range = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Orden no encontrada
          </h2>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Volver a pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a pedidos
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Detalle de Pedido.
              </h1>
              <h3>Numero de pedido N°{order.id}</h3>
              <p className="text-gray-600 mt-1">
                Información completa del pedido y productos
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del Cliente */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tarjeta Cliente */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Información del Cliente
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <NombreCliente idUsuario={order.cliente} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Teléfono</p>
                  <p className="text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-green-600" />
                    {order.telefonoEnvio}
                  </p>
                </div>
              </div>
            </div>

            {/* Tarjeta Dirección */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-red-600" />
                Dirección de Envío
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {order.direccionEnvio}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-red-600" />
                Costo total de pedido:
              </h2>
              <p className="text-gray-700 leading-relaxed">
                <TotalOrden idOrden={order.id} />
              </p>
            </div>
          </div>
          {/* Lista de Productos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-purple-600" />
                  Productos ({order.detalles.length})
                </h2>
              </div>

              {/* Tabla de Productos */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unit.
                      </th>
                      <th className="px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            <NombreProducto idProducto={product.idProducto} />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 text-center">
                            {product.cantidad}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 text-right">
                            ${product.precioUnitario}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 text-right">
                            $
                            {(
                              product.precioUnitario * product.cantidad
                            ).toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="bg-white px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Siguiente
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Mostrando{" "}
                          <span className="font-medium">
                            {indexOfFirstProduct + 1}
                          </span>{" "}
                          a{" "}
                          <span className="font-medium">
                            {Math.min(
                              indexOfLastProduct,
                              order.detalles.length
                            )}
                          </span>{" "}
                          de{" "}
                          <span className="font-medium">
                            {order.detalles.length}
                          </span>{" "}
                          productos
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          {getPaginationRange().map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                page === currentPage
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePedido;
