/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Calendar,
  Package,
  Tag,
  DollarSign,
  ImageIcon,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Upload,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import getAllProductos from "../services/getAllProductos";
import axios from "axios";
import eliminarAlert from "../services/alertaDeEliminacion";
import getCateConsultaSimple from "../services/getCateConsultaSimple";

const AdminProductos = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderBy, setOrderBy] = useState("fechaActualizacion");
  const [orderDirection, setOrderDirection] = useState("DESC");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: null,
    especificaciones: "",
    idCategoria: "",
    activo: true,
    oferta: false,
    descuento: 0,
  });

  const productsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    fetchCategorias();
  }, [currentPage, searchTerm, filterCategory, orderBy, orderDirection]);

  const fetchProducts = () => {
    setIsLoading(true);

    const params = {
      page: currentPage,
      limit: productsPerPage,
      orderBy,
      orderDirection,
    };

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (filterCategory) {
      params.idCategoria = filterCategory;
    }

    getAllProductos(params)
      .then((res) => {
        if (res.success) {
          setProducts(res.data.products);
          setTotalPages(res.data.pagination.totalPages);
          setTotalItems(res.data.pagination.totalItems);
        } else {
          setProducts([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      })
      .catch((err) => {
        console.log(err.message);
        setProducts([]);
        setTotalPages(1);
        setTotalItems(0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchCategorias = () => {
    getCateConsultaSimple()
      .then((res) => setCategorias(res))
      .catch((err) => console.log(err.message));
  };
  const handleSort = (field) => {
    if (orderBy === field) {
      // Cambiar dirección si es el mismo campo
      setOrderDirection(orderDirection === "ASC" ? "DESC" : "ASC");
    } else {
      // Nuevo campo, ordenar DESC por defecto
      setOrderBy(field);
      setOrderDirection("DESC");
    }
    setCurrentPage(1); // Resetear a primera página al cambiar orden
  };

  const handleSearch = () => {
    setCurrentPage(1); // Resetear a primera página al buscar
    fetchProducts();
  };

  const handleFilterCategory = (categoryId) => {
    setFilterCategory(categoryId);
    setCurrentPage(1); // Resetear a primera página al filtrar
  };

  const openModal = (mode, product = null) => {
    setModalMode(mode);
    setSelectedProduct(product);

    if (mode === "create") {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: null,
        especificaciones: "",
        idCategoria: "",
        activo: true,
        oferta: false,
        descuento: 0,
      });
    } else if (product) {
      console.log(product);
      setFormData({
        ...product,
        id: product.id,
        idCategoria: product.idCategoria.toString(),
        imagen: null,
        activo: product.activo === true || product.activo === "true",
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: null,
      especificaciones: "",
      idCategoria: "",
      activo: true,
      oferta: false,
      descuento: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      imagen: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();

    data.append("nombre", formData.nombre);
    data.append("descripcion", formData.descripcion);
    data.append("precio", formData.precio.toString());
    data.append("especificaciones", formData.especificaciones);
    data.append("idCategoria", formData.idCategoria.toString());
    data.append("activo", formData.activo.toString());
    data.append("oferta", formData.oferta.toString());
    data.append("descuento", formData.descuento.toString());

    if (modalMode === "edit") {
      data.append("id", formData.id.toString());
    }

    if (formData.imagen) {
      data.append("portada", formData.imagen);
    }

    try {
      if (modalMode === "create") {
        await axios.post("http://localhost:3000/api/v1/productos", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.put(
          `http://localhost:3000/api/v1/productos/${formData.id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      fetchProducts();
      closeModal();
    } catch (err) {
      console.error("Error completo:", err.response?.data || err.message);
      alert("Error al guardar. Verifica la consola para más detalles.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmado = await eliminarAlert("producto");
    if (confirmado) {
      try {
        await axios.delete(`http://localhost:3000/api/v1/productos/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Error al eliminar el producto:", err.message);
        alert("Error al eliminar el producto. Por favor, intenta nuevamente.");
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
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

  const SortableHeader = ({ field, children }) => (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center">
        {children}
        {orderBy === field &&
          (orderDirection === "ASC" ? (
            <ArrowUp className="h-3 w-3 ml-1" />
          ) : (
            <ArrowDown className="h-3 w-3 ml-1" />
          ))}
        {orderBy !== field && (
          <ArrowUpDown className="h-3 w-3 ml-1 text-gray-400" />
        )}
      </div>
    </th>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Productos
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Total: {totalItems} productos
              </p>
            </div>
            <button
              onClick={() => openModal("create")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Producto
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => handleFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando productos...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <SortableHeader field="nombre">Producto</SortableHeader>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <SortableHeader field="precio">Precio</SortableHeader>
                      <SortableHeader field="activo">Estado</SortableHeader>
                      <SortableHeader field="fechaActualizacion">
                        Fecha Modificación
                      </SortableHeader>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={
                                product.imagenUrl || "/placeholder-image.jpg"
                              }
                              alt={product.nombre}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.nombre}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {product.descripcion}
                              </div>
                              {product.oferta && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  {product.descuento}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {categorias.find(
                              (categoria) => categoria.id == product.idCategoria
                            )?.nombre || "Sin categoría"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {formatPrice(product.precio)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.activo
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.activo ? (
                              <Eye className="h-3 w-3 mr-1" />
                            ) : (
                              <EyeOff className="h-3 w-3 mr-1" />
                            )}
                            {product.activo ? "Activo" : "Desactivado"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(
                            product.fechaActualizacion
                          ).toLocaleDateString("es-AR")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openModal("edit", product)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="Editar"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
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
                            {(currentPage - 1) * productsPerPage + 1}
                          </span>{" "}
                          a{" "}
                          <span className="font-medium">
                            {Math.min(
                              currentPage * productsPerPage,
                              totalItems
                            )}
                          </span>{" "}
                          de <span className="font-medium">{totalItems}</span>{" "}
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
            </>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === "create"
                    ? "Crear Producto"
                    : "Editar Producto"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                encType="multipart/form-data"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Package className="h-4 w-4 inline mr-1" />
                      Nombre del Producto
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Tag className="h-4 w-4 inline mr-1" />
                      Categoría
                    </label>
                    <select
                      name="idCategoria"
                      value={formData.idCategoria}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                      <DollarSign className="h-4 w-4 inline mr-1" />
                      Precio
                    </label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    >
                      <option value={true}>Activo</option>
                      <option value={false}>Desactivado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="h-4 w-4 inline mr-1" />
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <ImageIcon className="h-4 w-4 inline mr-1" />
                    Imagen
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {modalMode === "edit" && selectedProduct?.imagenUrl && (
                    <p className="text-xs text-gray-500 mt-1">
                      Imagen actual: {selectedProduct.imagenUrl}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especificaciones
                  </label>
                  <textarea
                    name="especificaciones"
                    value={formData.especificaciones}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Características técnicas del producto"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="oferta"
                      checked={formData.oferta}
                      onChange={handleInputChange}
                      className="mr-2 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Producto en oferta
                    </label>
                  </div>

                  {formData.oferta && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descuento (%)
                      </label>
                      <input
                        type="number"
                        name="descuento"
                        value={formData.descuento}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center disabled:bg-blue-400"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Procesando..."
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {modalMode === "create"
                          ? "Crear Producto"
                          : "Guardar Cambios"}
                      </>
                    )}
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

export default AdminProductos;
