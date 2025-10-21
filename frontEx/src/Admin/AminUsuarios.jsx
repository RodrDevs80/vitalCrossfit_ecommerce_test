import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Eye,
  EyeOff,
  User,
  Mail,
  Shield,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Lock,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import getAllUsuarios from "../services/getAllUsuarios";
import eliminarAlert from "../services/alertaDeEliminacion";
import { logoutAdmin } from "../services/serviceLogout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import createUsuarioService from "../services/createUsuarioService";
import updateUsuarioService from "../services/updateUsuarioService";
import deleteUsuarioService from "../services/deleteUsuarioService";

const AdminUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [_, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    rol: "bronce",
    activo: true,
  });
  const navigate = useNavigate();
  const roles = ["bronce", "plata", "oro"];
  const usersPerPage = 10;

  const getUsers = async () => {
    try {
      setLoading(true);
      const usuarios = await getAllUsuarios();
      setUsers(usuarios);
      setFilteredUsers(usuarios);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      if (err.message === "Token expirado") {
        Swal.fire({
          title: "Cerrando sesión!",
          text: "Token expirado",
          icon: "info",
          confirmButtonText: "Ok",
        });
        logoutAdmin();
        navigate("/administrador");
      } else {
        Swal.fire({
          title: "Error!",
          text: "Error al cargar los usuarios",
          icon: "error",
          confirmButtonText: "Ok",
        });
        setUsers([]);
        setFilteredUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);

    if (mode === "create") {
      setFormData({
        id: null,
        nombre: "",
        apellido: "",
        email: "",
        contrasena: "",
        rol: "bronce",
        activo: true,
      });
    } else if (user) {
      setFormData({
        ...user,
        contrasena: "", // No mostrar la contraseña actual por seguridad
      });
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      contrasena: "",
      rol: "bronce",
      activo: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "select-one" && name === "activo" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === "create") {
        const newUser = {
          ...formData,
        };
        await createUsuarioService(newUser);
        Swal.fire({
          title: "Éxito!",
          text: "Usuario creado correctamente",
          icon: "success",
          confirmButtonText: "Ok",
        });
      } else if (modalMode === "edit") {
        const updatedUser = {
          ...formData,
          // Si no se cambió la contraseña, no enviar el campo
          ...(formData.contrasena === "" && { contrasena: undefined }),
        };
        await updateUsuarioService(updatedUser.id, updatedUser);
        Swal.fire({
          title: "Éxito!",
          text: "Usuario actualizado correctamente",
          icon: "success",
          confirmButtonText: "Ok",
        });
      }

      // Recargar la lista de usuarios
      await getUsers();
      closeModal();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.message || "Error al procesar la solicitud",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmacion = await eliminarAlert();
    if (confirmacion) {
      try {
        deleteUsuarioService(id)
          .then((res) => console.log(res))
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
          text: "El usuario ha sido eliminado",
          icon: "success",
          confirmButtonText: "Ok",
        });
        await getUsers();
      } catch (err) {
        console.log(err.message);
        Swal.fire({
          title: "Error!",
          text: "Error al eliminar el usuario",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "oro":
        return "bg-yellow-100 text-yellow-800";
      case "plata":
        return "bg-gray-100 text-gray-800";
      case "bronce":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrar usuarios
  useEffect(() => {
    if (!Array.isArray(users)) {
      setFilteredUsers([]);
      return;
    }

    let filtered = users.filter((user) => {
      const matchesSearch =
        user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "" || user.rol === filterRole;
      const matchesStatus =
        filterStatus === "" ||
        (filterStatus === "Activo" && user.activo === true) ||
        (filterStatus === "Desactivado" && user.activo === false);

      return matchesSearch && matchesRole && matchesStatus;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus, users]);

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = Array.isArray(filteredUsers)
    ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    : [];
  const totalPages = Math.ceil(
    (Array.isArray(filteredUsers) ? filteredUsers.length : 0) / usersPerPage
  );

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="p-6 bg-gray-50 min-h-screen flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando usuarios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="p-6 bg-gray-50 min-h-screen flex-1">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600">
                {Array.isArray(users) ? users.length : 0} usuarios encontrados
              </p>
            </div>
            <button
              onClick={() => openModal("create")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Usuario
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="Activo">Activo</option>
              <option value="Desactivado">Desactivado</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Modificación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.nombre} {user.apellido}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            user.rol
                          )}`}
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          {user.rol?.charAt(0).toUpperCase() +
                            user.rol?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.activo === true
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.activo === true ? (
                            <Eye className="h-3 w-3 mr-1" />
                          ) : (
                            <EyeOff className="h-3 w-3 mr-1" />
                          )}
                          {user.activo === true ? "Activo" : "Desactivado"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.fechaActualizacion
                          ? new Date(
                              user.fechaActualizacion
                            ).toLocaleDateString("es-AR")
                          : "Sin modificar"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openModal("edit", user)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                            title="Editar"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-24 text-center">
                      <div className="text-gray-500">
                        <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">
                          No se encontraron usuarios
                        </p>
                        <p className="mt-2">
                          Intenta ajustar los filtros de búsqueda
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
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
                        {indexOfFirstUser + 1}
                      </span>{" "}
                      a{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastUser, filteredUsers.length)}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium">
                        {filteredUsers.length}
                      </span>{" "}
                      usuarios
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
                  {modalMode === "create" ? "Crear Usuario" : "Editar Usuario"}
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
                      Nombre
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
                      <User className="h-4 w-4 inline mr-1" />
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleInputChange}
                    required={modalMode === "create"}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      modalMode === "edit"
                        ? "Dejar vacío para mantener contraseña actual"
                        : ""
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Shield className="h-4 w-4 inline mr-1" />
                      Rol
                    </label>
                    <select
                      name="rol"
                      value={formData.rol}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      name="activo"
                      value={formData.activo.toString()}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">Activo</option>
                      <option value="false">Desactivado</option>
                    </select>
                  </div>
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
                      ? "Crear Usuario"
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

export default AdminUsuarios;
