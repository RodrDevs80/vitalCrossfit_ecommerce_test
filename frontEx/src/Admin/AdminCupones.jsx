import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  Percent,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  RefreshCw,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import axios from "axios";
import getCateConsultaSimple from "../services/getCateConsultaSimple";

//sacar de aqui
const API_BASE_URL = "http://localhost:5173/api/v1/cupones";

const AdminCupones = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [sampleProducts, setSampleProduct] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    porcentajeDescuento: "",
    activo: true,
    idProducto: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [sorting, setSorting] = useState({
    orderBy: "fechaActualizacion",
    orderDirection: "DESC",
  });

  // Datos de ejemplo para productos (deberías obtenerlos de tu API)
  const fetchProducts = () => {
    getCateConsultaSimple()
      .then((res) => setSampleProduct(res))
      .catch((err) => console.log(err.message));
  };
  // Función para obtener todos los cupones
  const fetchCoupons = async (page = 1, search = "", status = "") => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}?page=${page}&orderBy=${sorting.orderBy}&orderDirection=${sorting.orderDirection}`;

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setCoupons(data.data.cupones);
        setFilteredCoupons(data.data.cupones);
        setPaginationInfo(data.data.pagination);

        // Si hay filtro de estado, aplicarlo
        if (status !== "") {
          const filtered = data.data.cupones.filter((coupon) =>
            status === "Activo" ? coupon.activo : !coupon.activo
          );
          setFilteredCoupons(filtered);
        }
      } else {
        throw new Error(data.message || "Error al obtener los cupones");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar cupones al montar el componente
  useEffect(() => {
    fetchCoupons(currentPage, searchTerm, filterStatus);
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sorting]);

  // Filtrar cupones localmente para búsquedas rápidas
  useEffect(() => {
    let filtered = coupons.filter((coupon) => {
      const matchesSearch =
        coupon.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "" ||
        (filterStatus === "Activo" ? coupon.activo : !coupon.activo);

      return matchesSearch && matchesStatus;
    });

    setFilteredCoupons(filtered);
  }, [searchTerm, filterStatus, coupons]);

  // Función para crear un cupón
  const createCoupon = async (couponData) => {
    try {
      const response = await axios.post(API_BASE_URL, couponData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        throw new Error(err.response.data.message || "Error al crear el cupón");
      } else {
        throw new Error("Error de conexión al crear el cupón");
      }
    }
  };

  // Función para actualizar un cupón
  const updateCoupon = async (id, couponData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, couponData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        throw new Error(
          err.response.data.message || "Error al actualizar el cupón"
        );
      } else {
        throw new Error("Error de conexión al actualizar el cupón");
      }
    }
  };

  // Función para eliminar un cupón (físicamente)
  const deleteCoupon = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);

      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        throw new Error(
          err.response.data.message || "Error al eliminar el cupón"
        );
      } else {
        throw new Error("Error de conexión al eliminar el cupón");
      }
    }
  };

  // Función para desactivar/activar un cupón (eliminación lógica)
  const toggleCouponStatus = async (id) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}`);

      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        throw new Error(
          err.response.data.message || "Error al cambiar el estado del cupón"
        );
      } else {
        throw new Error("Error de conexión al cambiar el estado del cupón");
      }
    }
  };

  const openModal = (mode, coupon = null) => {
    setModalMode(mode);
    setSelectedCoupon(coupon);

    if (mode === "create") {
      setFormData({
        nombre: "",
        codigo: "",
        porcentajeDescuento: "",
        activo: true,
        idProducto: "",
      });
    } else if (coupon) {
      setFormData({
        nombre: coupon.nombre,
        codigo: coupon.codigo,
        porcentajeDescuento: coupon.porcentajeDescuento,
        activo: coupon.activo,
        idProducto: coupon.idProducto || "",
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCoupon(null);
    setFormData({
      nombre: "",
      codigo: "",
      porcentajeDescuento: "",
      activo: true,
      idProducto: "",
    });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "porcentajeDescuento"
          ? parseFloat(value) || 0
          : name === "activo"
          ? value === "true"
          : name === "idProducto"
          ? value === ""
            ? null
            : parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (modalMode === "create") {
        await createCoupon(formData);
      } else if (modalMode === "edit") {
        await updateCoupon(selectedCoupon.id, formData);
      }

      // Recargar la lista de cupones
      fetchCoupons(currentPage, searchTerm, filterStatus);
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este cupón?")) {
      try {
        await deleteCoupon(id);
        fetchCoupons(currentPage, searchTerm, filterStatus);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres ${
          currentStatus ? "desactivar" : "activar"
        } este cupón?`
      )
    ) {
      try {
        await toggleCouponStatus(id);
        fetchCoupons(currentPage, searchTerm, filterStatus);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSort = (field) => {
    const newOrderDirection =
      sorting.orderBy === field && sorting.orderDirection === "ASC"
        ? "DESC"
        : "ASC";

    setSorting({
      orderBy: field,
      orderDirection: newOrderDirection,
    });
  };

  const getProductName = (id) => {
    const product = sampleProducts.find((p) => p.id === id);
    return product ? product.nombre : "Producto no encontrado";
  };

  const getPaginationRange = () => {
    const range = [];
    const showPages = 5;
    let start = Math.max(
      1,
      paginationInfo.currentPage - Math.floor(showPages / 2)
    );
    let end = Math.min(paginationInfo.totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-AR");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Cupones
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Administra los cupones de descuento de tu tienda
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  fetchCoupons(currentPage, searchTerm, filterStatus)
                }
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                <RefreshCw
                  className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Actualizar
              </button>
              <button
                onClick={() => openModal("create")}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                <Plus className="h-5 w-5 mr-2" />
                Nuevo Cupón
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cupones por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Desactivado">Desactivado</option>
            </select>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2">Cargando cupones...</span>
          </div>
        )}

        {/* Coupons Grid */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("nombre")}
                    >
                      Nombre{" "}
                      {sorting.orderBy === "nombre" &&
                        (sorting.orderDirection === "ASC" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("codigo")}
                    >
                      Código{" "}
                      {sorting.orderBy === "codigo" &&
                        (sorting.orderDirection === "ASC" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("porcentajeDescuento")}
                    >
                      Descuento{" "}
                      {sorting.orderBy === "porcentajeDescuento" &&
                        (sorting.orderDirection === "ASC" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("activo")}
                    >
                      Estado{" "}
                      {sorting.orderBy === "activo" &&
                        (sorting.orderDirection === "ASC" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("fechaCreacion")}
                    >
                      Fecha Creación{" "}
                      {sorting.orderBy === "fechaCreacion" &&
                        (sorting.orderDirection === "ASC" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("fechaActualizacion")}
                    >
                      Fecha Modificación{" "}
                      {sorting.orderBy === "fechaActualizacion" &&
                        (sorting.orderDirection === "ASC" ? "↑" : "↓")}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCoupons.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No se encontraron cupones
                      </td>
                    </tr>
                  ) : (
                    filteredCoupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {coupon.nombre}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {coupon.codigo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex justify-end">
                            {coupon.porcentajeDescuento}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getProductName(coupon.idProducto)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              coupon.activo
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {coupon.activo ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {coupon.activo ? "Activo" : "Desactivado"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                            {formatDate(coupon.fechaCreacion)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                            {formatDate(coupon.fechaActualizacion)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openModal("edit", coupon)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="Editar"
                              disabled={loading}
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleStatus(coupon.id, coupon.activo)
                              }
                              className={`p-1 rounded hover:bg-gray-50 ${
                                coupon.activo
                                  ? "text-yellow-600 hover:text-yellow-800"
                                  : "text-green-600 hover:text-green-800"
                              }`}
                              title={coupon.activo ? "Desactivar" : "Activar"}
                              disabled={loading}
                            >
                              {coupon.activo ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(coupon.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              title="Eliminar"
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {paginationInfo.totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1 || loading}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, paginationInfo.totalPages)
                        )
                      }
                      disabled={
                        currentPage === paginationInfo.totalPages || loading
                      }
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
                          {(paginationInfo.currentPage - 1) *
                            paginationInfo.itemsPerPage +
                            1}
                        </span>{" "}
                        a{" "}
                        <span className="font-medium">
                          {Math.min(
                            paginationInfo.currentPage *
                              paginationInfo.itemsPerPage,
                            paginationInfo.totalItems
                          )}
                        </span>{" "}
                        de{" "}
                        <span className="font-medium">
                          {paginationInfo.totalItems}
                        </span>{" "}
                        cupones
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1 || loading}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        {getPaginationRange().map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            disabled={loading}
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
                              Math.min(prev + 1, paginationInfo.totalPages)
                            )
                          }
                          disabled={
                            currentPage === paginationInfo.totalPages || loading
                          }
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
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === "create" ? "Crear Cupón" : "Editar Cupón"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Tag className="h-4 w-4 inline mr-1" />
                      Nombre del Cupón
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Código
                    </label>
                    <input
                      type="text"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                      placeholder="EJ: DESCUENTO20"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Percent className="h-4 w-4 inline mr-1" />
                      Descuento (%)
                    </label>
                    <input
                      type="number"
                      name="porcentajeDescuento"
                      value={formData.porcentajeDescuento}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      name="activo"
                      value={formData.activo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value={true}>Activo</option>
                      <option value={false}>Desactivado</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Package className="h-4 w-4 inline mr-1" />
                      Producto Aplicable
                    </label>
                    <select
                      name="idProducto"
                      value={formData.idProducto || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">Todos los productos</option>
                      {sampleProducts.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.nombre}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Dejar vacío para aplicar a todos los productos
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {modalMode === "create" ? "Crear Cupón" : "Guardar Cambios"}
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

export default AdminCupones;
