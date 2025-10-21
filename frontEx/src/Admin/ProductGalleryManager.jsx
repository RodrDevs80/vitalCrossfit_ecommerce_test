import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Trash2,
  Search,
  Package,
  ChevronLeft,
  ChevronRight,
  Save,
  Download,
} from "lucide-react";
import axios from "axios";
import getAllProductos from "../services/getAllProductos";
import { Sidebar } from "./Sidebar";
import eliminarAlert from "../services/alertaDeEliminacion";
import SwAlertaComp from "../services/SwAlertaComp";

const ProductGalleryManager = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const fileInputRef = useRef(null);

  const productsPerPage = 10;

  // Cargar lista de productos
  const fetchProducts = async (page = 1, search = "") => {
    setIsLoadingProducts(true);
    try {
      const params = {
        page: page,
        limit: productsPerPage,
        orderBy: "nombre",
        orderDirection: "ASC",
      };

      if (search) {
        params.search = search;
      }

      const response = await getAllProductos(params);

      if (response.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
        setCurrentPage(page);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      SwAlertaComp("Error!", "Error al cargar la lista de productos", "error");
      setProducts([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Cargar imágenes del producto seleccionado
  const fetchProductImages = async (productId) => {
    if (!productId) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/files/imagenes-db/${productId}`
      );

      if (response.data.success) {
        setImages(response.data.images);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (selectedProduct) {
      fetchProductImages(selectedProduct.id);
    }
  }, [selectedProduct]);

  // Manejar selección de archivos
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  // Eliminar archivo de la lista de seleccionados
  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Función para subir múltiples imágenes
  const uploadImages = async () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("archivos", file);
    });

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/files/upload/multiple/${selectedProduct.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        // Recargar las imágenes y limpiar archivos seleccionados
        await fetchProductImages(selectedProduct.id);
        setSelectedFiles([]);
        SwAlertaComp(
          "Operación exitosa",
          "Imágenes agregadas con éxito",
          "success"
        );
      }
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      SwAlertaComp(
        "Error!",
        "Error al subir las imágenes. Por favor, intenta nuevamente.",
        "error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Función para eliminar una imagen existente
  const deleteImage = async (imageId) => {
    const confirmacion = await eliminarAlert("archivo imagen");
    if (!confirmacion) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/v1/files/${imageId}`);

      // Actualizar la lista de imágenes localmente
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      SwAlertaComp(
        "Operación exitosa",
        "Imagen eliminada exitosamente",
        "success"
      );
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      SwAlertaComp(
        "Error!",
        "Error al eliminar la imagen. Por favor, intenta nuevamente.",
        "error"
      );
    }
  };

  // Manejar drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (files.length > 0) {
        setSelectedFiles((prev) => [...prev, ...files]);
      }
    }
  };

  // Formatear tamaño del archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  // Manejar búsqueda
  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(1, searchTerm);
  };

  // Paginación
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen overflow-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Galerías de Productos
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Total: {totalItems} productos
              </p>
            </div>
          </div>

          {/* Buscador */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de selección de productos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Lista de Productos
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {products.length} productos mostrados
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {isLoadingProducts ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando productos...</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product);
                          setSelectedFiles([]); // Limpiar archivos seleccionados al cambiar producto
                        }}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedProduct?.id === product.id
                            ? "bg-blue-50 border-r-2 border-blue-600"
                            : ""
                        }`}
                      >
                        <div className="flex items-center">
                          <img
                            src={product.imagenUrl || "/placeholder-image.jpg"}
                            alt={product.nombre}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.nombre}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatPrice(product.precio)}
                            </p>
                            <div className="flex items-center mt-1">
                              <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                                  product.activo
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {product.activo ? "Activo" : "Inactivo"}
                              </span>
                              {product.oferta && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 ml-1">
                                  {product.descuento}% OFF
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Paginación de productos */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() =>
                          fetchProducts(currentPage - 1, searchTerm)
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() =>
                          fetchProducts(currentPage + 1, searchTerm)
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
                          Página{" "}
                          <span className="font-medium">{currentPage}</span> de{" "}
                          <span className="font-medium">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() =>
                              fetchProducts(currentPage - 1, searchTerm)
                            }
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          {getPaginationRange().map((page) => (
                            <button
                              key={page}
                              onClick={() => fetchProducts(page, searchTerm)}
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
                              fetchProducts(currentPage + 1, searchTerm)
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

          {/* Panel de gestión de galería */}
          <div className="lg:col-span-2">
            {selectedProduct ? (
              <div className="bg-white rounded-lg shadow-sm">
                {/* Header del producto seleccionado */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={
                          selectedProduct.imagenUrl || "/placeholder-image.jpg"
                        }
                        alt={selectedProduct.nombre}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {selectedProduct.nombre}
                        </h2>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-gray-600">
                            ID: {selectedProduct.id}
                          </p>
                          <span className="text-gray-300">•</span>
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(selectedProduct.precio)}
                          </p>
                          {selectedProduct.oferta && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                {selectedProduct.descuento}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Área de carga de archivos */}
                <div className="p-6 border-b border-gray-200">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="space-y-3">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Arrastra y suelta tus imágenes aquí
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          o haz clic para seleccionar archivos
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          PNG, JPG, GIF, WEBP hasta 10MB cada una
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Seleccionar Imágenes
                      </button>
                    </div>
                  </div>

                  {/* Lista de archivos seleccionados */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Archivos seleccionados ({selectedFiles.length})
                      </h3>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                          >
                            <div className="flex items-center">
                              <ImageIcon className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeSelectedFile(index)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Botón de submit */}
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={uploadImages}
                          disabled={isUploading || selectedFiles.length === 0}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Subiendo...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Subir {selectedFiles.length} Imágenes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lista de imágenes existentes */}
                <div className="p-6">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Cargando imágenes...</p>
                    </div>
                  ) : images.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Imágenes Existentes ({images.length})
                        </h3>
                        <div className="text-sm text-gray-500">
                          Tamaño total:{" "}
                          {formatFileSize(
                            images.reduce((total, img) => total + img.size, 0)
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {images.map((image) => (
                          <div
                            key={image.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center">
                              <ImageIcon className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {image.originalName}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>{formatFileSize(image.size)}</span>
                                  <span>{formatDate(image.uploadDate)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <a
                                href={image.downloadUrl}
                                download={image.originalName}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                title="Descargar"
                              >
                                <Download className="h-4 w-4" />
                              </a>
                              <button
                                onClick={() =>
                                  deleteImage(image.id, image.filename)
                                }
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No hay imágenes cargadas para este producto.
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Selecciona y sube imágenes para crear una galería del
                        producto.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Selecciona un producto
                </h3>
                <p className="text-gray-500">
                  Elige un producto de la lista para gestionar su galería de
                  imágenes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGalleryManager;
