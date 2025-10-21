import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Calendar,
  User,
  MapPin,
  Phone,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import getAllOrdenesSimple from "../services/getAllOrdenesSimple";
import createOrdenService from "../services/createOrdenService";
import Swal from "sweetalert2";
import NombreCliente from "../components/NombreCliente";
import eliminarAlert from "../services/alertaDeEliminacion";
import deletePedido from "../services/deletePedido";
import updateOrdenByIdService from "../services/updatePedidoById";
import { useNavigate } from "react-router-dom";
import TotalOrden from "../components/TotalOrden";

const AdminPedidos = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create, edit
  const [_, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    cliente: "",
    fechaOrden: "",
    estado: "pendiente",
    direccionEnvio: "",
    telefonoEnvio: "",
    detalles: [],
  });

  const estados = [
    {
      value: "pendiente",
      label: "Pendiente",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "confirmada",
      label: "Confirmada",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "enviada",
      label: "Enviada",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "cancelada",
      label: "Cancelada",
      color: "bg-red-100 text-red-800",
    },
  ];

  const ordersPerPage = 10;
  const getOrders = () => {
    getAllOrdenesSimple()
      .then((res) => {
        setOrders(res.data);
        setFilteredOrders(res.data);
      })
      .catch((err) => console.log(err.message));
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (!Array.isArray(orders)) {
      setFilteredOrders([]);
      return;
    }

    let filtered = orders.filter((order) => {
      const matchesStatus =
        filterStatus === "" || order.estado === filterStatus;

      return matchesStatus;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterStatus, orders]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const openModal = (mode, order = null) => {
    setModalMode(mode);
    setSelectedOrder(order);

    if (mode === "create") {
      setFormData({
        id: null,
        cliente: "",
        fechaOrden: new Date().toISOString().split("T")[0],
        estado: "pendiente",
        direccionEnvio: "",
        telefonoEnvio: "",
        detalles: [],
      });
    } else if (order) {
      setFormData({
        ...order,
        fechaOrden: new Date().toISOString().split("T")[0],
        cliente: order.idUsuario,
        estado: order.estado || "pendiente",
        direccionEnvio: order.direccionEnvio || "",
        telefonoEnvio: order.telefonoEnvio || "",
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
    setFormData({
      id: null,
      cliente: "",
      fechaOrden: "",
      estado: "pendiente",
      direccionEnvio: "",
      telefonoEnvio: "",
      detalles: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalMode === "create") {
      const newOrden = {
        idUsuario: Number(formData.cliente),
        estado: formData.estado,
        direccionEnvio: formData.direccionEnvio,
        telefonoEnvio: formData.telefonoEnvio,
      };
      console.log(newOrden);
      createOrdenService(newOrden)
        .then((res) => {
          console.log(res.data);
          getOrders();
        })
        .catch((err) => {
          if (err.message) {
            Swal.fire({
              title: "Error!",
              text: err.message,
              icon: "error",
              closeButtonHtml: true,
            });
          }
        });
    } else if (modalMode === "edit") {
      const updateOrden = {
        idUsuario: formData.cliente,
        estado: formData.estado,
        direccionEnvio: formData.direccionEnvio,
        telefonoEnvio: formData.telefonoEnvio,
      };
      console.log("Actualizando orden:", updateOrden);
      updateOrdenByIdService(formData.id, updateOrden)
        .then((res) => {
          console.log(res.data);
          getOrders();
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: err.message || "Error al actualizar la orden",
            icon: "error",
            confirmButtonText: "Ok",
          });
        });
    }

    closeModal();
  };

  const handleDelete = async (id) => {
    try {
      const confirmado = await eliminarAlert();
      if (confirmado) {
        deletePedido(id)
          .then((res) => {
            console.log(res);
            getOrders();
          })
          .catch((err) => {
            Swal.fire({
              title: "Error!",
              text: err.message || "Error al procesar la solicitud",
              icon: "error",
              confirmButtonText: "Ok",
            });
          });
        Swal.fire({
          title: "Eliminado!",
          text: "El pedido ha sido eliminado",
          icon: "success",
          confirmButtonText: "Ok",
        });
      }
    } catch (err) {
      console.log(err.message);
      Swal.fire({
        title: "Error!",
        text: "Error al eliminar el pedido",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
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

  const getEstadoStyle = (estado) => {
    const estadoObj = estados.find((e) => e.value === estado);
    return estadoObj ? estadoObj.color : "bg-gray-100 text-gray-800";
  };

  const getEstadoLabel = (estado) => {
    const estadoObj = estados.find((e) => e.value === estado);
    return estadoObj ? estadoObj.label : estado;
  };
  const navigate = useNavigate();
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Pedidos
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Administra y realiza seguimiento de las órdenes de compra
              </p>
            </div>
            <button
              onClick={() => openModal("create")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Pedido
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente o dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              {estados.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-2 whitespace-nowrap text-center text-sm text-gray-500">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <NombreCliente idUsuario={order.idUsuario} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.fechaOrden).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoStyle(
                          order.estado
                        )}`}
                      >
                        {getEstadoLabel(order.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate text-right">
                      <TotalOrden idOrden={order.id} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/administrador/pedidos/detalles/${order.id}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openModal("edit", order)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="Editar"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
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
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
                        {indexOfFirstOrder + 1}
                      </span>{" "}
                      a{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastOrder, filteredOrders.length)}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium">
                        {filteredOrders.length}
                      </span>{" "}
                      pedidos
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === "create" ? "Crear Pedido" : "Editar Pedido"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="h-4 w-4 inline mr-1" />
                      Cliente
                    </label>
                    <input
                      type="text"
                      name="cliente"
                      value={formData.cliente}
                      onChange={handleInputChange}
                      required
                      disabled={modalMode === "edit"} // Deshabilitado en modo edición
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        modalMode === "edit"
                          ? "bg-gray-100 cursor-not-allowed"
                          : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Fecha Orden
                    </label>
                    <input
                      disabled={true} // Siempre deshabilitado en ambos modos
                      type="date"
                      name="fechaOrden"
                      value={formData.fechaOrden || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={formData.estado || "pendiente"}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {estados.map((estado) => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Teléfono
                    </label>
                    <input
                      type="text"
                      name="telefonoEnvio"
                      value={formData.telefonoEnvio || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Dirección de Envío
                  </label>
                  <textarea
                    name="direccionEnvio"
                    value={formData.direccionEnvio || ""}
                    onChange={handleInputChange}
                    rows="2"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {modalMode === "create"
                      ? "Crear Pedido"
                      : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPedidos;
